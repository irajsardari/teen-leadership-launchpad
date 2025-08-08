import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Course { id: string; title: string }
interface Session { id: string; title: string; session_number: number; course_id: string }
interface Student { id: string; full_name: string | null }
interface Note { id: string; text: string; created_at: string; student_id: string }

export default function TeacherProgressNotesTab() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      const { data: courseRows } = await supabase
        .from("courses")
        .select("id, title")
        .eq("teacher_id", user.id)
        .eq("is_active", true);
      setCourses((courseRows || []) as Course[]);
      setLoading(false);
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
    setSelectedStudent("");
    setText("");
    setNotes([]);
  }, [selectedCourse]);

  useEffect(() => {
    const loadNotes = async () => {
      if (!selectedCourse || !selectedStudent) return;
      const { data } = await supabase
        .from("progress_notes")
        .select("id, text, created_at, student_id")
        .eq("course_id", selectedCourse)
        .eq("student_id", selectedStudent)
        .order("created_at", { ascending: false });
      setNotes((data || []) as Note[]);
    };
    loadNotes();
  }, [selectedCourse, selectedStudent]);

  const handleAddNote = async () => {
    if (!user || !selectedCourse || !selectedStudent || !text.trim()) {
      toast({ title: "Missing fields", description: "Select course & student and enter a note.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("progress_notes").insert([
        {
          student_id: selectedStudent,
          course_id: selectedCourse,
          
          teacher_id: user.id,
          text,
        }
      ]);
      if (error) throw error;
      setText("");
      // refresh
      const { data } = await supabase
        .from("progress_notes")
        .select("id, text, created_at, student_id")
        .eq("course_id", selectedCourse)
        .eq("student_id", selectedStudent)
        .order("created_at", { ascending: false });
      setNotes((data || []) as Note[]);
      toast({ title: "Note added", description: "Your note has been saved." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Save failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Notes</CardTitle>
        <CardDescription>Private notes for students in your courses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
              <SelectContent>
                {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Session (optional)</Label>
            <Select value={selectedSession} onValueChange={setSelectedSession} disabled={!selectedCourse}>
              <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
              <SelectContent>
                {sessions.map(s => (
                  <SelectItem key={s.id} value={s.id}>Session {s.session_number}: {s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={!selectedCourse}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>
                {students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name || s.id}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Add Note</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a private note..." rows={4} />
          <div className="flex justify-end">
            <Button onClick={handleAddNote} disabled={saving || !selectedCourse || !selectedStudent}>
              {saving ? "Saving…" : "Add Note"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Recent Notes</Label>
          {notes.length === 0 ? (
            <p className="text-muted-foreground">No notes yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map(n => (
                <div key={n.id} className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
                  <div className="mt-1 whitespace-pre-wrap">{n.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
