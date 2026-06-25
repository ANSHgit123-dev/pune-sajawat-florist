import React, { useState } from "react";
import { REVIEWS } from "../data";
import { MessageSquareReply, Star, CheckSquare, MessageCircle, Sparkles } from "lucide-react";

export default function Reviews() {
  const [reviewCount, setReviewCount] = useState(REVIEWS.length);
  const [reviewsList, setReviewsList] = useState(REVIEWS);

  // Quick simulation to create loyalty
  const [userComment, setUserComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("Viman Nagar");
  const [userRating, setUserRating] = useState(5);
  const [userTag, setUserTag] = useState("Rose Bouquet");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim() || !userName.trim()) return;

    const newReview = {
      id: `r-user-${Date.now()}`,
      name: userName,
      location: `${userLocation}, Pune`,
      rating: userRating,
      date: "Just now",
      comment: userComment,
      tag: userTag
    };

    setReviewsList([newReview, ...reviewsList]);
    setSubmitted(true);
    setUserComment("");
    setUserName("");
  };

  return (
    <section className="py-10 bg-white" id="reviews-section">
      <div className="max-w-[1600px] w-full mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-brand-pink-600 font-bold text-xs uppercase tracking-widest bg-brand-pink-50 px-3 py-1 rounded-full">
            <MessageSquareReply className="w-3.5 h-3.5" />
            <span>KIND WORDS FROM CLIENTS</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-stone-900">
            Reviews from Pune Locals
          </h3>
          <p className="text-sm text-stone-500 max-w-lg mx-auto">
            Read real feedback from neighbors in Kharadi, Kalyani Nagar, Viman Nagar, and other localities who ordered our elite floral arrangements.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive list of reviews */}
          <div className="lg:col-span-8 space-y-6" id="reviews-list-container">
            {reviewsList.length === 0 ? (
              <div className="p-10 text-center bg-stone-50/50 border border-dashed border-stone-200 rounded-2xl space-y-3 shadow-inner">
                <span className="text-2xl block animate-bounce">✨</span>
                <h4 className="font-bold text-stone-850 text-sm">Be the First to Leave a Review!</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  We have fully purged all old placeholder reviews. If you recently purchased a bouquet, flower box, or event decor from our Pune storefront, share your organic feedback using the form!
                </p>
              </div>
            ) : (
              reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl border border-stone-100 bg-stone-50/20 shadow-sm space-y-3 relative overflow-hidden"
                  id={`customer-review-${rev.id}`}
                >
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                      {/* User initial avatar circle */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 font-serif font-black text-slate-700 flex items-center justify-center text-sm shrink-0">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{rev.name}</h4>
                        <p className="text-[11px] text-stone-400 font-sans">{rev.location} • {rev.date}</p>
                      </div>
                    </div>

                    {/* Rating stars & Category badge */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="text-[10px] font-mono uppercase bg-slate-50 border border-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full font-bold">
                        {rev.tag}
                      </span>
                      <div className="flex text-amber-500" aria-label={`Rating: ${rev.rating} stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-500 text-amber-400" : "text-stone-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment body text */}
                  <p className="text-stone-600 text-sm leading-relaxed font-sans italic">
                    "{rev.comment}"
                  </p>

                  {/* Verified Buyer Check */}
                  <div className="flex items-center gap-1.5 text-[#82862F] text-[10px] font-mono font-bold uppercase tracking-wider bg-[#82862F]/5 self-start inline-flex px-2 py-0.5 rounded">
                    <CheckSquare className="w-3 h-3" />
                    <span>Verified Pune Purchase</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Submit a Review input form */}
          <div className="lg:col-span-4 bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm" id="leave-review-box">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm sm:text-base border-b pb-3">
              <Sparkles className="w-4.5 h-4.5 text-brand-pink-500 animate-pulse" />
              <span>Have You Ordered From Us?</span>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3" id="review-submitted-success">
                <span className="text-3xl">❤️</span>
                <h4 className="font-bold text-stone-900 text-sm">Thank you so much!</h4>
                <p className="text-xs text-stone-500">
                  Your feedback helps Pune Sajawat maintain pure luxury standards, and has been added above!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Write Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3" id="leave-review-form">
                <p className="text-xs text-stone-500 leading-relaxed">
                  Share your recent bouquet or wedding decoration experience with other visitors block by block!
                </p>

                <div>
                  <label className="text-xs text-stone-500 font-semibold mb-1 block">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-200 bg-white p-2.5 outline-none font-sans text-stone-800 focus:border-brand-pink-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-stone-500 font-semibold mb-1 block">Locality (Pune)</label>
                    <select
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-200 bg-white p-2.5 outline-none font-sans text-stone-800"
                    >
                      <option value="Kharadi">Kharadi</option>
                      <option value="Viman Nagar">Viman Nagar</option>
                      <option value="Hadapsar">Hadapsar</option>
                      <option value="Kalyani Nagar">Kalyani Nagar</option>
                      <option value="Koregaon Park">Koregaon Park</option>
                      <option value="Baner">Baner</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 font-semibold mb-1 block">What did you order?</label>
                    <select
                      value={userTag}
                      onChange={(e) => setUserTag(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-200 bg-white p-2.5 outline-none font-sans text-stone-800"
                    >
                      <option value="Red Roses Bouquet">Roses Bouquet</option>
                      <option value="Wedding Stage Decor">Wedding Stage</option>
                      <option value="Birthday Decor">Birthday Decor</option>
                      <option value="Car Flower Decor">Car Decor</option>
                      <option value="Chocolate Truffle Cake">Fresh Cake</option>
                      <option value="Oxygen Plant">Indoor Plant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-500 font-semibold mb-1 block">Give Stars</label>
                  <div className="flex gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setUserRating(starVal)}
                        className="text-amber-400 font-bold transition-transform active:scale-110"
                      >
                        <Star className={`w-6 h-6 ${userRating >= starVal ? "fill-amber-500" : "text-stone-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-500 font-semibold mb-1 block">Your Review Comments</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe how the flowers smelled, packaging quality, decorator timing..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-200 bg-white p-2.5 outline-none font-sans text-stone-800 resize-none focus:border-brand-pink-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-pink-600 hover:bg-brand-pink-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-brand-pink-100"
                  id="submit-review-form-btn"
                >
                  Publish My Review
                </button>
              </form>
            )}

            {/* General WhatsApp review helper */}
            <div className="border-t pt-4 text-center">
              <span className="text-[10px] text-stone-400 font-sans block mb-2">Want to submit feedback directly via mobile?</span>
              <a
                href="https://api.whatsapp.com/send?phone=918484905722&text=Hello%20Pune%20Sajawat%20Florist!%20I%20would%20like%20to%20give%20you%20a%205-star%20feedback%20for..."
                target="_blank"
                className="text-[11px] text-brand-green-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-brand-green-500 stroke-none" />
                <span>Text Us on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
