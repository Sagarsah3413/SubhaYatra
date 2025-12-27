import { useState, useEffect, useRef } from "react";
import Footer from "../components/footer/Footer";
import { Header } from "../components/header/Header";
import NepalHero from "../assets/Kathmandu.jpeg";
import NepalHero2 from "../assets/Basantapur.jpeg";

const SUGGESTED_TAGS = ["waterfall", "hiking", "temple", "photography", "camping", "hot-springs"];

export default function AddPlace() {
  const [form, setForm] = useState({ name: "", location: "", type: "Nature", tags: [], description: "" });
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!images.length) return setPreviews([]);
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const setField = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    // live validation clear
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const val = tagInput.trim().toLowerCase();
    if (!val) return setTagInput("");
    if (!form.tags.includes(val)) setForm((s) => ({ ...s, tags: [...s.tags, val] }));
    setTagInput("");
  };

  const handleTagKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const removeTag = (t) => setForm((s) => ({ ...s, tags: s.tags.filter((x) => x !== t) }));

  const handleFiles = (filesList) => {
    const files = Array.from(filesList)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 6); // allow up to 6
    setImages(files);
    setCoverIndex(0);
    setIsDragging(false);
  };

  const onFileChange = (e) => handleFiles(e.target.files);

  // Drag & Drop
  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
    setIsDragging(false);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e) => setIsDragging(false);

  const validateFields = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.description.trim() || form.description.trim().length < 20)
      errs.description = "Description must be at least 20 characters.";
    if (images.length === 0) errs.images = "At least one photo is recommended.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setCoverIndex((prev) => (idx === prev ? 0 : prev > idx ? prev - 1 : prev));
  };

  const confirmReset = () => {
    if (window.confirm("Reset the form? All changes will be lost.")) {
      setForm({ name: "", location: "", type: "Nature", tags: [], description: "" });
      setImages([]);
      setTagInput("");
      fileInputRef.current && (fileInputRef.current.value = null);
      setErrors({});
      setMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateFields()) return window.scrollTo({ top: 0, behavior: "smooth" });

    setSubmitting(true);
    setProgress(0);

    const data = new FormData();
    data.append("name", form.name);
    data.append("location", form.location);
    data.append("type", form.type);
    data.append("description", form.description);
    data.append("tags", form.tags.join(","));
    images.forEach((file, idx) => data.append(`image_${idx + 1}`, file));
    data.append("cover_index", coverIndex);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/places", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setSubmitting(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText || "{}");
        setSuccessModal({ id: res.place_id, name: form.name });
        setForm({ name: "", location: "", type: "Nature", tags: [], description: "" });
        setImages([]);
        setProgress(0);
        fileInputRef.current && (fileInputRef.current.value = null);
        setErrors({});
      } else {
        setMessage("Error submitting. Please try again later.");
      }
    };
    xhr.onerror = () => {
      setSubmitting(false);
      setMessage("Network error. Try again.");
    };
    xhr.send(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />

      <div className="relative h-56 overflow-hidden">
        {/* two-slide crossfade hero using local Nepal images */}
        <div className="hero-slide slide1 absolute inset-0" style={{ backgroundImage: `url(${NepalHero})` }}></div>
        <div className="hero-slide slide2 absolute inset-0" style={{ backgroundImage: `url(${NepalHero2})` }}></div>

        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-transparent opacity-70"></div>
        <div className="relative h-full flex flex-col items-start justify-center text-left px-8 lg:px-20">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-2">Add a Place</h1>
          <p className="text-lg text-slate-200 max-w-2xl">Contribute a new place and help travelers discover something special.</p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 lg:px-0 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Place Details</h2>

          {Object.keys(errors).length > 0 && (
            <div role="alert" className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700">Please fix the highlighted errors below.</div>
          )}

          {message && (
            <div role="status" className={`mb-4 p-3 rounded ${message.startsWith('✓') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>{message}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label htmlFor="place-name" className="block text-sm font-medium text-slate-700 mb-2">Place Name <span className="text-rose-500">*</span></label>
                <input id="place-name" name="name" value={form.name} onChange={handleChange} aria-required="true" aria-invalid={errors.name ? "true" : "false"} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`} placeholder="Name of the place" />
                {errors.name && <div className="text-rose-600 text-sm mt-2">{errors.name}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="place-location" className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <input id="place-location" name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="City, region" />
                  </div>

                  <div>
                    <label htmlFor="place-type" className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                    <select id="place-type" name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Nature</option>
                      <option>Cultural</option>
                      <option>Adventure</option>
                      <option>City</option>
                      <option>Relaxation</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="place-description" className="block text-sm font-medium text-slate-700 mb-2">Short Description <span className="text-rose-500">*</span></label>
                  <textarea id="place-description" name="description" value={form.description} onChange={handleChange} rows={6} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`} placeholder="Describe the place and useful tips for visitors"></textarea>
                  <div className="flex justify-between mt-2">
                    {errors.description ? <div className="text-rose-600 text-sm">{errors.description}</div> : <div className="text-xs text-slate-400">{form.description.length} characters</div>}
                    <div className="text-xs text-slate-400">Markdown OK • Be specific</div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                  <p className="text-xs text-slate-400 mb-2">Add descriptive tags to help others discover this place.</p>
                  <div className="flex gap-2 items-center">
                    <input name="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKey} className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-slate-700" placeholder="Type a tag and press Enter" />
                    <button onClick={handleAddTag} className="px-4 py-2 bg-slate-100 rounded-md border">Add</button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                        #{t}
                        <button aria-label={`Remove ${t}`} onClick={() => removeTag(t)} className="text-rose-500 ml-1">×</button>
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    {SUGGESTED_TAGS.map((s) => (
                      <button key={s} type="button" onClick={() => { if (!form.tags.includes(s)) setForm((sf) => ({ ...sf, tags: [...sf.tags, s] })); }} className="text-xs px-2 py-1 bg-slate-50 border rounded text-slate-700 hover:bg-teal-50">{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Photos (drag & drop, up to 6)</label>

                <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${isDragging ? 'border-teal-400 bg-teal-50 shadow-inner' : 'border-slate-200 bg-white'}`}>
                  <p className="text-sm text-slate-600">Drop images here or <button type="button" onClick={() => fileInputRef.current.click()} className="text-teal-600 underline">browse</button></p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFileChange} className="hidden" />

                  <div className="mt-4">
                    {previews.length > 0 ? (
                      <div className="mb-3">
                        <img src={previews[coverIndex]} alt="cover-preview" className="w-full h-36 object-cover rounded-lg shadow-sm" />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-2">
                            <span className="text-xs text-slate-500">Cover image</span>
                            <span className="text-xs text-slate-400">(click thumbnails to change)</span>
                          </div>
                          <div className="text-xs text-slate-500">{images.length} selected</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 mt-2">No images selected</div>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                      {previews.map((src, idx) => (
                        <div key={idx} className={`relative rounded-lg overflow-hidden border ${coverIndex === idx ? 'border-2 border-teal-500' : 'border border-slate-200'}`}>
                          <img src={src} alt={`preview-${idx}`} className="w-full h-20 object-cover" />
                          <div className="absolute left-1 top-1 flex gap-1">
                            <button type="button" onClick={() => setCoverIndex(idx)} className="bg-white bg-opacity-90 px-2 py-1 text-xs rounded">Cover</button>
                            <button type="button" aria-label="Remove image" onClick={() => handleRemoveImage(idx)} className="bg-white bg-opacity-90 px-2 py-1 text-xs rounded">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {errors.images && <div className="text-rose-600 text-sm mt-2">{errors.images}</div>}

                    {progress > 0 && (
                      <div className="mt-4">
                        <div className="w-full bg-slate-100 rounded h-2 overflow-hidden">
                          <div style={{ width: `${progress}%` }} className="h-2 bg-teal-500 transition-all"></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Uploading: {progress}%</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-sm text-slate-500">
                  <strong>Tip:</strong> You can drag images to reorder before upload in the future. Currently click thumbnails to set a cover.
                </div>
              </aside>
            </div>

            <div className="flex items-center gap-4">
              <button type="submit" disabled={submitting || Object.keys(errors).length > 0} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-semibold transform hover:scale-105 disabled:opacity-50">
                {submitting ? "Uploading..." : "Add Place"}
              </button>

              <button type="button" onClick={confirmReset} className="text-sm text-slate-600 underline">Reset</button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-sm text-slate-500">Your submission will be reviewed before being published.</div>
      </main>

      <Footer />

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Submission Received</h3>
            <p className="text-sm text-slate-600 mb-4">Thank you — your place "<strong>{successModal.name}</strong>" has been submitted and is pending review.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSuccessModal(null)} className="px-4 py-2 bg-slate-100 rounded">Add Another</button>
              <button onClick={() => { setSuccessModal(null); window.location.href = '/'; }} className="px-4 py-2 bg-teal-600 text-white rounded">Back to Home</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero slides styles */}
      <style>{`
        .hero-slide { background-size: cover; background-position: center; opacity: 0; transform: scale(1.02); animation: slide 12s infinite; }
        .hero-slide.slide2 { animation-delay: 6s; }

        @keyframes slide {
          0% { opacity: 1; transform: scale(1.02); }
          35% { opacity: 1; transform: scale(1); }
          50% { opacity: 0; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
