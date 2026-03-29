import {
    FaShieldAlt,
    FaCheckCircle,
    FaLock,
    FaCompass,
    FaMapMarkerAlt,
    FaMountain,
    FaCamera,
    FaUserShield
} from 'react-icons/fa';

// Decorative blobs — fixed positions, no Math.random()
export const ORBS = [
    { w: 320, h: 320, top: '-80px', left: '-80px', color: 'from-teal-500/20 to-cyan-500/10', delay: '0s', dur: '8s' },
    { w: 240, h: 240, top: '60%', right: '-60px', color: 'from-emerald-500/15 to-teal-500/10', delay: '2s', dur: '10s' },
    { w: 180, h: 180, bottom: '10%', left: '30%', color: 'from-cyan-500/10 to-blue-500/10', delay: '1.5s', dur: '12s' },
];

// Floating background icons — fixed positions, no Math.random()
export const FLOAT_ICONS = [
    { icon: FaCompass, top: '12%', left: '8%', size: 28, delay: '0s', dur: '7s' },
    { icon: FaMapMarkerAlt, top: '70%', left: '5%', size: 20, delay: '1.2s', dur: '9s' },
    { icon: FaMountain, top: '30%', left: '88%', size: 24, delay: '0.6s', dur: '8s' },
    { icon: FaCamera, top: '80%', left: '82%', size: 18, delay: '2s', dur: '6s' },
    { icon: FaCompass, top: '50%', left: '92%', size: 16, delay: '3s', dur: '11s' },
    { icon: FaMountain, top: '88%', left: '22%', size: 22, delay: '1.8s', dur: '9s' },
];




export const SIGN_UP_FEATURES = [
    { icon: FaCompass, label: 'Explore Nepal', sub: 'Discover every corner' },
    { icon: FaMapMarkerAlt, label: 'Save Places', sub: 'Build your wishlist' },
    { icon: FaCamera, label: 'Share Stories', sub: 'Upload & inspire others' },
    { icon: FaShieldAlt, label: 'Trusted Guide', sub: 'Safe & reliable' },
];