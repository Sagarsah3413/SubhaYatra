import React from 'react'
import { FaEye, FaCheck } from 'react-icons/fa'

const Vision = () => {
    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl p-6 md:p-12 border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">

            <div className="inline-flex items-center gap-2 md:gap-3 bg-linear-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8 border border-teal-200/50 dark:border-teal-700/50">
                <FaEye className="text-teal-600 dark:text-teal-400 text-sm md:text-base" />
                <span className="text-xs md:text-sm font-semibold text-teal-700 dark:text-teal-300">Our Vision</span>
            </div>

            <h2 className="text-2xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
                <span className="bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    A World United Through Travel
                </span>
            </h2>

            <p className="text-sm md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 md:mb-8">
                To become the world's most trusted travel companion, fostering cultural understanding,
                environmental stewardship, and meaningful connections between travelers and local communities
                across every corner of our planet.
            </p>

            <div className="space-y-3 md:space-y-4">
                {[
                    "Showcase Nepal to travelers worldwide",
                    "Promote sustainable and responsible tourism",
                    "Preserve cultural heritage through responsible tourism"
                ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 md:gap-4">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-linear-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shrink-0">
                            <FaCheck className="text-white text-xs md:text-sm" />
                        </div>
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Vision