import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCalendarAlt, FaDownload, FaBookmark, FaShare, FaClock, FaEye, FaNewspaper, FaFilter, FaStar, FaArrowRight, FaTimes, FaUser, FaTag } from "react-icons/fa";
import { Header } from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useTheme } from "../contexts/ThemeContext";

// Add custom styles for line clamping
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// Import images
import LangtangImage from "../assets/Nature/Langtang.jpeg";
import BoudhanathImage from "../assets/Boudhanath-Stupa.jpeg";
import ABCImage from "../assets/Fspots/ABC.jpeg";
import KathmanduImage from "../assets/Kathmandu.jpeg";
import PokharaImage from "../assets/Fspots/Pokhara.jpg";
import GosaikundaImage from "../assets/Nature/Gosaikunda.jpeg";
import ChitwanImage from "../assets/Fspots/Chitwan.jpeg";
import PashupatinathImage from "../assets/Fspots/Pashupatinath.jpeg";
import SwayambhunathImage from "../assets/Fspots/Swayambhunath.jpeg";
import LumbiniImage from "../assets/Fspots/Lumbini.jpeg";
import MustangImage from "../assets/Fspots/Mustang.jpeg";
import NagarkotImage from "../assets/Fspots/Nagarkot.jpeg";
import BardiyaImage from "../assets/Nature/Bardiya.jpeg";
import GhandrukImage from "../assets/Nature/Ghandruk.jpeg";
import KhaptadImage from "../assets/Nature/Khaptad.jpeg";
import LomanthangImage from "../assets/Nature/Lomanthang.jpeg";
import ShivapuriImage from "../assets/Nature/Shivapuri.jpeg";
import ShuklaphantaImage from "../assets/Nature/Shuklaphanta.jpeg";
import BhaktapurImage from "../assets/Bhaktapur-Durbar-Square.jpeg";
import ChanguNarayanImage from "../assets/Changu-Narayan-Temple.jpeg";
import DakshinkaliImage from "../assets/Dakshinkali-Temple.jpeg";

