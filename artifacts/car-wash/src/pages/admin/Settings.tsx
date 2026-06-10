import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateSettings = useUpdateSettings();

  const [form, setForm] = useState({
    businessName: "",
    address: "",
    phone: "",
    email: "",
    openTime: "08:00",
    closeTime: "19:00",
    slotDuration: 30,
    workingDays: ALL_DAYS,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        businessName: settings.businessName,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        openTime: settings.openTime,
        closeTime: settings.closeTime,
        slotDuration: settings.slotDuration,
        workingDays: settings.workingDays,
      });
    }
  }, [settings]);

  const toggleDay = (day: string) => {
    setForm(f => ({
      ...f,
      workingDays: f.workingDays.includes(day)
        ? f.workingDays.filter(d => d !== day)
        : [...f.workingDays, day],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast.success("Settings saved.");
      },
      onError: () => toast.error("Save failed."),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your business information and hours.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Business Info */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-card-foreground">Business Information</h2>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                <Input data-testid="input-business-name" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Address</label>
                <Input data-testid="input-business-address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone</label>
                  <Input data-testid="input-business-phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input data-testid="input-business-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-card-foreground">Working Hours & Slots</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Opening Time</label>
                  <Input data-testid="input-open-time" type="time" value={form.openTime} onChange={e => setForm(f => ({ ...f, openTime: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Closing Time</label>
                  <Input data-testid="input-close-time" type="time" value={form.closeTime} onChange={e => setForm(f => ({ ...f, closeTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Slot Duration (minutes)</label>
                <Input
                  data-testid="input-slot-duration"
                  type="number"
                  min={15}
                  step={15}
                  max={120}
                  value={form.slotDuration}
                  onChange={e => setForm(f => ({ ...f, slotDuration: parseInt(e.target.value) || 30 }))}
                  className="max-w-[150px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block">Working Days</label>
                <div className="flex gap-2 flex-wrap">
                  {ALL_DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        form.workingDays.includes(day)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={updateSettings.isPending} data-testid="button-save-settings">
              {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
