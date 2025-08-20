import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ApplicationRow {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  status: string | null;
  cv_url: string | null;
}

const AdminApplicationsPage = () => {
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check user role
  useEffect(() => {
    const checkUserRole = async () => {
      if (authLoading) return;
      
      if (!user) {
        toast.error("Please log in to access this page");
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          toast.error("Error checking permissions");
          navigate('/');
          return;
        }

        const role = data?.role;
        setUserRole(role);

        if (role !== 'admin') {
          toast.error("Access denied. Admin privileges required.");
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        toast.error("Error checking permissions");
        navigate('/');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("teacher_applications")
        .select("id, created_at, full_name, email, status, cv_url")
        .order("created_at", { ascending: false });
      if (!error && data) setRows(data as any);
      setLoading(false);
    })();
  }, []);

  const exportCsv = () => {
    const header = ["Name", "Email", "Submission Date", "Status"].join(",");
    const body = rows.map(r => [r.full_name, r.email, new Date(r.created_at).toISOString(), r.status ?? "new"].join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `teacher-applications-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("teacher_applications").update({ status }).eq("id", id);
    if (!error) setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const openCalendly = (row: ApplicationRow) => {
    const CALENDLY_URL = "https://calendly.com/"; // Replace with real org link
    window.open(CALENDLY_URL, "_blank");
  };

  const signedUrl = async (path: string | null) => {
    if (!path) return null;
    const { data } = await supabase.storage.from("teacher-documents").createSignedUrl(path, 60 * 60);
    return data?.signedUrl ?? null;
  };

  // Show loading while checking authentication
  if (authLoading || checkingAuth) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div>Checking permissions...</div>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authorized (will be redirected)
  if (!user || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Admin — Teacher Applications</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Applications</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
        </div>
      </div>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Submitted</th>
                <th className="py-2">Status</th>
                <th className="py-2">CV</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2">{r.full_name}</td>
                  <td className="py-2">{r.email}</td>
                  <td className="py-2">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="py-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={r.status ?? "new"}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </td>
                  <td className="py-2">
                    {r.cv_url ? (
                      <button
                        className="underline text-primary"
                        onClick={async () => {
                          const url = await signedUrl(r.cv_url);
                          if (url) window.open(url, "_blank");
                        }}
                      >
                        Open CV
                      </button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-2">
                    <Button variant="outline" size="sm" onClick={() => openCalendly(r)}>Send Calendly Invite</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsPage;
