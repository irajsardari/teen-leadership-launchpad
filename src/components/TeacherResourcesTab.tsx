import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload } from "lucide-react";

interface TeachingResource {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  level: string | null;
  type: string | null;
  owner_id: string;
  approval_status: "pending" | "approved" | "rejected";
  visibility: "private" | "shared" | "global";
  storage_path: string;
  file_size_bytes: number | null;
  created_at: string;
}

interface TaxonomyRow { category: string; value: string }

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export default function TeacherResourcesTab() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [subjects, setSubjects] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const [resources, setResources] = useState<TeachingResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("PDF");
  const [visibility, setVisibility] = useState<"private" | "shared" | "global">("private");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: tax, error: taxErr } = await supabase
          .from("resource_taxonomy")
          .select("category, value");
        if (taxErr) throw taxErr;
        const t = (tax || []) as TaxonomyRow[];
        setSubjects(t.filter(x => x.category === "subject").map(x => x.value));
        setLevels(t.filter(x => x.category === "level").map(x => x.value));
        setTypes(t.filter(x => x.category === "type").map(x => x.value));
      } catch (e) {
        console.error("Failed to load taxonomy", e);
      }
      await fetchResources();
      setLoading(false);
    };
    init();
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("teaching_resources")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to fetch resources", error);
      return;
    }
    setResources((data || []) as TeachingResource[]);
  };

  const handleUpload = async () => {
    if (!user) return;
    if (!file) {
      toast({ title: "No file", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({ title: "File too large", description: "Limit is 100 MB.", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please add a resource title.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase
        .storage
        .from("teacher-documents")
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("teaching_resources").insert([
        {
          title,
          description: description || null,
          subject: subject || null,
          level: level || null,
          type: type || null,
          owner_id: user.id,
          visibility,
          storage_path: path,
          file_size_bytes: file.size,
        },
      ]);
      if (insErr) throw insErr;

      const resId = await getResourceIdByPath(path);
      if (resId) {
        await supabase.from("resource_access_logs").insert([
          { resource_id: resId, user_id: user.id, action: "upload" },
        ]);
      }

      toast({ title: "Uploaded", description: "Resource uploaded successfully." });
      // reset
      setTitle("");
      setDescription("");
      setSubject("");
      setLevel("");
      setType("PDF");
      setVisibility("private");
      setFile(null);
      await fetchResources();
    } catch (e: any) {
      console.error(e);
      toast({ title: "Upload failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const getResourceIdByPath = async (storagePath: string) => {
    const { data, error } = await supabase
      .from("teaching_resources")
      .select("id")
      .eq("storage_path", storagePath)
      .maybeSingle();
    if (error) return null;
    return data?.id as string | null;
  };

  const handleDownload = async (r: TeachingResource) => {
    const { data, error } = await supabase
      .storage
      .from("teacher-documents")
      .createSignedUrl(r.storage_path, 60);
    if (error || !data?.signedUrl) {
      toast({ title: "Download failed", description: "You may not have access.", variant: "destructive" });
      return;
    }
    try {
      await supabase.from("resource_access_logs").insert([
        { resource_id: r.id, user_id: user?.id as string, action: "download" },
      ]);
    } catch (_) {}
    window.open(data.signedUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-8">Loading resources…</div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Teaching Resource</CardTitle>
          <CardDescription>Files are stored securely. Limit: 100 MB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="res-title">Title</Label>
            <Input id="res-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Digital Citizenship Slides" />
          </div>
          <div>
            <Label htmlFor="res-desc">Description</Label>
            <Textarea id="res-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(v) => setVisibility(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                  <SelectItem value="global">Global (requires approval)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="res-file">File</Label>
              <Input id="res-file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <p className="text-xs text-muted-foreground mt-1">Max 100 MB. PDFs, slides, videos, docs.</p>
            </div>
          </div>
          <Button disabled={uploading} onClick={handleUpload} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading…" : "Upload Resource"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your & Shared Resources</CardTitle>
          <CardDescription>Browse your uploads and shared/global resources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No resources yet.</p>
          )}
          {resources.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{r.description || ""}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.subject && <Badge variant="secondary">{r.subject}</Badge>}
                  {r.level && <Badge variant="secondary">{r.level}</Badge>}
                  {r.type && <Badge variant="secondary">{r.type}</Badge>}
                  <Badge>{r.visibility}</Badge>
                  <Badge variant={r.approval_status === "approved" ? "default" : "secondary"}>{r.approval_status}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(r)}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
