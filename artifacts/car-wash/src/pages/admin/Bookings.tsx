import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useListBookings,
  useUpdateBooking,
  useDeleteBooking,
  useCreateBooking,
  useListServices,
  getListBookingsQueryKey,
} from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ALL_STATUSES = ["pending", "confirmed", "in_progress", "done", "cancelled"] as const;
type Status = typeof ALL_STATUSES[number];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-orange-100 text-orange-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

type BookingFormData = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  notes: string;
};

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminBookings() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editBooking, setEditBooking] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "", customerPhone: "", customerEmail: "",
    serviceId: "", date: getTodayDate(), time: "09:00", status: "pending", notes: "",
  });

  const { data: bookings, isLoading } = useListBookings(
    statusFilter !== "all" ? { status: statusFilter as Status } : undefined,
    { query: { queryKey: getListBookingsQueryKey(statusFilter !== "all" ? { status: statusFilter as Status } : undefined) } }
  );
  const { data: services } = useListServices();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const createBooking = useCreateBooking();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey({ status: statusFilter as Status }) });
  };

  const filtered = bookings?.filter(b =>
    b.customerName.toLowerCase().includes(search.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
    b.customerPhone.includes(search)
  ) ?? [];

  const openEdit = (b: any) => {
    setEditBooking(b);
    setFormData({
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      customerEmail: b.customerEmail ?? "",
      serviceId: String(b.serviceId),
      date: b.date,
      time: b.time,
      status: b.status,
      notes: b.notes ?? "",
    });
  };

  const handleSave = () => {
    if (!editBooking) return;
    updateBooking.mutate({
      id: editBooking.id,
      data: {
        ...formData,
        serviceId: formData.serviceId ? parseInt(formData.serviceId) : undefined,
        status: formData.status as Status,
      },
    }, {
      onSuccess: () => { toast.success("Booking updated."); setEditBooking(null); invalidate(); },
      onError: () => toast.error("Update failed."),
    });
  };

  const handleAdd = () => {
    if (!formData.customerName || !formData.customerPhone || !formData.serviceId || !formData.date || !formData.time) {
      return toast.error("Please fill all required fields.");
    }
    createBooking.mutate({
      data: {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        serviceId: parseInt(formData.serviceId),
        date: formData.date,
        time: formData.time,
        notes: formData.notes || undefined,
      },
    }, {
      onSuccess: () => { toast.success("Booking added."); setAddOpen(false); invalidate(); },
      onError: () => toast.error("Failed to add booking."),
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteBooking.mutate({ id: deleteId }, {
      onSuccess: () => { toast.success("Booking deleted."); setDeleteId(null); invalidate(); },
      onError: () => toast.error("Delete failed."),
    });
  };

  const openAddForm = () => {
    setFormData({ customerName: "", customerPhone: "", customerEmail: "", serviceId: "", date: getTodayDate(), time: "09:00", status: "pending", notes: "" });
    setAddOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage all customer bookings.</p>
          </div>
          <Button onClick={openAddForm} data-testid="button-add-booking">
            <Plus className="mr-2 h-4 w-4" /> Add Booking
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-bookings-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, service..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...ALL_STATUSES].map((s) => (
              <button
                key={s}
                data-testid={`filter-status-${s}`}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {s === "all" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl py-16 text-center">
            <p className="text-muted-foreground">No bookings found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                data-testid={`row-booking-${b.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.customerPhone}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">#{b.id}</span>
                </div>

                {/* Service */}
                <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2">
                  <span className="text-sm text-card-foreground font-medium truncate">{b.serviceName}</span>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {b.date} · {b.time}
                </div>

                {/* Footer: status + actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50 mt-auto">
                  <select
                    value={b.status}
                    onChange={e => {
                      const newStatus = e.target.value as Status;
                      updateBooking.mutate(
                        { id: b.id, data: { status: newStatus } },
                        {
                          onSuccess: () => { toast.success(`Status → ${newStatus.replace("_", " ")}`); invalidate(); },
                          onError: () => toast.error("Status update failed."),
                        }
                      );
                    }}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${STATUS_COLORS[b.status] ?? ""}`}
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)} data-testid={`button-edit-booking-${b.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(b.id)} data-testid={`button-delete-booking-${b.id}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={!!editBooking || addOpen} onOpenChange={(open) => { if (!open) { setEditBooking(null); setAddOpen(false); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editBooking ? "Edit Booking" : "Add Booking"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Name *</label>
                <Input value={formData.customerName} onChange={e => setFormData(f => ({ ...f, customerName: e.target.value }))} placeholder="Customer name" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Phone *</label>
                <Input value={formData.customerPhone} onChange={e => setFormData(f => ({ ...f, customerPhone: e.target.value }))} placeholder="+383..." />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Service *</label>
              <Select value={formData.serviceId} onValueChange={v => setFormData(f => ({ ...f, serviceId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>
                  {services?.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Date *</label>
                <Input type="date" value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Time *</label>
                <Input value={formData.time} onChange={e => setFormData(f => ({ ...f, time: e.target.value }))} placeholder="09:00" />
              </div>
            </div>
            {editBooking && (
              <div>
                <label className="text-xs font-medium mb-1 block">Status</label>
                <Select value={formData.status} onValueChange={v => setFormData(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button className="w-full" onClick={editBooking ? handleSave : handleAdd} disabled={updateBooking.isPending || createBooking.isPending}>
              {editBooking ? "Save Changes" : "Add Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The booking will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
