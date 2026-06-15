import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

export const Route = createFileRoute("/driver/reviews")({
  component: ReviewsPage,
});

const reviews = [
  { name: "Priya S.", rating: 5, time: "2 days ago", text: "Very punctual and drove smoothly throughout the city. Highly recommend!" },
  { name: "Arjun M.", rating: 5, time: "5 days ago", text: "Professional behavior and great knowledge of routes. Will book again." },
  { name: "Neha R.", rating: 4, time: "1 week ago", text: "Good driver, polite. Reached on time. Could improve on highway lane discipline." },
  { name: "Vikram T.", rating: 5, time: "2 weeks ago", text: "Excellent driving. Felt safe with family in the car." },
  { name: "Sana K.", rating: 4, time: "3 weeks ago", text: "Friendly and careful. Helped with luggage too." },
  { name: "Rahul P.", rating: 5, time: "1 month ago", text: "Best driver I've booked on DriveMate. Five stars!" },
];

function ReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="font-display text-lg font-bold">Ratings & Reviews</h1>

      <div className="card-soft p-4 flex items-center gap-5">
        <div className="text-center">
          <div className="font-display text-4xl font-extrabold text-primary">{avg}</div>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(Number(avg)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            ))}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">{reviews.length} reviews</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {dist.map((d) => (
            <div key={d.n} className="flex items-center gap-2 text-[11px]">
              <span className="w-3 text-muted-foreground">{d.n}</span>
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${(d.count / reviews.length) * 100}%` }} />
              </div>
              <span className="w-5 text-right text-muted-foreground">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {reviews.map((r, i) => (
          <div key={i} className="card-soft p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm">{r.name}</div>
              <div className="text-[11px] text-muted-foreground">{r.time}</div>
            </div>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-3 w-3 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
