import { FaLightbulb, FaBookOpen } from "react-icons/fa"

const Story = () => {
    return (
        <section className="py-24 bg-linear-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-linear-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-8 py-4 mb-8 border border-teal-200/50 dark:border-teal-700/50">
                        <FaBookOpen className="text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Our Story</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                        <span className="bg-linear-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            From Vision to Reality
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        What started as local Nepal enthusiasts' passion for sharing hidden gems has evolved
                        into a comprehensive travel platform, connecting adventurers with authentic Nepal experiences and trusted local guides.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl p-12 border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6">The Challenge We Addressed</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            Nepal's incredible diversity was often reduced to basic trekking routes and tourist hotspots. Travelers missed authentic experiences,
                            local communities weren't benefiting from tourism, and the real Nepal remained hidden from most visitors.
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            Our founders, local Nepal experts Suman and Priya, combined their deep cultural knowledge and passion for authentic travel
                            to create a platform that connects travelers with genuine Nepal experiences, local guides, and hidden gems across the country.
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-6">Our Innovation</h3>
                            <p className="text-xl leading-relaxed mb-6 text-white/90">
                                We pioneered the use of local expertise and cultural insights in travel recommendations, analyzing thousands of authentic experiences
                                to understand what makes each destination in Nepal special for different types of travelers.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <FaLightbulb className="text-white" />
                                </div>
                                <span className="font-semibold">Local Expertise • Cultural Insights • Authentic Experiences</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >

    )
}

export default Story