import Vision from "./vision/Vision";
import { FaRocket, FaCheck } from "react-icons/fa";
const Mission = () => {
    return (
        <section className="py-24 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Mission */}
                    <div className="bg-linear-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-4xl p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border border-white/30">
                                <FaRocket className="text-white" />
                                <span className="text-sm font-semibold text-white">Our Mission</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                Showcasing Authentic Nepal
                            </h2>

                            <p className="text-xl leading-relaxed mb-8 text-white/90">
                                To make personalized, authentic, and transformative travel experiences accessible to everyone,
                                regardless of their budget, experience level, or travel style. We believe every journey should
                                be as unique as the person taking it.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Connect travelers with authentic local experiences",
                                    "Support local communities worldwide",
                                    "Make Nepal travel planning effortless and inspiring"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaCheck className="text-white text-sm" />
                                        </div>
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Vision */}
                    <Vision />
                </div>
            </div>
        </section>
    )
}

export default Mission