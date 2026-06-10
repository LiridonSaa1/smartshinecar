import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useListServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  getListServicesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

type ServiceForm = {
  name: string;
  description: string;
  price: string;
  duration: string;
  isActive: boolean;
};

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [editService, setEditService] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<ServiceForm>({ name: "", description: "", price: "", duration: "", isActive: true });

  const { data: services, isLoading } = useListServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });

  const openEdit = (s: any) => {
    setEditService(s);
    setForm({ name: s.name, description: s.description ?? "", price: String(s.price), duration: String(s.duration), isActive: s.isActive });
  };

  const openAdd = () => {
    setForm({ name: "", description: "", price: "", duration: "", isActive: true });
    setAddOpen(true);
  };

  const handleSave = () => {
    if (!editService) return;
    updateService.mutate({
      id: editService.id,
      data: { name: form.name, description: form.description, price: parseFloat(form.price), duration: parseInt(form.duration), isActive: form.isActive },
    }, {
      onSuccess: () => { toast.success("Service updated."); setEditService(null); invalidate(); },
      onError: () => toast.error("Update failed."),
    });
  };

  const handleAdd = () => {
    if (!form.name || !form.price || !form.duration) return toast.error("Name, price, and duration are required.");
    createService.mutate({
      data: { name: form.name, description: form.description, price: parseFloat(form.price), duration: parseInt(form.duration), isActive: form.isActive },
    }, {
      onSuccess: () => { toast.success("Service created."); setAddOpen(false); invalidate(); },
      onError: () => toast.error("Create failed."),
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteService.mutate({ id: deleteId }, {
      onSuccess: () => { toast.success("Service deleted."); setDeleteId(null); invalidate(); },
      onError: () => toast.error("Delete failed."),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground mt-1">Manage the services you offer.</p>
          </div>
          <Button onClick={openAdd} data-testid="button-add-service">
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left py-3 px-5 text-muted-foreground font-medium">Service</th>
                  <th className="text-left py-3 px-5 text-muted-foreground font-medium">Duration</th>
                  <th className="text-left py-3 px-5 text-muted-foreground font-medium">Price</th>
                  <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-5 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services?.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors" data-testid={`row-service-${s.id}`}>
                    <td className="py-4 px-5">
                      <p className="font-medium text-card-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.description || "No description"}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className="flex items-center gap-1.5 text-card-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {s.duration} min
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="h-3.5 w-3.5" />
                        {s.price}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.isActive ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)} data-testid={`button-edit-service-${s.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(s.id)} data-testid={`button-delete-service-${s.id}`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Add Dialog */}
      <Dialog open={!!editService || addOpen} onOpenChange={open => { if (!open) { setEditService(null); setAddOpen(false); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editService ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Full Wash" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Service description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Price ($) *</label>
                <Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="35.00" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Duration (min) *</label>
                <Input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="60" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))} />
              <label className="text-sm font-medium">Active (visible to customers)</label>
            </div>
            <Button className="w-full" onClick={editService ? handleSave : handleAdd} disabled={updateService.isPending || createService.isPending}>
              {editService ? "Save Changes" : "Create Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this service.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
