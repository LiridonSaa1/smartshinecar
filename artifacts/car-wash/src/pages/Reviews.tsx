import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useListReviews, useCreateReview, getListReviewsQueryKey } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Droplets, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function StarRating({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 transition-colors ${
            star <= (interactive ? (hovered || rating) : rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data: reviews, isLoading } = useListReviews();
  const createReview = useCreateReview();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customerName: "", rating: 5, comment: "", serviceName: "" });

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.comment) return toast.error("Please fill in all required fields.");
    createReview.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        setOpen(false);
        setForm({ customerName: "", rating: 5, comment: "", serviceName: "" });
        toast.success("Review submitted! Thank you.");
      },
      onError: () => toast.error("Failed to submit review."),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="relative py-20 bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                <Star className="h-4 w-4 fill-primary" />
                Customer Reviews
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">What Our Clients Say</h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-5xl font-bold text-primary">{avgRating}</span>
                <div>
                  <StarRating rating={Math.round(Number(avgRating))} />
                  <p className="text-sm text-muted-foreground mt-1">{reviews?.length ?? 0} reviews</p>
                </div>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" data-testid="button-write-review">
                    <Plus className="mr-2 h-4 w-4" />
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Experience</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Your Name *</label>
                      <Input data-testid="input-reviewer-name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Rating *</label>
                      <StarRating rating={form.rating} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Service (optional)</label>
                      <Input value={form.serviceName} onChange={e => setForm(f => ({ ...f, serviceName: e.target.value }))} placeholder="e.g. Full Wash" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Your Comment *</label>
                      <Textarea data-testid="input-review-comment" value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} placeholder="Tell us about your experience..." rows={4} />
                    </div>
                    <Button type="submit" className="w-full" disabled={createReview.isPending} data-testid="button-submit-review">
                      {createReview.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {reviews?.slice().reverse().map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                      data-testid={`card-review-${review.id}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-card-foreground">{review.customerName}</p>
                          {review.serviceName && <p className="text-xs text-primary mt-0.5">{review.serviceName}</p>}
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">"{review.comment}"</p>
                      <p className="text-xs text-muted-foreground/60 mt-3">
                        {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
