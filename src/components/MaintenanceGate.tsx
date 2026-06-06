import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import MaintenancePage from "@/pages/MaintenancePage";

// Routes that remain accessible to the public while the site is in private mode.
// Admins use /auth to sign in and bypass the gate.
const PUBLIC_ALLOWLIST = ["/auth"];

const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (cancelled) return;
      if (error) {
        setIsAdmin(false);
        return;
      }
      const roles = (data ?? []).map((r: any) => r.role);
      setIsAdmin(roles.includes("admin") || roles.includes("super_admin"));
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (PUBLIC_ALLOWLIST.includes(location.pathname)) {
    return <>{children}</>;
  }

  if (isLoading || (user && isAdmin === null)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return <MaintenancePage />;
};

export default MaintenanceGate;