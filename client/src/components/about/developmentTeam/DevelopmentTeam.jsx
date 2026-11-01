import React from 'react'
import developersData from '../../../data/developersData';
import TechStack from '../TechStack';
import Developers from '../developers/Developers';
import { FaCode } from 'react-icons/fa'

const DevelopmentTeam = () => {
    return (
        <>
            <section className="py-4 md:py-16 bg-white dark:bg-navy-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        {/* <div className="  inline-flex items-center gap-3 bg-gradient-to-r from-navy-700 to-navy-700 dark:from-navy-700/30 dark:to-navy-700/30 rounded-full px-8 py-4 mb-2 border border-navy-500/50 dark:border-navy-500/50">
                            <FaCode className="text-navy-600 dark:text-amber-400" />
                            <span className="text-sm font-semibold text-navy-500 dark:text-amber-300">Development Team</span>
                        </div> */}

                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-navy-700 via-navy-600 to-blue-600 bg-clip-text text-transparent">
                                Meet the Developer
                            </span>
                        </h2>

                        {/* <p className="hidden md:block text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                            The talented team behind SubhaYatra innovative platform, bringing together expertise in
                            technology, design, and user experience to create seamless travel planning.
                        </p> */}
                    </div>
                </div>
                {/* Mobile: horizontal scroll, Desktop: grid */}
                <div className="flex overflow-x-auto gap-4 pb-4 md:hidden px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {developersData.map((developer) => (
                        <div key={developer.id} className="snap-start shrink-0 w-40">
                            <Developers {...developer} />
                        </div>
                    ))}
                </div>

                {/* <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16 px-4"> */}
                {developersData
                    .filter((developer) => developer.id === 6)
                    .map((developer) => (
                        <Developers key={developer.id} {...developer} />
                    ))}
                {/* </div> */}
                {/* Tech Stack Section */}
                <TechStack />
            </section></>
    )
}

export default DevelopmentTeam;