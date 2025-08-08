import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts";

interface Course { id: string; title: string }

export default function TeacherAnalyticsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [gradeData, setGradeData] = useState<any[]>([]);
  const [completion, setCompletion] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      const { data: courseRows } = await supabase
        .from("courses")
        .select("id, title")
        .eq("teacher_id", user.id)
        .eq("is_active", true);
      const list = (courseRows || []) as Course[];
      setCourses(list);
      if (list.length > 0) setSelectedCourse(list[0].id);
    };
    init();
  }, [user]);

  useEffect(() => {
    const load = async () => {
      if (!selectedCourse) return;
      try {
        // Attendance trend: present count per session
        const [{ data: sessions }, { data: attendance } ] = await Promise.all([
          supabase.from("course_sessions").select("id, session_number").eq("course_id", selectedCourse).order("session_number"),
          supabase.from("attendance").select("session_id, status").eq("course_id", selectedCourse),
        ]);
        const attMap: Record<string, number> = {};
        (attendance || []).forEach((r: any) => {
          if (r.status === "present") {
            attMap[r.session_id] = (attMap[r.session_id] || 0) + 1;
          }
        });
        const aData = (sessions || []).map((s: any) => ({
          name: `S${s.session_number}`,
          present: attMap[s.id] || 0,
        }));
        setAttendanceData(aData);

        // Grade averages by session
        const { data: subs } = await supabase
          .from("submissions")
          .select(`points_earned, assignment_id, assignments:assignments(session_id), cs:assignments!inner(session_id)`) // alias workaround
          .eq("cs.session_id", null); // noop to get types
        // Fallback: fetch assignments & submissions separately
        const [assignmentsRes, submissionsRes] = await Promise.all([
          supabase.from("assignments").select("id, session_id, max_points").in("session_id", (sessions || []).map((s: any) => s.id)),
          supabase.from("submissions").select("assignment_id, points_earned"),
        ]);
        const asns = assignmentsRes.data || [];
        const subs2 = submissionsRes.data || [];
        const bySession: Record<string, { total: number; count: number; max: number } > = {};
        asns.forEach((a: any) => {
          bySession[a.session_id] = bySession[a.session_id] || { total: 0, count: 0, max: a.max_points || 100 };
        });
        subs2.forEach((s: any) => {
          const a = asns.find((x: any) => x.id === s.assignment_id);
          if (!a) return;
          const b = bySession[a.session_id] || { total: 0, count: 0, max: a.max_points || 100 };
          b.total += (s.points_earned ?? 0);
          b.count += 1;
          b.max = a.max_points || b.max;
          bySession[a.session_id] = b;
        });
        const gData = (sessions || []).map((s: any) => {
          const b = bySession[s.id] || { total: 0, count: 0, max: 100 };
          const avgPct = b.count ? Math.round((b.total / (b.count * b.max)) * 100) : 0;
          return { name: `S${s.session_number}`, avg: avgPct };
        });
        setGradeData(gData);

        // Completion percent: avg enrollment progress
        const { data: enrolls } = await supabase
          .from("enrollments")
          .select("progress_percentage")
          .eq("course_id", selectedCourse)
          .eq("is_active", true);
        const avg = Math.round(((enrolls || []).reduce((acc: number, e: any) => acc + (e.progress_percentage || 0), 0) / ((enrolls || []).length || 1)));
        setCompletion(avg);
      } catch (e) {
        console.error(e);
        toast({ title: "Failed to load analytics", description: "Please try again.", variant: "destructive" });
      }
    };
    load();
  }, [selectedCourse]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Attendance, grades, and completion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-w-sm">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
            <SelectContent>
              {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Attendance Trend */}
          <div className="col-span-1 xl:col-span-1">
            <h4 className="font-medium mb-2">Attendance Trend (Present)</h4>
            <ChartContainer config={{ present: { label: "Present", color: "hsl(var(--primary))" } }}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="present" stroke="var(--color-present)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Grade Averages */}
          <div className="col-span-1 xl:col-span-1">
            <h4 className="font-medium mb-2">Average Grade by Session</h4>
            <ChartContainer config={{ avg: { label: "Avg %", color: "hsl(var(--primary))" } }}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avg" fill="var(--color-avg)" radius={[4,4,0,0]} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Completion */}
          <div className="col-span-1 xl:col-span-1">
            <h4 className="font-medium mb-2">Average Completion</h4>
            <div className="p-6 border rounded-lg flex flex-col items-center justify-center h-[300px]">
              <div className="text-5xl font-bold">{completion}%</div>
              <div className="text-muted-foreground mt-2">Across active enrollments</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
