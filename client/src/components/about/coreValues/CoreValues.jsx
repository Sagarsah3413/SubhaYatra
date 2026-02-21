import values from "../../../data/values"
import { FaChartLine, FaHeart } from "react-icons/fa"
const CoreValues = () => {
    return (
        <section className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/30 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-teal-200/50 dark:border-slate-700/50">
                        <FaHeart className="text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Our Core Values</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            What Drives Us Forward
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Our values aren't just words on a wall—they're the foundation of every decision we make,
                        every feature we build, and every experience we create for our global community of travelers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200/50 dark:border-slate-700/50 overflow-hidden transform hover:scale-105"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                            <div className={`relative w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                                <value.icon className="text-2xl text-white" />
                            </div>

                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-4 text-center">
                                {value.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-4">
                                {value.description}
                            </p>

                            <div className="text-center">
                                <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-${value.color}-50 to-${value.color}-100 dark:from-${value.color}-900/30 dark:to-${value.color}-800/30 rounded-full px-4 py-2 border border-${value.color}-200/50 dark:border-${value.color}-700/50`}>
                                    <FaChartLine className={`text-${value.color}-600 dark:text-${value.color}-400 text-sm`} />
                                    <span className={`text-sm font-semibold text-${value.color}-700 dark:text-${value.color}-300`}>{value.stats}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CoreValues