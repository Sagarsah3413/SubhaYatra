import {
    FaHeart,
    FaUsers,
    FaLightbulb,
    FaLeaf,


} from 'react-icons/fa';
const values = [
    {
        title: 'Authenticity',
        description: 'We prioritize genuine, local experiences over tourist-focused attractions.',
        icon: FaHeart,
        gradient: 'from-red-500 to-pink-500',
        color: 'red',
        stats: '10K+ Authentic Experiences'
    },
    {
        title: 'Sustainability',
        description: 'We promote eco-friendly and responsible tourism practices.',
        icon: FaLeaf,
        gradient: 'from-green-500 to-emerald-500',
        color: 'green',
        stats: '100% Carbon Neutral'
    },
    {
        title: 'Community',
        description: 'We empower local communities and support their economic growth.',
        icon: FaUsers,
        gradient: 'from-blue-500 to-cyan-500',
        color: 'blue',
        stats: '500+ Local Partners'
    },
    {
        title: 'Innovation',
        description: 'We use cutting-edge technology to enhance travel experiences.',
        icon: FaLightbulb,
        gradient: 'from-yellow-500 to-orange-500',
        color: 'yellow',
        stats: 'AI-Powered Recommendations'
    }
];
export default values;