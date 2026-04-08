import { useState } from "react";
import {
  useGetTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate,
  getGetTemplatesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Mail, MessageSquare } from "lucide-react";

type Template = {
  id: number;
  name: string;
  type: "email" | "whatsapp";
  subject?: string | null;
  body: string;
};

function TemplateForm({ initial, onSave, onClose }: {
  initial?: Template;
  onSave: (data: { name: string; type: string; subject?: string; body: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [type, setType] = useState(initial?.type || "email");
  const [subject, setSubject] = useState(initial?.subject || "");
  const [body, setBody] = useState(initial?.body || "");

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="tpl-name">Template Name</Label>
        <Input id="tpl-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Welcome Email" data-testid="input-template-name" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="tpl-type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger data-testid="select-template-type" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {type === "email" && (
        <div>
          <Label htmlFor="tpl-subject">Subject</Label>
          <Input id="tpl-subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject line" data-testid="input-template-subject" className="mt-1" />
        </div>
      )}
      <div>
        <Label htmlFor="tpl-body">Message Body</Label>
        <Textarea
          id="tpl-body"
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write your message here..."
          rows={6}
          data-testid="input-template-body"
          className="mt-1"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave({ name, type, subject: type === "email" ? subject : undefined, body })} data-testid="btn-save-template">
          Save Template
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function Templates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: templates, isLoading } = useGetTemplates();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [showNew, setShowNew] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetTemplatesQueryKey() });

  const handleCreate = (data: any) => {
    createTemplate.mutate({ data }, {
      onSuccess: () => { toast({ title: "Template saved!" }); setShowNew(false); invalidate(); },
      onError: () => toast({ title: "Error saving template", variant: "destructive" }),
    });
  };

  const handleUpdate = (data: any) => {
    if (!editingTemplate) return;
    updateTemplate.mutate({ id: editingTemplate.id, data }, {
      onSuccess: () => { toast({ title: "Template updated!" }); setEditingTemplate(null); invalidate(); },
      onError: () => toast({ title: "Error updating template", variant: "destructive" }),
    });
  };

  const handleDelete = (id: number) => {
    deleteTemplate.mutate({ id }, {
      onSuccess: () => { toast({ title: "Template deleted" }); invalidate(); },
      onError: () => toast({ title: "Error deleting template", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">Save and reuse your campaign messages</p>
        </div>
        <Button onClick={() => setShowNew(true)} data-testid="btn-new-template">
          <Plus className="h-4 w-4 mr-2" /> New Template
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}</div>
      ) : !templates || templates.length === 0 ? (
        <Empty title="No templates yet" description="Save a template to reuse it in future campaigns." />
      ) : (
        <div className="grid gap-4">
          {templates.map(t => (
            <Card key={t.id} data-testid={`card-template-${t.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {t.type === "email"
                        ? <Mail className="h-4 w-4 text-primary" />
                        : <MessageSquare className="h-4 w-4 text-green-600" />
                      }
                      <span className="font-semibold text-foreground">{t.name}</span>
                      <Badge variant="outline" className="text-xs capitalize">{t.type}</Badge>
                    </div>
                    {t.subject && <p className="text-sm font-medium text-muted-foreground mb-1">Subject: {t.subject}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-2">{t.body}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(t as Template)} data-testid={`btn-edit-template-${t.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(t.id)} data-testid={`btn-delete-template-${t.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Template</DialogTitle></DialogHeader>
          <TemplateForm onSave={handleCreate} onClose={() => setShowNew(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTemplate} onOpenChange={o => !o && setEditingTemplate(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Template</DialogTitle></DialogHeader>
          {editingTemplate && (
            <TemplateForm initial={editingTemplate} onSave={handleUpdate} onClose={() => setEditingTemplate(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
