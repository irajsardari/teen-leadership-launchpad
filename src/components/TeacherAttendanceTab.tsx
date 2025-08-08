import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Course { id: string; title: string }
interface Session { id: string; title: string; session_number: number; course_id: string }
interface Student { id: string; full_name: string | null }

type AttendanceStatus = "present" | "absent" | "late" | "excused";

export default function TeacherAttendanceTab() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus | "">>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      try {
        const { data: courseRows } = await supabase
          .from("courses")
          .select("id, title")
          .eq("teacher_id", user.id)
          .eq("is_active", true);
        setCourses((courseRows || []) as Course[]);
      } catch (e) {
        console.error("Failed to load courses", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  useEffect(() => {
    const load = async () => {
      if (!selectedCourse) return;
      const [{ data: sessionRows }, { data: enrollmentRows }] = await Promise.all([
        supabase.from("course_sessions").select("id, title, session_number, course_id").eq("course_id", selectedCourse).order("session_number"),
        supabase
          .from("enrollments")
          .select("student_id, profiles!inner(full_name)")
          .eq("course_id", selectedCourse)
          .eq("is_active", true),
      ]);
      setSessions((sessionRows || []) as Session[]);
      setStudents((enrollmentRows || []).map((e: any) => ({ id: e.student_id, full_name: e.profiles?.full_name })) as Student[]);
    };
    load();
    setSelectedSession("");
    setStatusMap({});
  }, [selectedCourse]);

  useEffect(() => {
    const preload = async () => {
      if (!selectedCourse || !selectedSession) return;
      const { data } = await supabase
        .from("attendance")
        .select("student_id, status")
        .eq("course_id", selectedCourse)
        .eq("session_id", selectedSession);
      const initial: Record<string, AttendanceStatus> = {};
      (data || []).forEach((r: any) => { initial[r.student_id] = r.status as AttendanceStatus; });
      setStatusMap(initial);
    };
    preload();
  }, [selectedCourse, selectedSession]);

  const handleSave = async () => {
    if (!user || !selectedCourse || !selectedSession) {
      toast({ title: "Select course & session", description: "Please choose both before saving.", variant: "destructive" });
      return;
    }
    const rows = Object.entries(statusMap)
      .filter(([, s]) => !!s)
      .map(([student_id, status]) => ({
        student_id,
        course_id: selectedCourse,
        session_id: selectedSession,
        status,
        notes: null,
        recorded_by: user.id,
      }));
    if (rows.length === 0) {
      toast({ title: "Nothing to save", description: "Set at least one status.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("attendance").insert(rows as any[]);
      if (error) throw error;
      toast({ title: "Saved", description: "Attendance recorded." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Save failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const statusOptions: AttendanceStatus[] = ["present", "absent", "late", "excused"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>Record attendance per session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Session</Label>
            <Select value={selectedSession} onValueChange={setSelectedSession} disabled={!selectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map(s => (
                  <SelectItem key={s.id} value={s.id}>Session {s.session_number}: {s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!selectedCourse ? (
          <p className="text-muted-foreground">Select a course to begin.</p>
        ) : (
          <div className="space-y-2">
            {students.length === 0 && (
              <p className="text-muted-foreground">No students enrolled in this course.</p>
            )}
            {students.map(st => (
              <div key={st.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{st.full_name || "Student"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={statusMap[st.id] || ""}
                    onValueChange={(v: AttendanceStatus) => setStatusMap(prev => ({ ...prev, [st.id]: v }))}
                    disabled={!selectedSession}
                  >
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Set status" /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving || !selectedCourse || !selectedSession}>
            {saving ? "Saving…" : "Save Attendance"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
