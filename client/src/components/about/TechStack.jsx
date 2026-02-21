import React from 'react'

const tech = [
    { name: 'React', icon: '⚛️', desc: 'Frontend Framework' },
    { name: 'Python Flask', icon: '🐍', desc: 'Backend API' },
    { name: 'SQLite', icon: '🗄️', desc: 'Database' },
    { name: 'Cohere AI', icon: '🤖', desc: 'AI Integration' },
    { name: 'Clerk', icon: '🔐', desc: 'Authentication' },
    { name: 'Vite', icon: '⚡', desc: 'Build Tool' },
    { name: 'Git', icon: '📦', desc: 'Version Control' }
];

const TechStack = () => {
    return (
        <div className="hidden md:block bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-6 md:p-12 text-white relative overflow-hidden shadow-2xl w-full">

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="relative z-10 text-center">
                <h3 className="text-2xl md:text-4xl font-black mb-3 md:mb-6">Built with Modern Technology</h3>
                <p className="text-sm md:text-xl text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto">
                    Our platform leverages cutting-edge technologies to deliver a fast, secure, and seamless experience
                </p>

                {/* 2 cols mobile, 4 cols desktop — 7 items centers nicely */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 justify-items-center">
                    {tech.map((item, index) => (
                        <div
                            key={index}
                            className={`bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 w-full
              ${index === 6 ? 'col-span-2 md:col-span-1 max-w-[50%] md:max-w-full mx-auto' : ''}`}
                        >
                            <div className="text-3xl md:text-4xl mb-2 md:mb-3">{item.icon}</div>
                            <div className="font-bold text-sm md:text-lg mb-1">{item.name}</div>
                            <div className="text-xs md:text-sm text-white/70">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TechStack