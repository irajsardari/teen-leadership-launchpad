import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(SUPABASE_URL, SERVICE);

    // 1. Verify caller is admin
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ error: "Not authenticated" }, 401);
    }
    const { data: callerProfile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (callerProfile?.role !== "admin") {
      return json({ error: "Forbidden - admin only" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as "approve" | "reject" | "resend" | "statuses";
    if (!["approve", "reject", "resend", "statuses"].includes(action)) {
      return json({ error: "action must be approve|reject|resend|statuses" }, 400);
    }

    // STATUSES path — return activation info for a batch of approved regs
    if (action === "statuses") {
      const ids: string[] = Array.isArray(body.registration_ids) ? body.registration_ids : [];
      if (ids.length === 0) return json({ statuses: {} });
      const { data: regs } = await admin
        .from("program_registrations")
        .select("id, user_id, email, status")
        .in("id", ids);
      const result: Record<string, { activated: boolean; last_sign_in_at: string | null }> = {};
      // Fetch a single page of users (cap 200) — enough for pilot
      const { data: usersPage } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const byId = new Map(usersPage?.users?.map((u) => [u.id, u]) ?? []);
      const byEmail = new Map(
        usersPage?.users?.map((u) => [u.email?.toLowerCase() ?? "", u]) ?? []
      );
      for (const r of regs ?? []) {
        const u = (r.user_id && byId.get(r.user_id)) || byEmail.get(r.email.toLowerCase());
        result[r.id] = {
          activated: !!u?.last_sign_in_at,
          last_sign_in_at: u?.last_sign_in_at ?? null,
        };
      }
      return json({ statuses: result });
    }

    const registrationId = body.registration_id as string;
    if (!registrationId) {
      return json({ error: "registration_id required" }, 400);
    }

    // 2. Fetch registration + program
    const { data: reg, error: regErr } = await admin
      .from("program_registrations")
      .select("*, programs(id, slug, name)")
      .eq("id", registrationId)
      .maybeSingle();
    if (regErr || !reg) return json({ error: "Registration not found" }, 404);

    // RESEND path — re-trigger invite/password email for an approved user
    if (action === "resend") {
      if (reg.status !== "approved") {
        return json({ error: "Can only resend for approved registrations" }, 400);
      }
      const siteOrigin =
        req.headers.get("origin") ||
        `https://${SUPABASE_URL.split("//")[1].split(".")[0]}.lovable.app`;
      const redirectTo = `${siteOrigin}/auth`;
      // Use anon client to trigger the password-reset email Supabase sends
      // (works whether or not the user has activated yet).
      const anonClient = createClient(SUPABASE_URL, ANON);
      const { error: resetErr } = await anonClient.auth.resetPasswordForEmail(reg.email, {
        redirectTo,
      });
      if (resetErr) return json({ error: `Resend failed: ${resetErr.message}` }, 500);
      return json({ ok: true, status: "resent" });
    }

    if (reg.status !== "pending") {
      return json({ error: `Registration already ${reg.status}` }, 400);
    }

    // REJECT path
    if (action === "reject") {
      await admin.from("program_registrations").update({
        status: "rejected",
        reviewed_by: userData.user.id,
        reviewed_at: new Date().toISOString(),
      }).eq("id", registrationId);
      return json({ ok: true, status: "rejected" });
    }

    // APPROVE path
    const program = reg.programs as { id: string; slug: string; name: string } | null;
    if (!program) return json({ error: "Program missing" }, 500);

    // 3. Find first course in this program for enrollment
    const { data: course } = await admin
      .from("courses")
      .select("id")
      .eq("program_id", program.id)
      .eq("is_active", true)
      .order("term_number", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!course) return json({ error: "No course exists for this program yet" }, 400);

    // 4. Find or invite the user
    let userId: string | null = null;
    const siteOrigin =
      req.headers.get("origin") ||
      `https://${Deno.env.get("SUPABASE_URL")!.split("//")[1].split(".")[0]}.lovable.app`;
    const redirectTo = `${siteOrigin}/auth`;

    // Try to find existing user by email (paginate up to a reasonable cap)
    const { data: existingList } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = existingList?.users?.find(
      (u) => u.email?.toLowerCase() === reg.email.toLowerCase()
    );

    if (existing) {
      userId = existing.id;
    } else {
      const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(
        reg.email,
        {
          redirectTo,
          data: { full_name: reg.full_name, program_slug: program.slug },
        }
      );
      if (invErr || !invited.user) {
        return json({ error: `Invite failed: ${invErr?.message ?? "unknown"}` }, 500);
      }
      userId = invited.user.id;
    }

    // 5. Ensure profile exists; only set executive_student lms_role for brand-new
    // profiles so we never demote an existing admin / teacher.
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id, lms_role")
      .eq("id", userId!)
      .maybeSingle();
    if (!existingProfile) {
      const { error: profErr } = await admin.from("profiles").insert({
        id: userId!,
        full_name: reg.full_name,
        lms_role: "executive_student",
      });
      if (profErr) {
        return json({ error: `Profile create failed: ${profErr.message}` }, 500);
      }
    }

    // 6. Create enrollment if missing
    const { data: existingEnroll } = await admin
      .from("enrollments")
      .select("id")
      .eq("student_id", userId!)
      .eq("course_id", course.id)
      .maybeSingle();
    if (!existingEnroll) {
      const { error: enrollErr } = await admin.from("enrollments").insert({
        student_id: userId!,
        course_id: course.id,
        is_active: true,
      });
      if (enrollErr) return json({ error: `Enrollment failed: ${enrollErr.message}` }, 500);
    }

    // 7. Mark registration approved with user_id
    await admin
      .from("program_registrations")
      .update({
        status: "approved",
        user_id: userId,
        reviewed_by: userData.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", registrationId);

    return json({
      ok: true,
      status: "approved",
      user_id: userId,
      enrolled_course_id: course.id,
      invited: !existing,
    });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}