import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  areasOfInterest: string[];
  availability: string[];
  cvPath: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    const resend = new Resend(resendApiKey);
    const { fullName, email, phoneNumber, country, areasOfInterest, availability, cvPath }: EmailPayload = await req.json();

    // Applicant confirmation
    await resend.emails.send({
      from: "TMA <info@teenmanagement.com>",
      to: [email],
      subject: "Your TMA Teacher Application Has Been Received",
      html: `<p>Thank you for applying to teach at TMA. Our team will review your application and contact you within 5–7 business days.</p>`
    });

    // Admin notification
    const adminBody = `New Teacher Application\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phoneNumber}\nCountry: ${country}\nAreas: ${areasOfInterest.join(", ")}\nAvailability: ${availability.join(", ")}\nCV Path: ${cvPath ?? "(none)"}`;
    await resend.emails.send({
      from: "TMA <info@teenmanagement.com>",
      to: ["info@teenmanagement.com"],
      subject: `New Teacher Application — ${fullName}`,
      text: adminBody,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error: any) {
    console.error("send-teacher-application-emails error", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
