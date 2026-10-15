import { useTheme } from "../../../contexts/ThemeContext";
import { FaGlobe, FaCamera, FaCompass, FaMapMarkerAlt, FaPlane, FaRoute, FaShieldAlt, FaAward, FaUsers, FaLeaf } from 'react-icons/fa';

// Fixed outside component to prevent re-render jumps
const floatingPositions = [...Array(12)].map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${i * 0.5}s`,
    animationDuration: `${4 + Math.random() * 4}s`,
    size: 30 + Math.floor(Math.random() * 30)
}));

const floatingIcons = [FaGlobe, FaCamera, FaCompass, FaMapMarkerAlt, FaPlane, FaRoute];

const trustIndicators = [
    { icon: FaShieldAlt, label: "100% Secure & Private" },
    { icon: FaAward, label: "Featured in Travel Guides" },
    { icon: FaUsers, label: "Local Community Partners" },
    { icon: FaLeaf, label: "Eco-Tourism Advocate" },
];

const UltraPremiumHero = () => {
    const { theme } = useTheme();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

            {/* Dynamic Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: theme === 'dark'
                        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
                        : 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 25%, #99f6e4 50%, #5eead4 75%, #2dd4bf 100%)'
                }}
            />

            {/* Floating Icons */}
            <div className="absolute inset-0">
                {floatingPositions.map((pos, i) => {
                    const Icon = floatingIcons[i % 6];
                    return (
                        <div key={i} className="absolute opacity-10 animate-float" style={pos}>
                            <Icon size={pos.size} />
                        </div>
                    );
                })}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">

                {/* Text Overlay */}
                <div className="bg-black/50 dark:bg-black/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-8 max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-200 dark:from-teal-200 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent">
                            About
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            SubhaYatra
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white mb-4 max-w-3xl mx-auto leading-relaxed font-semibold">
                        Your trusted travel companion, dedicated to
                        <span className="font-bold text-sky-300"> transforming dreams into extraordinary adventures</span>
                    </p>

                    <p className="text-base md:text-lg text-white mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
                        Dedicated to showcasing Nepal's incredible diversity through authentic local connections,
                        deep cultural expertise, and an unwavering commitment to connecting travelers with
                        Nepal's most extraordinary destinations and vibrant local communities.
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white/80">
                    {trustIndicators.map(({ icon: Icon, label }, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Icon className="text-sm md:text-base" />
                            <span className="text-xs md:text-sm font-medium">{label}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default UltraPremiumHero;