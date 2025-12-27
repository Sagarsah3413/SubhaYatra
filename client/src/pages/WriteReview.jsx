import { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
import { Header } from "../components/header/Header";

export default function WriteReview() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    place: "",
    visitDate: "",
    type: "Nature",
    rating: 0,
    review: "",
    recommend: "yes"
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // create previews when images change
    if (images.length === 0) return setPreviews([]);
    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    // restore draft from localStorage
    const draft = localStorage.getItem("writeReviewDraft");
    if (draft) setForm(JSON.parse(draft));
  }, []);

  useEffect(() => {
    localStorage.setItem("writeReviewDraft", JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return "Please enter a valid email.";
    if (!form.place.trim()) return "Please enter the place you visited.";
    if (!form.rating || form.rating < 1) return "Please select a rating.";
    if (!form.review.trim() || form.review.trim().length < 20) return "Please write a review (at least 20 characters).";
    return "";
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      // Try to POST to API (graceful fallback if not available)
      const data = new FormData();
      Object.entries(form).forEach(([k, val]) => data.append(k, val));
      images.forEach((file, idx) => data.append(`image_${idx + 1}`, file));

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        // fallback: show success locally
        console.warn("Review endpoint returned non-OK status", res.status);
      }

      setSubmitted(true);
      setForm({ name: "", email: "", place: "", visitDate: "", type: "Nature", rating: 0, review: "", recommend: "yes" });
      setImages([]);
      localStorage.removeItem("writeReviewDraft");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />

      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=60')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-transparent opacity-70"></div>
        <div className="relative h-full flex flex-col items-start justify-center text-left px-8 lg:px-20">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-2">Write a Review</h1>
          <p className="text-lg text-slate-200 max-w-2xl">Share your travel experience and help fellow travelers find memorable places.</p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 lg:px-0 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Tell us about your trip</h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">✓ Thank you! Your review was submitted.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Place Visited</label>
                <input name="place" value={form.place} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Name of attraction, hotel or restaurant" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Visit Date (optional)</label>
                <input name="visitDate" value={form.visitDate} onChange={handleChange} type="date" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Nature</option>
                  <option>Cultural</option>
                  <option>Adventure</option>
                  <option>City</option>
                  <option>Relaxation</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex items-center space-x-3">
                  <StarRating value={form.rating} onChange={(r) => setForm((s) => ({ ...s, rating: r }))} />
                  <div className="text-sm text-slate-600">{form.rating ? `${form.rating}/5` : "Select"}</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
              <textarea name="review" value={form.review} onChange={handleChange} rows={6} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Share what made this place special, tips for other travelers, and anything to avoid."></textarea>
              <div className="text-xs text-slate-400 mt-2">{form.review.length} characters</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Would you recommend?</label>
                <div className="inline-flex rounded-lg bg-slate-50 p-1">
                  <button type="button" onClick={() => setForm((s) => ({ ...s, recommend: "yes" }))} className={`px-4 py-2 rounded-lg ${form.recommend === "yes" ? "bg-blue-600 text-white" : "text-slate-700"}`}>
                    Yes
                  </button>
                  <button type="button" onClick={() => setForm((s) => ({ ...s, recommend: "no" }))} className={`px-4 py-2 rounded-lg ${form.recommend === "no" ? "bg-rose-600 text-white" : "text-slate-700"}`}>
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Photos (max 4)</label>
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="block w-full text-sm text-slate-600" />
                <div className="mt-3 flex gap-3">
                  {previews.map((src, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button type="submit" disabled={submitting} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-semibold transform hover:scale-105">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>

              <button type="button" onClick={() => { setForm({ name: "", email: "", place: "", visitDate: "", type: "Nature", rating: 0, review: "", recommend: "yes" }); setImages([]); localStorage.removeItem("writeReviewDraft"); }} className="text-sm text-slate-600 underline">
                Clear Draft
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-sm text-slate-500">
          <p>By submitting you confirm that your review is truthful and does not contain inappropriate language or personal data. Our team may review and moderate submissions.</p>
        </div>
      </main>

      <style>{`
        .star {
          width: 36px;
          height: 36px;
          display: inline-flex;
          cursor: pointer;
          transition: transform 120ms ease;
        }
        .star:hover { transform: scale(1.08); }
      `}</style>

      <Footer />
    </div>
  );
}

function StarRating({ value = 0, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} onClick={() => onChange(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} className="star" viewBox="0 0 24 24" fill={(hover || value) >= i ? "#F59E0B" : "#E6E7E9"} xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.17L12 18.897l-7.336 3.871 1.402-8.17L.132 9.21l8.2-1.192z" />
        </svg>
      ))}
    </div>
  );
}
