import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2, Search, Phone, Tag, Globe, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const API = "/api";

type Message = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  source?: string;
  status: "unread" | "read";
  createdAt: string;
};

function useMessages() {
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch(`${API}/messages`);
      if (!res.ok) throw new Error("Failed to load messages");
      return res.json();
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contact Page",
  "private-valeting": "Private Valeting",
  "car-detailing": "Car Detailing",
  "commercial-valeting": "Commercial Valeting",
  gallery: "Gallery",
  booking: "Booking",
};

export default function AdminMessages() {
  const { data: messages, isLoading } = useMessages();
  const markRead = useMarkRead();
  const deleteMessage = useDeleteMessage();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read">("all");
  const [viewMsg, setViewMsg] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = (messages ?? []).filter(m => {
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const unreadCount = (messages ?? []).filter(m => m.status === "unread").length;

  const handleView = (msg: Message) => {
    setViewMsg(msg);
    if (msg.status === "unread") {
      markRead.mutate(msg.id);
    }
  };

  const handleDelete = () => {
    if (deleteId == null) return;
    deleteMessage.mutate(deleteId, {
      onSuccess: () => { toast.success("Message deleted."); setDeleteId(null); },
      onError: () => { toast.error("Delete failed."); setDeleteId(null); },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground mt-1">
              Contact form submissions from your website.
              {unreadCount > 0 && <span className="ml-2 text-blue-600 font-medium">{unreadCount} unread</span>}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or message…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "unread", "read"] as const).map(s => (
              <Button
                key={s}
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
                onClick={() => setFilterStatus(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-white border rounded-xl p-4 flex gap-4 cursor-pointer hover:shadow-sm transition-shadow ${msg.status === "unread" ? "border-blue-200 bg-blue-50/30" : "border-gray-200"}`}
                onClick={() => handleView(msg)}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {msg.status === "unread" ? (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <MailOpen className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${msg.status === "unread" ? "text-gray-900" : "text-gray-600"}`}>{msg.name}</span>
                      {msg.status === "unread" && <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0 h-5">New</Badge>}
                      {msg.source && <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 text-gray-500">{SOURCE_LABELS[msg.source] ?? msg.source}</Badge>}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{msg.email}{msg.phone ? ` · ${msg.phone}` : ""}</p>
                  <p className="text-sm text-gray-700 mt-1.5 line-clamp-2">{msg.message}</p>
                </div>
                <button
                  className="flex-shrink-0 p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors self-start"
                  onClick={e => { e.stopPropagation(); setDeleteId(msg.id); }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* View message dialog */}
      <Dialog open={!!viewMsg} onOpenChange={o => !o && setViewMsg(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {viewMsg?.name}</DialogTitle>
          </DialogHeader>
          {viewMsg && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${viewMsg.email}`} className="text-blue-600 hover:underline truncate">{viewMsg.email}</a>
                </div>
                {viewMsg.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${viewMsg.phone}`} className="text-blue-600 hover:underline">{viewMsg.phone}</a>
                  </div>
                )}
                {viewMsg.service && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{viewMsg.service}</span>
                  </div>
                )}
                {viewMsg.source && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{SOURCE_LABELS[viewMsg.source] ?? viewMsg.source}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600 col-span-2">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{formatDate(viewMsg.createdAt)}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Message</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{viewMsg.message}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <a
                  href={`mailto:${viewMsg.email}?subject=Re: Your enquiry — Smart Shine`}
                  className="flex-1"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    Reply by Email
                  </Button>
                </a>
                {viewMsg.phone && (
                  <a href={`tel:${viewMsg.phone}`}>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId != null} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the message. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
