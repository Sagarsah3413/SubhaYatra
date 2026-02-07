import { useEffect, useState } from "react";
import axios from "axios";
import UserStatsCard from "../../components/UserStatsCard";

export default function AdminDashboard() {
  const [lastLoginTime, setLastLoginTime] = useState(null);
  const [lastLogoutTime, setLastLogoutTime] = useState(null);
  const [submittedPlaces, setSubmittedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({
    totalPlaces: 0,
    totalHotels: 0,
    totalRestaurants: 0,
    recentSubmissions: 0
  });

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [placesRes, hotelsRes, restaurantsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/places?limit=1"),
          axios.get("http://localhost:8000/api/hotels?limit=1"),
          axios.get("http://localhost:8000/api/restaurants?limit=1")
        ]);
        
        setStats({
          totalPlaces: placesRes.data.total || 0,
          totalHotels: hotelsRes.data.total || 0,
          totalRestaurants: restaurantsRes.data.total || 0,
          recentSubmissions: placesRes.data.total || 0
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Fetch last login/logout times
  useEffect(() => {
    const fetchAdminActivity = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/activity");
        setLastLoginTime(res.data.lastLogin);
        setLastLogoutTime(res.data.lastLogout);
      } catch (err) {
        console.error("Failed to fetch admin activity:", err);
      }
    };
    fetchAdminActivity();
  }, []);

  // Fetch submitted places
  useEffect(() => {
    const fetchSubmittedPlaces = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/places?limit=100");
        setSubmittedPlaces(res.data.places || []);
      } catch (err) {
        console.error("Failed to fetch submitted places:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'places') {
      fetchSubmittedPlaces();
    }
  }, [activeTab]);

  // Filter places
  const filteredPlaces = submittedPlaces.filter(place => {
    const matchesSearch = place.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || place.type === filterType;
    return matchesSearch && matchesType;
  });

  // Delete place handler
  const handleDeletePlace = async (placeId) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/places/${placeId}`);
      setSubmittedPlaces(prev => prev.filter(p => p.id !== placeId));
      setSelectedPlace(null);
      
      // Show success toast
      showToast('success', 'Place deleted successfully!');
    } catch (err) {
      console.error("Failed to delete place:", err);
      showToast('error', 'Failed to delete place. Please try again.');
    }
  };

  // Toast notification
  const [toast, setToast] = useState(null);
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Sign Out handler
  const handleSignOut = async () => {
    try {
      const activity_id = localStorage.getItem("adminActivityId");
      await axios.post("http://localhost:8000/admin/logout", { activity_id });
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminActivityId");
      window.location.href = "/login";
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
          <div className={`px-6 py-4 rounded-xl shadow-2xl border-l-4 ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
              : 'bg-rose-50 border-rose-500 text-rose-800'
          }`}>
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-semibold">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Professional Header */}
      <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl shadow-xl">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">Tourism Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-200">System Online</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="group relative px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Sign Out
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Professional Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`relative px-8 py-4 font-bold transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'text-teal-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>Overview</span>
              </div>
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-full"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('places')}
              className={`relative px-8 py-4 font-bold transition-all duration-300 ${
                activeTab === 'places'
                  ? 'text-teal-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Submitted Places</span>
                {submittedPlaces.length > 0 && (
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs font-black rounded-full shadow-lg">
                    {submittedPlaces.length}
                  </span>
                )}
              </div>
              {activeTab === 'places' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="p-6 flex-1 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            <UserStatsCard />
            
            {/* Admin activity info */}
            <div className="p-6 bg-white shadow-lg rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Admin Activity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-700 font-semibold mb-1">Last Login</p>
                  <p className="text-lg font-bold text-emerald-900">{lastLoginTime || "N/A"}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-lg border border-rose-200">
                  <p className="text-sm text-rose-700 font-semibold mb-1">Last Logout</p>
                  <p className="text-lg font-bold text-rose-900">{lastLogoutTime || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">Total Places</p>
                    <p className="text-3xl font-black text-slate-800 mt-2">{submittedPlaces.length || '...'}</p>
                  </div>
                  <div className="p-4 bg-teal-100 rounded-xl">
                    <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">Pending Review</p>
                    <p className="text-3xl font-black text-slate-800 mt-2">0</p>
                  </div>
                  <div className="p-4 bg-amber-100 rounded-xl">
                    <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">Published</p>
                    <p className="text-3xl font-black text-slate-800 mt-2">{submittedPlaces.length || '...'}</p>
                  </div>
                  <div className="p-4 bg-emerald-100 rounded-xl">
                    <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Submitted Places Section */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-b border-slate-200 px-6 py-4">
                <h2 className="text-2xl font-black text-slate-800">Submitted Places</h2>
                <p className="text-sm text-slate-600 mt-1">View and manage all user-submitted places</p>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center gap-3 text-slate-600">
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-semibold">Loading places...</span>
                  </div>
                </div>
              ) : submittedPlaces.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No Places Submitted Yet</h3>
                  <p className="text-slate-600">User-submitted places will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Place</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Tags</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {submittedPlaces.map((place) => (
                        <tr key={place.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {place.image_url ? (
                                <img 
                                  src={`http://localhost:8000${place.image_url}`} 
                                  alt={place.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                  onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=No+Image'}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-slate-800">{place.name}</p>
                                <p className="text-xs text-slate-500">ID: {place.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{place.location || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                              {place.type || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {place.tags ? (
                              <div className="flex flex-wrap gap-1">
                                {place.tags.split(',').slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                    #{tag.trim()}
                                  </span>
                                ))}
                                {place.tags.split(',').length > 2 && (
                                  <span className="text-xs text-slate-400">+{place.tags.split(',').length - 2}</span>
                                )}
                              </div>
                            ) : 'No tags'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedPlace(place)}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors duration-200"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeletePlace(place.id)}
                                className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-200 transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-blue-500 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Place Details</h3>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedPlace.image_url && (
                <img 
                  src={`http://localhost:8000${selectedPlace.image_url}`}
                  alt={selectedPlace.name}
                  className="w-full h-64 object-cover rounded-xl border border-slate-200"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'}
                />
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Name</label>
                  <p className="text-lg font-semibold text-slate-800 mt-1">{selectedPlace.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Location</label>
                    <p className="text-slate-800 mt-1">{selectedPlace.location || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Type</label>
                    <p className="text-slate-800 mt-1">{selectedPlace.type || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Description</label>
                  <p className="text-slate-700 mt-1 leading-relaxed">{selectedPlace.description || 'No description provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPlace.tags ? selectedPlace.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                        #{tag.trim()}
                      </span>
                    )) : <span className="text-slate-500">No tags</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDeletePlace(selectedPlace.id);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-red-700 transition-all duration-200 shadow-lg"
                >
                  Delete Place
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 p-6 text-center text-sm mt-auto">
        <p className="font-semibold">Tourism Management System — Admin Portal</p>
        <p className="text-slate-500 mt-1">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
}
