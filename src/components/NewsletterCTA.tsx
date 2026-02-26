"use client";
import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Store locally for now — will integrate with Supabase later
    const stored = JSON.parse(localStorage.getItem("newsletter_emails") || "[]");
    stored.push({ email: email.trim(), date: new Date().toISOString() });
    localStorage.setItem("newsletter_emails", JSON.stringify(stored));

    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-emerald-200">
          <div className="text-3xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-emerald-700 mb-2">感謝訂閱！</h3>
          <p className="text-slate-600">我們會在有新功能或學習資源時通知你。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-200">
        <div className="text-3xl mb-3">📬</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">訂閱學習通知</h3>
        <p className="text-slate-600 mb-6">新功能上線（數學練習、兒童理財等）時第一時間通知你！</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition border-0 cursor-pointer text-base"
          >
            訂閱
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-3">我們不會發送垃圾信件，隨時可以取消訂閱。</p>
      </div>
    </section>
  );
}
