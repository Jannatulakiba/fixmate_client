import { Star, Quote } from "lucide-react";

// Placeholder social proof — replace with real reviews from the API later.
const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "Customer · Barishal",
    text: "My AC stopped cooling on the hottest day. I sent a request at night and a verified technician was at my door by morning. Loved being able to track every step.",
    initials: "NJ",
  },
  {
    name: "Tanvir Ahmed",
    role: "Customer · Dhaka",
    text: "The pricing was clear upfront and I only paid after the laptop screen was fixed. No haggling, no surprises — exactly how repairs should work.",
    initials: "TA",
  },
  {
    name: "Rakib Hasan",
    role: "Customer · Chittagong",
    text: "I could see the job status change from Requested to Completed in real time. The technician arrived on time and the warranty gave me peace of mind.",
    initials: "RH",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">
      <div className="section-head">
        <div>
          <span className="eyebrow text-secondary">Testimonials</span>
          <h2 className="section-title mt-2">What our customers say</h2>
          <p className="section-sub">Real experiences from people who booked a repair on FixMate.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="bg-base-100 border border-base-300 rounded-3xl p-6 card-hover flex flex-col"
          >
            <Quote size={26} className="text-secondary/60" />
            <div className="stars mt-3" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-current" />
              ))}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-base-content/75 flex-1">
              “{t.text}”
            </blockquote>
            <figcaption className="mt-5 pt-4 border-t border-base-300 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center text-sm shrink-0">
                {t.initials}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-primary text-sm truncate">{t.name}</p>
                <p className="text-xs text-base-content/55 truncate">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
