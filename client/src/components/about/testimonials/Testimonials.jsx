import { useState, useEffect } from 'react';
import testimonials from '../../../data/testimonials';
import { FaQuoteLeft, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const Testimonials = () => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 md:py-24 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">

                {/* Header */}
                <div className="mb-2 md:mb-16 ">
                    <div className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-xl rounded-full px-5 py-3 md:px-8 md:py-4 mb-6 md:mb-8 border border-white/20">
                        <FaQuoteLeft className="text-white/80 text-sm md:text-base" />
                        <span className="text-xs md:text-sm font-semibold text-white/90">What Our Travelers Say</span>
                    </div>

                    <h2 className="hidden md:block text-3xl md:text-6xl font-black mb-4 md:mb-6 leading-tight">
                        Trusted by Adventurers Worldwide
                    </h2>

                    <p className=" hidden md:block text-sm md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        Don't just take our word for it. Here's what real travelers say about their experiences with SubhaYatra.
                    </p>
                </div>

                {/* Testimonial Card */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-12 border border-white/20 shadow-2xl">

                        <div className="text-4xl md:text-6xl mb-4 md:mb-6">
                            {testimonials[activeTestimonial].image}
                        </div>

                        <blockquote className="hidden text-lg md:text-3xl font-light mb-6 md:mb-8 leading-relaxed italic md:block">
                            "{testimonials[activeTestimonial].text}"
                        </blockquote>

                        <div className="flex items-center justify-center gap-1 md:gap-2 mb-4 md:mb-6">
                            {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400 text-base md:text-xl" />
                            ))}
                        </div>

                        <div className="font-bold text-lg md:text-xl mb-1 md:mb-2">
                            {testimonials[activeTestimonial].name}
                        </div>
                        <div className="text-white/70 text-sm md:text-base mb-1 md:mb-2">
                            {testimonials[activeTestimonial].role}
                        </div>
                        <div className="text-white/60 text-sm md:text-base mb-3 md:mb-4">
                            {testimonials[activeTestimonial].location}
                        </div>

                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-white/30">
                            <FaMapMarkerAlt className="text-white/80 text-xs md:text-sm" />
                            <span className="text-xs md:text-sm font-semibold text-white/90">
                                {testimonials[activeTestimonial].trips}
                            </span>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${index === activeTestimonial
                                    ? 'bg-white scale-125'
                                    : 'bg-white/40 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Testimonials