const NewsletterArchive = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [imageLoadingStates, setImageLoadingStates] = useState(new Set());
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("latest");
  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showFullContent) {
        setShowFullContent(false);
      }
    };

    if (showFullContent) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showFullContent]);

  // Sample newsletter data - in production, this would come from your backend
  const newsletters = [
    // 2024 Newsletters
    {
      id: 1,
      title: "Winter Trekking Safety Guide",
      date: "2024-12-15",
      category: "safety",
      excerpt: "Essential safety tips for winter trekking in Nepal's high-altitude regions. Learn about proper gear, weather awareness, and emergency protocols.",
      readTime: "8 min read",
      views: 1247,
      tags: ["trekking", "winter", "safety", "gear"],
      featured: true,
      image: LangtangImage,
      author: "Roamio Wanderly Team",
      content: `
        <h2>Winter Trekking in Nepal: A Complete Safety Guide</h2>
        
        <p>Winter trekking in Nepal offers breathtaking views and fewer crowds, but it requires careful preparation and safety awareness. The high-altitude regions present unique challenges during the colder months.</p>
        
        <h3>Essential Gear for Winter Trekking</h3>
        <ul>
          <li><strong>Layered Clothing System:</strong> Base layer (merino wool), insulating layer (down jacket), and waterproof outer shell</li>
          <li><strong>Footwear:</strong> Insulated, waterproof boots with good traction. Consider microspikes for icy trails</li>
          <li><strong>Sleeping System:</strong> 4-season sleeping bag rated for temperatures you'll encounter</li>
          <li><strong>Emergency Equipment:</strong> Avalanche beacon, probe, and shovel for high-risk areas</li>
        </ul>
        
        <h3>Weather Awareness</h3>
        <p>Winter weather in the Himalayas can change rapidly. Always check weather forecasts and be prepared to turn back if conditions deteriorate. Temperatures can drop to -20°C or lower at high altitudes.</p>
        
        <h3>Emergency Protocols</h3>
        <p>Always inform someone of your trekking plans and expected return. Carry a satellite communicator for emergency situations. Know the signs of altitude sickness and hypothermia.</p>
        
        <p>Remember: No summit or view is worth risking your life. Turn back if conditions become dangerous.</p>
      `
    },
    {
      id: 2,
      title: "Hidden Temples of Kathmandu Valley",
      date: "2024-12-01",
      category: "culture",
      excerpt: "Discover lesser-known temples and spiritual sites in Kathmandu Valley. A journey through Nepal's rich religious heritage and architectural marvels.",
      readTime: "12 min read",
      views: 892,
      tags: ["temples", "culture", "kathmandu", "heritage"],
      featured: false,
      image: BoudhanathImage,
      author: "Cultural Heritage Team",
      authorBio: "Dedicated team of cultural historians and heritage experts preserving Nepal's rich traditions.",
      content: "Kathmandu Valley is home to countless temples and spiritual sites that tell the story of Nepal's religious heritage. This guide explores lesser-known temples and their architectural marvels."
    },
    {
      id: 3,
      title: "Photography Guide: Capturing Nepal's Beauty",
      date: "2024-11-25",
      category: "photography",
      excerpt: "Professional tips for photographing Nepal's landscapes, people, and culture. Best locations, timing, and equipment recommendations.",
      readTime: "13 min read",
      views: 1654,
      tags: ["photography", "landscapes", "portraits", "equipment"],
      featured: false,
      image: NagarkotImage
    },
    {
      id: 4,
      title: "Wildlife Safari in Chitwan National Park",
      date: "2024-11-10",
      category: "wildlife",
      excerpt: "Complete guide to wildlife viewing in Nepal's premier national park. Rhinos, tigers, elephants, and bird watching opportunities.",
      readTime: "10 min read",
      views: 2087,
      tags: ["wildlife", "safari", "chitwan", "animals"],
      featured: true,
      image: BardiyaImage,
      author: "Wildlife Conservation Team",
      content: `
        <h2>Chitwan National Park: Nepal's Wildlife Paradise</h2>
        
        <p>Chitwan National Park, Nepal's first national park, is home to an incredible diversity of wildlife including the endangered one-horned rhinoceros and Bengal tigers.</p>
        
        <h3>Best Wildlife Viewing Times</h3>
        <p>Early morning (6-9 AM) and late afternoon (4-6 PM) are optimal for wildlife spotting. Animals are most active during these cooler periods.</p>
        
        <h3>What You'll See</h3>
        <ul>
          <li><strong>One-horned Rhinoceros:</strong> Over 600 rhinos call Chitwan home</li>
          <li><strong>Bengal Tigers:</strong> Approximately 120 tigers roam the park</li>
          <li><strong>Asian Elephants:</strong> Both wild and domesticated elephants</li>
          <li><strong>Sloth Bears:</strong> Elusive but occasionally spotted</li>
          <li><strong>Birds:</strong> Over 500 species including hornbills and kingfishers</li>
        </ul>
        
        <h3>Safari Options</h3>
        <p><strong>Jeep Safari:</strong> Most popular option, covers more ground<br>
        <strong>Elephant Safari:</strong> Traditional experience, closer to wildlife<br>
        <strong>Walking Safari:</strong> Guided nature walks for bird watching</p>
        
        <h3>Best Time to Visit</h3>
        <p>October to March offers the best weather and wildlife viewing opportunities. The dry season makes animals easier to spot near water sources.</p>
      `
    },
    {
      id: 5,
      title: "Budget Travel Tips for Nepal",
      date: "2024-10-25",
      category: "tips",
      excerpt: "Travel Nepal on a budget without compromising on experiences. Accommodation, food, transport, and activity cost breakdowns.",
      readTime: "15 min read",
      views: 3421,
      tags: ["budget", "tips", "accommodation", "food"],
      featured: false,
      image: PokharaImage,
      author: "Budget Travel Experts"
    },
    {
      id: 6,
      title: "Monsoon Trekking: What You Need to Know",
      date: "2024-10-15",
      category: "safety",
      excerpt: "Trekking during monsoon season requires special preparation. Routes, gear, and safety considerations for wet weather adventures.",
      readTime: "9 min read",
      views: 987,
      tags: ["monsoon", "trekking", "weather", "preparation"],
      featured: false,
      image: GosaikundaImage
    },
    {
      id: 7,
      title: "Pokhara's Adventure Activities Guide",
      date: "2024-10-01",
      category: "destinations",
      excerpt: "From paragliding to white-water rafting, discover all the adventure activities Pokhara has to offer. Complete guide with prices and operators.",
      readTime: "11 min read",
      views: 1876,
      tags: ["pokhara", "adventure", "activities", "sports"],
      featured: true,
      image: ChitwanImage
    },
    {
      id: 8,
      title: "Local Food Guide: Must-Try Nepali Dishes",
      date: "2024-09-20",
      category: "food",
      excerpt: "A culinary journey through Nepal's diverse cuisine. From dal bhat to momos, discover authentic flavors and where to find them.",
      readTime: "7 min read",
      views: 2234,
      tags: ["food", "cuisine", "local", "restaurants"],
      featured: false,
      image: PashupatinathImage
    },
    {
      id: 9,
      title: "Yoga and Wellness Retreats",
      date: "2024-08-18",
      category: "wellness",
      excerpt: "Find inner peace in Nepal's serene settings. Best yoga retreats, meditation centers, and wellness programs across the country.",
      readTime: "9 min read",
      views: 1765,
      tags: ["yoga", "wellness", "meditation", "retreats"],
      featured: false,
      image: KhaptadImage
    },
    {
      id: 10,
      title: "Mountain Biking Adventures in Nepal",
      date: "2024-07-30",
      category: "adventure",
      excerpt: "Discover Nepal's best mountain biking trails. From Kathmandu Valley rides to challenging mountain routes and bike rental tips.",
      readTime: "12 min read",
      views: 1432,
      tags: ["biking", "adventure", "trails", "mountains"],
      featured: false,
      image: ShivapuriImage
    }
  ];
  const categories = [
    { value: "all", label: "All Categories", count: newsletters.length },
    { value: "destinations", label: "Destinations", count: newsletters.filter(n => n.category === "destinations").length },
    { value: "culture", label: "Culture & Heritage", count: newsletters.filter(n => n.category === "culture").length },
    { value: "safety", label: "Safety & Tips", count: newsletters.filter(n => n.category === "safety").length },
    { value: "food", label: "Food & Cuisine", count: newsletters.filter(n => n.category === "food").length },
    { value: "tips", label: "Travel Tips", count: newsletters.filter(n => n.category === "tips").length },
    { value: "adventure", label: "Adventure Sports", count: newsletters.filter(n => n.category === "adventure").length },
    { value: "photography", label: "Photography", count: newsletters.filter(n => n.category === "photography").length },
    { value: "wildlife", label: "Wildlife & Nature", count: newsletters.filter(n => n.category === "wildlife").length },
    { value: "wellness", label: "Wellness & Yoga", count: newsletters.filter(n => n.category === "wellness").length }
  ];

  const years = [
    { value: "all", label: "All Years" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" }
  ];

  // Filter newsletters based on search and category
  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || newsletter.category === selectedCategory;
    const matchesYear = selectedYear === "all" || newsletter.date.startsWith(selectedYear);
    
    return matchesSearch && matchesCategory && matchesYear;
  });

  const featuredNewsletters = filteredNewsletters.filter(n => n.featured);

  const toggleBookmark = (id) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarkedItems(newBookmarks);
  };

  const handleImageLoad = (id) => {
    setImageLoadingStates(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleImageLoadStart = (id) => {
    setImageLoadingStates(prev => new Set(prev).add(id));
  };
  const NewsletterCard = ({ newsletter, featured = false }) => (
    <article className={`group relative overflow-hidden transition-all duration-700 transform-gpu hover:scale-[1.02] ${
      featured 
        ? 'bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/30 dark:from-slate-800 dark:via-teal-900/20 dark:to-cyan-900/20 border-2 border-teal-200 dark:border-teal-700 shadow-2xl hover:shadow-3xl' 
        : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl hover:shadow-2xl'
    } rounded-3xl`}>
      
      {/* Premium Background Effects */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"></div>
      </div>

      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-black rounded-full shadow-2xl backdrop-blur-xl border border-white/20">
            <FaStar className="text-yellow-300 animate-pulse" />
            <span>FEATURED</span>
          </div>
        </div>
      )}
      
      {/* Ultra Premium Image Section */}
      <div className="relative overflow-hidden rounded-t-3xl">
        {imageLoadingStates.has(newsletter.id) && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 dark:text-slate-400 text-sm font-medium">Loading...</div>
          </div>
        )}
        <img 
          src={newsletter.image} 
          alt={newsletter.title}
          className="w-full h-64 object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
          onLoadStart={() => handleImageLoadStart(newsletter.id)}
          onLoad={() => handleImageLoad(newsletter.id)}
          onError={(e) => {
            handleImageLoad(newsletter.id);
            e.target.src = "/api/placeholder/400/250";
            e.target.onerror = null;
          }}
        />
        
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        {/* Ultra Premium Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(newsletter.id);
            }}
            className={`w-12 h-12 rounded-2xl transition-all duration-300 backdrop-blur-2xl shadow-2xl border border-white/20 flex items-center justify-center transform hover:scale-110 hover:rotate-12 ${
              bookmarkedItems.has(newsletter.id)
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                : 'bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-slate-300 hover:text-amber-500'
            }`}
            title={bookmarkedItems.has(newsletter.id) ? 'Remove bookmark' : 'Add bookmark'}
          >
            <FaBookmark className="text-lg" />
          </button>
          <button 
            className="w-12 h-12 bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-slate-300 rounded-2xl hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 backdrop-blur-2xl shadow-2xl border border-white/20 flex items-center justify-center transform hover:scale-110 hover:rotate-12"
            title="Share article"
          >
            <FaShare className="text-lg" />
          </button>
        </div>
        
        {/* Premium Reading Time Badge */}
        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/80 text-white text-sm font-bold rounded-full backdrop-blur-xl border border-white/20">
            <FaClock className="text-teal-400" />
            <span>{newsletter.readTime}</span>
          </div>
        </div>
      </div>

      {/* Ultra Premium Content Section */}
      <div className="relative z-10 p-8">
        {/* Premium Meta Information */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-white text-xs" />
              </div>
              <span className="font-medium">{new Date(newsletter.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FaEye className="text-white text-xs" />
              </div>
              <span className="font-medium">{newsletter.views.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-700 dark:text-slate-300 text-xs font-black rounded-full capitalize border border-gray-200 dark:border-slate-600">
            {newsletter.category.replace('-', ' ')}
          </div>
        </div>
        {/* Ultra Premium Title */}
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedNewsletter(newsletter);
              setShowFullContent(true);
            }}
            className="text-left hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer w-full text-left line-clamp-2"
          >
            {newsletter.title}
          </button>
        </h3>

        {/* Premium Excerpt */}
        <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed line-clamp-3 text-lg">
          {newsletter.excerpt}
        </p>

        {/* Ultra Premium Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {newsletter.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 text-sm font-bold rounded-xl hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-800/50 dark:hover:to-cyan-800/50 transition-all duration-300 cursor-pointer border border-teal-200 dark:border-teal-700 transform hover:scale-105"
            >
              #{tag}
            </span>
          ))}
          {newsletter.tags.length > 3 && (
            <span className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 text-sm font-bold rounded-xl border border-gray-200 dark:border-slate-600">
              +{newsletter.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Ultra Premium CTA Section */}
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedNewsletter(newsletter);
              setShowFullContent(true);
            }}
            className="group/btn inline-flex items-center gap-3 text-teal-600 dark:text-teal-400 font-black text-lg hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-300 cursor-pointer"
          >
            <span>Read Full Article</span>
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-12">
              <FaArrowRight className="text-white text-sm" />
            </div>
          </button>
          
          {/* Author Info */}
          {newsletter.author && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <FaUser className="text-white text-xs" />
              </div>
              <span className="font-medium">{newsletter.author}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Header />
      
      {/* Ultra Premium Hero Section */}    
      <div className="relative overflow-hidden">
        {/* Premium Background with Video-like Effect */}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'}`}></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${SwayambhunathImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Premium Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Ultra Premium Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 backdrop-blur-xl mb-8 shadow-2xl">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <FaNewspaper className="text-white text-sm" />
              </div>
              <span className="text-teal-300 font-black text-lg">Knowledge Hub</span>
            </div>
            
            {/* Massive Typography */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none">
              Newsletter
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 animate-pulse">
                Archive
              </span>
            </h1>
            
            {/* Premium Description */}
            <p className="text-xl lg:text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-12 font-medium">
              Discover our curated collection of travel insights, cultural deep-dives, and expert guides. 
              <span className="text-teal-300 font-black"> 10+ premium newsletters</span> covering Nepal's hidden gems, 
              trekking wisdom, and authentic experiences that transform ordinary trips into extraordinary adventures.
            </p>
            
            {/* Ultra Premium Stats */}
            <div className="flex flex-wrap justify-center gap-12 text-lg">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaNewspaper className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">10+</div>
                  <div className="text-sm font-medium">Articles</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaTag className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">10</div>
                  <div className="text-sm font-medium">Categories</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaStar className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">Expert</div>
                  <div className="text-sm font-medium">Insights</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ultra Premium Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className={`${theme === 'dark' ? 'bg-slate-800/95' : 'bg-white/95'} rounded-3xl shadow-2xl border-2 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} backdrop-blur-2xl p-8 lg:p-12 relative overflow-hidden`}>
          
          {/* Premium Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          {/* Ultra Premium Search Header */}
          <div className="relative z-10 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                Explore Our
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                  Archive
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-300 font-medium">Find the perfect guide for your Nepal adventure</p>
            </div>
          </div>
          
          {/* Ultra Premium Search and Filters Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Enhanced Search */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <FaSearch className="text-white text-sm" />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search by title, topic, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-16 pr-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white placeholder-slate-400' : 'border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-lg font-medium`}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-gray-200 bg-gray-50/50 text-gray-900'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 appearance-none cursor-pointer text-lg font-medium`}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FaFilter className="text-white text-sm" />
                  </div>
                </div>
              </div>
            </div>
            {/* Year Filter */}
            <div className="lg:col-span-2 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={`w-full px-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-gray-200 bg-gray-50/50 text-gray-900'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 appearance-none cursor-pointer text-lg font-medium`}
                >
                  {years.map(year => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="lg:col-span-2 flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 py-5 px-4 rounded-2xl font-black text-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-2xl'
                    : `${theme === 'dark' ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 py-5 px-4 rounded-2xl font-black text-lg transition-all duration-300 ${
                  viewMode === "list"
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-2xl'
                    : `${theme === 'dark' ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Ultra Premium Results Summary */}
          <div className="relative z-10 flex items-center justify-between pt-6 border-t-2 border-gray-200 dark:border-slate-700">
            <div className="text-lg text-gray-600 dark:text-slate-300">
              <span className="font-black text-2xl text-gray-900 dark:text-white">{filteredNewsletters.length}</span> 
              <span className="ml-2 font-medium">newsletter{filteredNewsletters.length !== 1 ? 's' : ''} found</span>
              {searchTerm && (
                <span className="ml-3 px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-black">
                  "{searchTerm}"
                </span>
              )}
            </div>
            
            {/* Premium Quick Filters */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">Quick:</span>
              {['destinations', 'safety', 'culture'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-900/50 dark:hover:to-cyan-900/50 text-gray-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 rounded-xl transition-all duration-300 font-bold capitalize transform hover:scale-105"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Ultra Premium Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Ultra Premium Featured Newsletters Section */}
        {featuredNewsletters.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 border border-teal-200 dark:border-teal-700 mb-6">
                <FaStar className="text-teal-600 dark:text-teal-400 text-lg" />
                <span className="text-teal-700 dark:text-teal-300 font-black text-lg">Featured Stories</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                Editor's
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                  Choice
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">Hand-picked stories from our editorial team showcasing the best of Nepal</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-lg text-gray-500 dark:text-slate-400">
                <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                <span className="font-bold">{featuredNewsletters.length} featured articles</span>
              </div>
            </div>
            
            <div className={`grid gap-8 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}>
              {featuredNewsletters.map(newsletter => (
                <NewsletterCard key={newsletter.id} newsletter={newsletter} featured={true} />
              ))}
            </div>
          </section>
        )}

        {/* Ultra Premium All Newsletters Section */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 border border-blue-200 dark:border-blue-700 mb-6">
              <FaNewspaper className="text-blue-600 dark:text-blue-400 text-lg" />
              <span className="text-blue-700 dark:text-blue-300 font-black text-lg">Complete Collection</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              All
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Articles
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">Browse our complete collection of travel insights and expert guides</p>
            
            {/* Premium Sort Options */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className="text-lg text-gray-500 dark:text-slate-400 font-medium">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { value: 'latest', label: 'Latest First' },
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'alphabetical', label: 'A-Z' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl'
                        : `${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {filteredNewsletters.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}>
              {filteredNewsletters.map(newsletter => (
                <NewsletterCard key={newsletter.id} newsletter={newsletter} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <FaNewspaper className="w-16 h-16 text-gray-400 dark:text-slate-400" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">No articles found</h3>
              <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
                We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedYear("all");
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 font-black text-lg shadow-2xl transform hover:scale-105"
              >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </div>
      {/* Ultra Premium Newsletter Subscription CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-4xl p-12 lg:p-16 shadow-2xl">
          
          {/* Ultra Premium Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)`,
              backgroundSize: '400px 400px, 600px 600px'
            }}></div>
          </div>
          
          {/* Premium Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* Ultra Premium Content */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 backdrop-blur-xl mb-8 shadow-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-teal-300 font-black text-xl">Stay Connected</span>
            </div>
            
            <h3 className="text-4xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Never Miss an
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 animate-pulse">
                Adventure Story
              </span>
            </h3>
            
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
              Join thousands of travelers getting exclusive insights, hidden gems, and expert tips 
              delivered straight to their inbox every week. Transform your Nepal journey with insider knowledge.
            </p>
            
            {/* Ultra Premium Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-12">
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <FaNewspaper className="text-white text-2xl" />
                </div>
                <span className="text-4xl font-black text-white mb-2">10+</span>
                <span className="text-gray-400 font-medium text-lg">Expert Articles</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <FaTag className="text-white text-2xl" />
                </div>
                <span className="text-4xl font-black text-white mb-2">10</span>
                <span className="text-gray-400 font-medium text-lg">Categories</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <FaUser className="text-white text-2xl" />
                </div>
                <span className="text-4xl font-black text-white mb-2">5K+</span>
                <span className="text-gray-400 font-medium text-lg">Subscribers</span>
              </div>
            </div>
            {/* Ultra Premium CTA Button */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => {
                  const footer = document.querySelector('footer');
                  if (footer) {
                    footer.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="group inline-flex items-center gap-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white font-black px-12 py-6 rounded-2xl hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 cursor-pointer text-xl relative overflow-hidden"
              >
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Subscribe to Newsletter</span>
                
                {/* Premium Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              
              <Link 
                to="/newsletter-archive"
                className="inline-flex items-center gap-3 text-gray-300 hover:text-white font-bold text-xl transition-colors duration-300"
              >
                <span>Browse Archive</span>
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaArrowRight className="text-sm" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Ultra Premium Full Content Modal */}
      {showFullContent && selectedNewsletter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                    <FaNewspaper className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedNewsletter.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mt-1">
                      <span>{new Date(selectedNewsletter.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{selectedNewsletter.readTime}</span>
                      <span>•</span>
                      <span>{selectedNewsletter.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowFullContent(false)}
                  className="w-12 h-12 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-2xl flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-slate-300" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {selectedNewsletter.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }} />
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-8 text-amber-800 dark:text-amber-300">
                      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FaNewspaper className="text-amber-600 dark:text-amber-400 text-2xl" />
                      </div>
                      <p className="font-black text-xl mb-2">📝 Full newsletter content coming soon!</p>
                      <p className="text-lg">This newsletter's complete content is being prepared. Check back soon for the full article.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Footer */}
            {selectedNewsletter.authorBio && (
              <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                    {selectedNewsletter.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-gray-800 dark:text-white mb-2 text-lg">{selectedNewsletter.author}</h4>
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed">{selectedNewsletter.authorBio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-700/50 rounded-b-3xl">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleBookmark(selectedNewsletter.id);
                    }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-bold ${
                      bookmarkedItems.has(selectedNewsletter.id)
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xl'
                        : 'bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-500'
                    }`}
                  >
                    <FaBookmark />
                    <span>{bookmarkedItems.has(selectedNewsletter.id) ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                  <button className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 text-gray-700 dark:text-slate-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-300 font-bold">
                    <FaShare />
                    <span>Share</span>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 font-bold shadow-2xl">
                    <FaDownload />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowFullContent(false);
                    }}
                    className="px-6 py-3 bg-gray-600 dark:bg-slate-500 text-white rounded-2xl hover:bg-gray-700 dark:hover:bg-slate-400 transition-all duration-300 font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default NewsletterArchive;