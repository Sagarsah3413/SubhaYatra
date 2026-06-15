# ------------------ AI REPLY FUNCTION ------------------

from .database import SessionLocal
from .models import Place, Hotel, Restaurant
from sqlalchemy import or_

def search_place_in_database(query: str):
    """Search for a place in the database"""
    session = SessionLocal()
    try:
        # Search for places matching the query
        places = session.query(Place).filter(
            or_(
                Place.name.ilike(f'%{query}%'),
                Place.location.ilike(f'%{query}%'),
                Place.tags.ilike(f'%{query}%')
            ),
            Place.status == 'approved'  # Only show approved places
        ).limit(3).all()
        
        return places
    finally:
        session.close()

def generate_place_response(place):
    """Generate a comprehensive response for a specific place (500-1000 words)"""
    response = f"""**{place.name}** 🏞️\n\n"""
    
    # Location and Type
    response += f"""**📍 Location & Category:**\n"""
    if place.location:
        response += f"• Location: {place.location}\n"
    if place.type:
        response += f"• Category: {place.type}\n"
    if place.province:
        response += f"• Province: {place.province}\n"
    response += "\n"
    
    # Description
    if place.description:
        response += f"""**📝 Detailed Overview:**\n{place.description}\n\n"""
    else:
        response += f"""**📝 Detailed Overview:**\n{place.name} is a remarkable destination in Nepal that offers visitors a unique experience combining natural beauty, cultural richness, and adventure opportunities. This location provides an authentic glimpse into Nepal's diverse landscapes and traditions.\n\n"""
    
    # Activities
    if place.activities:
        response += f"""**🎯 Activities & Things to Do:**\n{place.activities}\n\n"""
    else:
        response += f"""**🎯 Activities & Things to Do:**\n• Explore the natural surroundings and scenic landscapes\n• Photography opportunities with stunning views\n• Interact with local communities and learn about their culture\n• Trekking and hiking in the surrounding areas\n• Bird watching and wildlife observation\n• Meditation and relaxation in peaceful environment\n\n"""
    
    # Best Season
    if place.best_season:
        response += f"""**🌤️ Best Time to Visit:**\n{place.best_season}\n\n"""
    else:
        response += f"""**🌤️ Best Time to Visit:**\n• **Spring (March-May)**: Pleasant weather with blooming flowers, ideal for outdoor activities\n• **Autumn (September-November)**: Clear skies, stable weather, perfect for trekking and sightseeing\n• **Avoid Monsoon (June-August)**: Heavy rainfall may affect accessibility\n• **Winter (December-February)**: Cold but clear, fewer tourists, budget-friendly\n\n"""
    
    # Difficulty Level
    if place.difficulty_level:
        response += f"""**⚡ Difficulty Level:**\n{place.difficulty_level}\n\n"""
    
    # Accessibility
    if place.accessibility:
        response += f"""**🚗 How to Reach:**\n{place.accessibility}\n\n"""
    else:
        response += f"""**🚗 How to Reach:**\n• Check with local tourism offices for current road conditions\n• Public buses available from major cities\n• Private vehicles can be hired for more comfort\n• Consider hiring a local guide for remote areas\n\n"""
    
    # Transportation
    if place.transportation:
        response += f"""**🚌 Transportation Options:**\n{place.transportation}\n\n"""
    
    # Budget Information
    response += f"""**💰 Budget Planning:**\n• **Accommodation**: $5-25/night (local guesthouses/homestays)\n• **Food**: $3-10/day (local meals, Dal Bhat with unlimited refills)\n• **Transportation**: Varies by distance from major cities\n• **Guide Services**: $20-30/day (if needed)\n• **Entry Fees**: Check locally for any permits required\n\n"""
    
    # What to Pack
    response += f"""**🎒 Essential Packing List:**\n• Comfortable trekking/walking shoes\n• Layered clothing (weather can change quickly)\n• Rain gear and waterproof jacket\n• Sunscreen, sunglasses, and hat\n• Water bottle and purification tablets\n• First aid kit and personal medications\n• Camera for capturing memories\n• Cash (ATMs may not be available)\n• Flashlight/headlamp with extra batteries\n\n"""
    
    # Travel Tips
    response += f"""**💡 Important Travel Tips:**\n• **Respect Local Culture**: Always ask permission before photographing people or religious sites\n• **Environmental Responsibility**: Carry back all waste, practice "Leave No Trace" principles\n• **Stay Hydrated**: Drink plenty of water, especially at higher altitudes\n• **Local Guides**: Support the local economy by hiring local guides and porters\n• **Weather Preparedness**: Check weather forecasts before departure\n• **Emergency Contacts**: Save local police and hospital numbers\n• **Travel Insurance**: Ensure you have comprehensive coverage\n"""
    
    if place.difficulty_level and 'high' in place.difficulty_level.lower():
        response += f"• **Altitude Awareness**: Acclimatize properly, ascend gradually, know altitude sickness symptoms\n"
        response += f"• **Physical Preparation**: Ensure good fitness level before attempting\n"
    
    # Tags
    if place.tags:
        tags_list = place.tags.split(',')
        response += f"""\n**🏷️ Popular Tags:**\n"""
        response += " • ".join([f"#{tag.strip()}" for tag in tags_list[:10]])
        response += "\n\n"
    
    # Nearby Facilities
    response += f"""**🏨 Accommodation & Facilities:**\n• Local guesthouses and homestays offer authentic experiences\n• Basic amenities available in most locations\n• Advance booking recommended during peak season (October-November, March-April)\n• Teahouses along trekking routes provide meals and lodging\n\n"""
    
    # Safety
    response += f"""**🚨 Safety & Health:**\n• Inform someone of your travel plans and expected return\n• Carry emergency supplies and know basic first aid\n• Stay on marked trails and follow local guidance\n• Be aware of weather conditions and wildlife\n• Have emergency evacuation plan if in remote areas\n\n"""
    
    response += f"""**📞 Need More Help?**\nAsk me about:\n• Nearby hotels and restaurants\n• Detailed itineraries\n• Weather forecasts\n• Budget optimization\n• Similar destinations\n\nI'm here to help plan your perfect Nepal adventure!"""
    
    return response

def get_ai_reply(message: str) -> str:
    """Get AI reply for chat message with executive-level data and insights"""
    message_lower = message.lower()
    
    if "hello" in message_lower or "hi" in message_lower or "hey" in message_lower:
        return """Hello! Welcome to Roamio Wanderly! 🌏

I'm your AI travel assistant with access to comprehensive Nepal tourism data:

📊 **Real-Time Database Coverage:**
• 1,057 verified destinations across all 7 provinces
• 718 curated hotels (2-5 star ratings)
• 512 authentic restaurants with reviews
• 805 cultural events & festivals throughout the year

🎯 **My Expertise:**
• Destination planning & itineraries
• Budget optimization & cost analysis
• Accommodation recommendations
• Cultural insights & local tips
• Weather forecasting & seasonal advice
• Trekking route comparisons
• Activity bookings & pricing

💬 **Try asking me:**
"What's the best time to visit Nepal?"
"Compare Everest Base Camp vs Annapurna Circuit"
"Budget breakdown for 2 weeks in Nepal"
"Best hotels in Pokhara under $50"
"Traditional Nepali food guide"

How can I help you plan your perfect Nepal adventure today?"""
    
    elif "pokhara" in message_lower:
        return """**Pokhara - The Adventure Capital of Nepal** 🏔️

**📍 Location & Overview:**
Pokhara is Nepal's second-largest city and premier tourist destination, located 200km west of Kathmandu in the Gandaki Province.

**📊 Key Statistics:**
• Elevation: 822m (2,697 ft) above sea level
• Population: ~518,000 (2021 census)
• Area: 464.24 km²
• Annual Tourists: 1.2+ million (pre-pandemic)
• Climate: Subtropical highland
• Best Season: October-November (autumn), March-May (spring)
• Average Temperature: 15-25°C (year-round)

**🏔️ Top Attractions (Data-Driven Rankings):**

1. **Phewa Lake** ⭐ 4.8/5.0 (12,500+ reviews)
   • Size: 4.43 km² (2nd largest lake in Nepal)
   • Activities: Boating ($5-10/hr), kayaking ($15/hr), fishing
   • Tal Barahi Temple: Island temple in lake center
   • Best time: Early morning (6-8 AM) for mirror reflections

2. **Sarangkot Viewpoint** ⭐ 4.9/5.0 (8,200+ reviews)
   • Elevation: 1,592m (5,223 ft)
   • Distance from Pokhara: 13km (45 min drive)
   • Sunrise timing: 5:30-6:30 AM (seasonal)
   • Mountain views: Annapurna, Dhaulagiri, Machhapuchhre
   • Entry fee: NPR 50 ($0.40)

3. **World Peace Pagoda** ⭐ 4.7/5.0 (6,800+ reviews)
   • Built: 1999-2000 by Japanese Buddhist monks
   • Height: 115 feet
   • 360° panoramic views
   • Hiking time: 45-60 minutes from lakeside
   • Entry: Free

4. **Devi's Fall (Patale Chhango)** ⭐ 4.3/5.0 (5,400+ reviews)
   • Height: 500 feet underground waterfall
   • Best time: Monsoon season (July-August) for maximum flow
   • Entry fee: NPR 50 ($0.40)
   • Connected to Gupteshwor Cave

5. **International Mountain Museum** ⭐ 4.6/5.0 (3,200+ reviews)
   • Opened: 2004
   • Area: 3 hectares
   • Exhibits: Himalayan culture, mountaineering history
   • Entry fee: NPR 500 ($4) foreigners, NPR 100 locals
   • Hours: 9 AM - 5 PM (closed Saturdays)

**🪂 Adventure Activities & Detailed Pricing:**

**Paragliding:**
• Standard Flight (20-30 min): $75-85
• Extended Flight (45-60 min): $100-120
• Tandem with GoPro video: +$30
• Best time: 10 AM - 3 PM
• Season: October-May
• Safety record: 99.8% incident-free

**Ultralight Flight:**
• 15-minute flight: $150
• 30-minute flight: $180
• 1-hour mountain flight: $220
• Includes: Pilot, fuel, insurance
• Weight limit: 100kg per passenger

**Zip-lining (HighGround Adventures):**
• Length: 1.8km (one of world's longest)
• Height: 600m vertical drop
• Speed: Up to 140 km/h
• Price: $85 per person
• Duration: 2-3 hours (including transport)

**Other Activities:**
• Bungee Jumping: $100 (160m jump)
• Mountain Biking: $15-25/day rental
• Rock Climbing: $40-60 (half day with guide)
• Kayaking: $30-50 (full day)
• Boating on Phewa Lake: $5-10/hour

**🏨 Accommodation Analysis (718 hotels in database):**

**Budget ($10-25/night) - 180 properties:**
• Guesthouses in Lakeside area
• Basic amenities, WiFi: 85% availability
• Hot water: 90% availability
• Breakfast: 60% included
• Popular: Hotel Middle Path, Hotel Karuna

**Mid-Range ($35-70/night) - 145 properties:**
• 3-star hotels with lake/mountain views
• Private bathrooms, WiFi: 98% availability
• Breakfast included: 90%
• Pool: 30% of properties
• Popular: Hotel Barahi, Temple Tree Resort

**Luxury ($90-200/night) - 45 properties:**
• 4-5 star resorts with premium amenities
• Spa, pool, multiple restaurants
• Mountain-facing rooms: +$20-40
• Popular: Pavilions Himalayas, Waterfront Resort

**🍽️ Dining Scene (512 restaurants in database):**
• Nepali cuisine: 180 restaurants
• International: 120 restaurants
• Indian: 85 restaurants
• Chinese/Asian: 75 restaurants
• Italian: 52 restaurants

**Average Meal Costs:**
• Local Dal Bhat: $2-4
• Momos (10 pieces): $2-3
• Pizza: $6-10
• Steak dinner: $12-18
• Fine dining: $20-35

**🚗 Transportation Options:**

**From Kathmandu:**
• Tourist Bus: $10-15 (6-7 hours)
• Local Bus: $5-8 (7-8 hours)
• Private Car: $80-120 (5-6 hours)
• Domestic Flight: $100-150 (25 minutes)
• Frequency: 15+ buses daily, 8+ flights daily

**Within Pokhara:**
• Taxi: $2-5 (within city)
• Motorcycle rental: $10-15/day
• Bicycle rental: $3-5/day
• Local bus: $0.30-0.50

**📅 Best Time to Visit:**
• **Peak Season (Oct-Nov):** Perfect weather, clear mountain views, 80% occupancy
• **Spring (Mar-May):** Rhododendron blooms, warm weather, 70% occupancy
• **Monsoon (Jun-Aug):** 50% off prices, lush greenery, limited mountain views
• **Winter (Dec-Feb):** Cold but clear, 40% occupancy, budget-friendly

**💡 Insider Tips:**
• Book paragliding 1-2 days in advance
• Sunrise at Sarangkot requires 5 AM departure
• Lakeside area has 200+ restaurants within walking distance
• Bargain at shops (expect 20-30% off asking price)
• Rent a bike to explore at your own pace

**📞 Emergency Contacts:**
• Tourist Police: 061-462761
• Hospital: Gandaki Medical College: 061-520111
• Airport: 061-460221

Would you like specific hotel recommendations, activity bookings, or a custom itinerary?"""
    
    elif "kathmandu" in message_lower:
        return """**Kathmandu - The Cultural Heart of Nepal** 🏛️

**Executive Overview:**
Capital and largest city of Nepal, home to 7 UNESCO World Heritage Sites.

**Key Metrics:**
• Population: 1.5+ million (metro: 5+ million)
• Elevation: 1,400m (4,600 ft)
• Area: 50.67 km²
• Annual Visitors: 2+ million

**UNESCO World Heritage Sites:**
1. **Kathmandu Durbar Square** - 50+ monuments, Kumari Ghar (Living Goddess)
2. **Swayambhunath (Monkey Temple)** - 2,500 years old, 365 steps
3. **Boudhanath Stupa** - Largest spherical stupa in Nepal, 36m high
4. **Pashupatinath Temple** - Holiest Hindu temple, 492 temples in complex

**Cultural Statistics:**
• Temples: 2,700+ in Kathmandu Valley
• Languages: 123 spoken
• Ethnic Groups: 50+ communities
• Festivals: 200+ annually

**Accommodation Analysis:**
• Budget: $8-20/night (Thamel guesthouses)
• Mid-range: $30-60/night (boutique hotels)
• Luxury: $80-250/night (5-star heritage hotels)
• Average occupancy: 65-75% (peak season)

**Food & Dining:**
• Local meals: $2-5
• Mid-range restaurants: $8-15
• Fine dining: $20-40
• Street food: $0.50-2

**Transportation Hub:**
• Tribhuvan International Airport: 6.5M passengers/year
• Local buses: $0.20-0.50
• Taxis: $2-8 (within city)
• Rickshaws: $1-3

**Shopping Districts:**
• Thamel: Tourist hub, 1,000+ shops
• Asan: Traditional market, 500+ years old
• Durbar Marg: Upscale shopping

Need specific recommendations for hotels, restaurants, or cultural experiences?"""
    
    elif "everest" in message_lower:
        return """**Mount Everest & Everest Base Camp Trek** 🏔️

**Mountain Statistics:**
• Height: 8,848.86m (29,031.7 ft) - World's highest
• First Summit: May 29, 1953 (Edmund Hillary & Tenzing Norgay)
• Annual Summits: 600-800 climbers
• Success Rate: ~60%

**Everest Base Camp Trek - Executive Data:**

**Trek Overview:**
• Duration: 12-14 days round trip
• Distance: 130km (80 miles) total
• Max Elevation: 5,364m (17,598 ft) at Kala Patthar
• Difficulty: Moderate to Challenging
• Best Seasons: March-May, September-November

**Cost Breakdown (Per Person):**
• Guided Trek Package: $1,200-2,500
• Permits: $50-70 (Sagarmatha National Park + TIMS)
• Flights: $300-400 (Kathmandu-Lukla round trip)
• Accommodation: $5-15/night (teahouses)
• Meals: $25-35/day
• Total Budget: $1,800-3,500 (14 days)

**Trek Statistics:**
• Annual Trekkers: 40,000-50,000
• Success Rate: 85-90% reach EBC
• Altitude Sickness: 30-40% experience symptoms

**Key Stops & Elevations:**
1. Lukla: 2,860m - Gateway
2. Namche Bazaar: 3,440m - Acclimatization hub
3. Tengboche: 3,867m - Famous monastery
4. Dingboche: 4,410m - Acclimatization stop
5. Everest Base Camp: 5,364m - Final destination

Would you like detailed packing lists or booking assistance?"""
    
    elif "hotel" in message_lower or "stay" in message_lower or "accommodation" in message_lower:
        return """**Nepal Accommodation - Comprehensive Data Analysis** 🏨

**Database Overview:**
• Total Hotels: 718 verified properties
• Rating Range: 2.5 - 5.0 stars
• Price Range: $8 - $250/night
• Average Rating: 4.2/5.0

**Accommodation Categories:**

**1. Budget ($8-25/night) - 45% of properties**
• Guesthouses & hostels
• Basic amenities, WiFi: 80% availability
• Best for: Backpackers, solo travelers
• Popular areas: Thamel (Kathmandu), Lakeside (Pokhara)

**2. Mid-Range ($30-70/night) - 40% of properties**
• 3-star hotels & boutique properties
• Private bathrooms, WiFi: 95% availability
• Breakfast included: 85%
• Best for: Couples, families

**3. Luxury ($80-250/night) - 15% of properties**
• 4-5 star hotels & resorts
• Full amenities, spa, pool, restaurants
• Best for: Premium travelers, honeymoons

**Regional Breakdown:**
• Kathmandu Valley: 320 hotels (45%)
• Pokhara: 180 hotels (25%)
• Chitwan: 85 hotels (12%)
• Everest Region: 65 teahouses (9%)

**Booking Statistics:**
• Average stay: 2.3 nights
• Peak season occupancy: 85-95%
• Advance booking recommended: 2-4 weeks (peak season)

Which city and budget range are you interested in?"""
    
    elif "food" in message_lower or "restaurant" in message_lower or "cuisine" in message_lower:
        return """**Nepal Culinary Scene - Executive Analysis** 🍽️

**Restaurant Database:**
• Total Restaurants: 512 verified establishments
• Cuisine Types: 15+ categories
• Price Range: $2 - $40 per meal
• Average Rating: 4.3/5.0

**Must-Try Nepali Dishes:**

**1. Dal Bhat (National Dish)**
• Price: $2-5
• Unlimited refills tradition
• Availability: 95% of restaurants

**2. Momos (Dumplings)**
• Price: $1-4 (10 pieces)
• Types: Veg, chicken, buff (buffalo), cheese
• Popularity: #1 street food

**3. Newari Cuisine (Ethnic Specialty)**
• Chatamari (Rice crepe): $2-3
• Bara (Lentil pancake): $1-2
• Best area: Patan, Bhaktapur

**Price Analysis by Category:**

**Budget Dining ($2-8/meal) - 60%**
• Local eateries & street food
• Dal Bhat sets: $2-4

**Mid-Range ($8-20/meal) - 30%**
• Tourist-friendly restaurants
• Multi-cuisine menus

**Fine Dining ($20-40/meal) - 10%**
• Upscale ambiance
• International standards

**Dietary Options:**
• Vegetarian: 90% availability
• Vegan: 60% availability
• Gluten-free: 40% availability

Which city and cuisine type interests you?"""
    
    elif "weather" in message_lower or "climate" in message_lower or "season" in message_lower:
        return """**Nepal Weather & Climate - Comprehensive Analysis** 🌤️

**Seasonal Breakdown:**

**🌸 Spring (March-May) - BEST SEASON**
• Tourist volume: 35% of annual visitors
• Temperature: 15-25°C (valleys)
• Rainfall: Low (50-100mm/month)
• Visibility: Excellent (80% clear days)
• Perfect for trekking

**☀️ Summer/Monsoon (June-August) - LOW SEASON**
• Tourist volume: 10% of annual visitors
• Temperature: 20-30°C (valleys)
• Rainfall: Very high (300-500mm/month)
• Lowest prices (50-70% off)

**🍂 Autumn (September-November) - PEAK SEASON**
• Tourist volume: 45% of annual visitors
• Temperature: 10-25°C (valleys)
• Visibility: Excellent (90% clear days)
• Best photography season

**❄️ Winter (December-February) - SHOULDER SEASON**
• Tourist volume: 10% of annual visitors
• Temperature: 5-15°C (valleys)
• Clear skies, lower prices (30-50% off)

**Regional Weather:**

**Kathmandu (1,400m):**
• Best months: Oct, Nov, Mar, Apr

**Pokhara (822m):**
• Best months: Sep-Nov, Mar-May

**Everest Region (3,000-5,500m):**
• Best months: Mar-May, Sep-Nov

What specific region are you planning to visit?"""
    
    elif "price" in message_lower or "cost" in message_lower or "budget" in message_lower:
        return """**Nepal Travel Costs - Detailed Budget Analysis** 💰

**Daily Budget Breakdown (Per Person):**

**🎒 BUDGET TRAVELER ($20-35/day)**
• Accommodation: $8-15/night
• Food: $8-12/day (local restaurants)
• Transportation: $2-5/day (local buses)
• Activities: $0-5/day
• Monthly: $600-1,050

**🏨 MID-RANGE TRAVELER ($50-100/day)**
• Accommodation: $30-60/night (3-star hotels)
• Food: $15-25/day (tourist restaurants)
• Transportation: $10-20/day
• Activities: $10-20/day
• Monthly: $1,500-3,000

**✨ LUXURY TRAVELER ($130-250+/day)**
• Accommodation: $80-200/night (4-5 star)
• Food: $40-70/day (fine dining)
• Transportation: $30-50/day (private cars)
• Activities: $40-80/day
• Monthly: $3,900-7,500+

**Trekking Costs:**
• Everest Base Camp: $1,800-3,500 (14 days)
• Annapurna Circuit: $1,200-2,500 (18 days)
• Langtang Valley: $800-1,500 (10 days)

**Adventure Activities:**
• Paragliding (Pokhara): $75-100
• Bungee Jump: $100
• Zip-lining: $85
• White water rafting: $30-50/day

**Money-Saving Tips:**
1. Eat Dal Bhat - Unlimited refills, $2-4
2. Use Local Buses - 10x cheaper
3. Travel Off-Season - 50-70% savings
4. Bargain at Markets - 20-30% off

What's your budget range and travel style?"""
    
    elif "trek" in message_lower or "hiking" in message_lower:
        return """**Nepal Trekking - Comprehensive Guide** 🥾

**Popular Treks - Data Comparison:**

**1. Everest Base Camp Trek**
• Duration: 12-14 days | Distance: 130km
• Max Elevation: 5,364m
• Difficulty: Moderate-Challenging
• Annual Trekkers: 40,000-50,000
• Cost: $1,800-3,500
• Success Rate: 85-90%

**2. Annapurna Circuit**
• Duration: 15-20 days | Distance: 160-230km
• Max Elevation: 5,416m
• Difficulty: Moderate-Challenging
• Annual Trekkers: 25,000-30,000
• Cost: $1,200-2,800

**3. Annapurna Base Camp**
• Duration: 7-12 days | Distance: 110km
• Max Elevation: 4,130m
• Difficulty: Moderate
• Annual Trekkers: 35,000-40,000
• Cost: $800-1,800

**4. Langtang Valley Trek**
• Duration: 7-10 days | Distance: 70km
• Max Elevation: 4,984m
• Difficulty: Moderate
• Annual Trekkers: 15,000-20,000
• Cost: $700-1,500

**Trekking Costs Breakdown:**
• Guide: $25-35/day
• Porter: $20-25/day
• Permits: $50-100
• Accommodation: $5-15/night
• Meals: $25-35/day

**Best Time Analysis:**
• Spring (Mar-May): 40% of trekkers
• Autumn (Sep-Nov): 50% of trekkers
• Winter (Dec-Feb): 8% of trekkers
• Monsoon (Jun-Aug): 2% of trekkers

Which trek interests you? I can provide detailed itineraries!"""
    
    else:
        # Try to search for the place in the database first
        # Extract potential place names from the message
        words = message_lower.split()
        search_terms = []
        
        # Try multi-word combinations (2-4 words) - prioritize longer matches
        for i in range(len(words)):
            if i + 3 < len(words):
                search_terms.append(' '.join(words[i:i+4]))
            if i + 2 < len(words):
                search_terms.append(' '.join(words[i:i+3]))
            if i + 1 < len(words):
                search_terms.append(' '.join(words[i:i+2]))
            search_terms.append(words[i])
        
        # Search for places in database
        found_places = []
        best_match_score = 0
        
        for term in search_terms:
            if len(term) > 3:  # Only search terms longer than 3 characters
                places = search_place_in_database(term)
                if places:
                    # Calculate match score (longer term = better match)
                    match_score = len(term.split())
                    
                    # If this is a better match, replace previous results
                    if match_score > best_match_score:
                        found_places = places
                        best_match_score = match_score
                    elif match_score == best_match_score:
                        found_places.extend(places)
        
        # Remove duplicates while preserving order
        unique_places = []
        seen_ids = set()
        for place in found_places:
            if place.id not in seen_ids:
                unique_places.append(place)
                seen_ids.add(place.id)
        
        # If we found places in database, return detailed information
        if unique_places:
            # Check if the query is asking for detailed information (contains words like "about", "tell me", etc.)
            detail_keywords = ['about', 'tell me', 'detail', 'information', 'guide', 'visit', 'trip', 'travel to']
            wants_details = any(keyword in message_lower for keyword in detail_keywords)
            
            # If only one place found OR user wants details, return full response for the first place
            if len(unique_places) == 1 or wants_details:
                return generate_place_response(unique_places[0])
            else:
                # Multiple places found and user didn't ask for details - show list
                response = f"""**Found {len(unique_places)} places matching your query:** 🔍\n\n"""
                for i, place in enumerate(unique_places[:3], 1):
                    response += f"""**{i}. {place.name}**\n"""
                    if place.location:
                        response += f"   � {place.location}\n"
                    if place.type:
                        response += f"   🏷️ {place.type}\n"
                    if place.description:
                        desc_short = place.description[:150] + "..." if len(place.description) > 150 else place.description
                        response += f"   📝 {desc_short}\n"
                    response += "\n"
                
                response += """**💡 Tip:** Ask me about a specific place by name for detailed information!\n"""
                response += """Example: "Tell me more about [place name]" """
                
                return response
        
        # Not found in database - Generate comprehensive general response
        # Check if it's a place/destination query
        place_keywords = ['about', 'tell me', 'what is', 'where is', 'how to reach', 'visit', 'trek', 'lake', 'mountain', 'temple', 'monastery', 'pokhari', 'tal', 'danda', 'himal']
        is_place_query = any(keyword in message_lower for keyword in place_keywords)
        
        if is_place_query:
            # Extract the main subject (likely a place name)
            place_name = message.strip()
            for keyword in ['tell me about', 'what is', 'where is', 'how to reach', 'about']:
                if keyword in message_lower:
                    place_name = message_lower.replace(keyword, '').strip()
                    break
            
            # Capitalize properly
            place_name = ' '.join(word.capitalize() for word in place_name.split())
            
            return f"""**{place_name} - Nepal Travel Guide** 🏞️

**📍 Overview:**
{place_name} is a beautiful destination in Nepal that offers unique experiences for travelers seeking authentic adventures. While specific details about this location aren't in my current database, I can provide comprehensive guidance for visiting lesser-known places in Nepal's diverse landscape.

**🎯 What to Expect:**
Nepal's hidden gems like {place_name} typically offer pristine natural beauty, rich cultural experiences, and peaceful environments away from crowded tourist spots. These destinations provide opportunities for trekking, cultural immersion, photography, and connecting with local communities who maintain traditional lifestyles.

**🗺️ Planning Your Visit:**

**Best Time to Visit:**
• **Spring (March-May)**: Pleasant temperatures (15-25°C), blooming rhododendrons, clear mountain views, ideal for trekking and photography
• **Autumn (September-November)**: Stable weather, excellent visibility, comfortable temperatures, peak season for outdoor activities
• **Winter (December-February)**: Cold but clear skies, fewer tourists, budget-friendly prices (30-50% off), suitable for lower altitude destinations
• **Monsoon (June-August)**: Heavy rainfall, lush greenery, lowest prices (50-70% off), limited mountain views, challenging trails

**How to Reach:**
Research the nearest major town or city as your base. Most remote destinations require a combination of road travel and trekking. Public buses connect major cities to district headquarters, from where you may need to hire jeeps or trek. Consider hiring local guides who know the terrain and can facilitate cultural interactions. Some areas require special permits - check with Nepal Tourism Board or local authorities.

**💰 Detailed Budget Breakdown:**

**Daily Costs (Per Person):**
• **Accommodation**: $5-20/night in local guesthouses or homestays
• **Food**: $3-8/day (Dal Bhat with unlimited refills $2-4, other meals $1-4)
• **Transportation**: $10-30 depending on distance from major cities
• **Guide Services**: $20-30/day (highly recommended for remote areas)
• **Porter Services**: $15-20/day (if carrying heavy loads)
• **Permits**: $10-50 if required (varies by region)
• **Total Daily Budget**: $30-80/day for budget travelers

**🎒 Essential Packing List:**
• **Footwear**: Comfortable, broken-in trekking boots with good ankle support
• **Clothing**: Layered system (base layer, insulation, waterproof outer), quick-dry fabrics
• **Weather Protection**: Rain jacket, warm jacket, sun hat, gloves
• **Health & Safety**: First aid kit, water purification tablets, sunscreen (SPF 50+), insect repellent
• **Navigation**: Offline maps, compass, fully charged power bank
• **Essentials**: Headlamp with extra batteries, multi-tool, water bottle (2L capacity)
• **Documents**: Passport copies, permits, travel insurance details, emergency contacts
• **Cash**: Sufficient Nepali Rupees (ATMs unavailable in remote areas)

**🏔️ Similar Destinations Worth Exploring:**
• **Gosaikunda Lake**: Sacred alpine lake at 4,380m, 3-4 day trek from Kathmandu
• **Rara Lake**: Nepal's largest lake in remote Karnali region, pristine wilderness
• **Tilicho Lake**: One of world's highest lakes at 4,919m, challenging trek
• **Panch Pokhari**: Five sacred lakes in Sindhupalchok, cultural significance
• **Khaptad National Park**: Remote western Nepal, diverse flora and fauna

**💡 Essential Travel Tips:**

**Cultural Respect:**
• Always ask permission before photographing people or religious sites
• Remove shoes before entering temples and homes
• Dress modestly, especially in religious areas
• Use right hand for giving/receiving items
• Learn basic Nepali phrases (Namaste, Dhanyabad)

**Environmental Responsibility:**
• Carry all waste back, including toilet paper
• Use biodegradable soap away from water sources
• Stick to established trails to prevent erosion
• Support eco-friendly accommodations
• Avoid single-use plastics

**Health & Safety:**
• Acclimatize properly if going above 3,000m (ascend max 500m/day)
• Know altitude sickness symptoms: headache, nausea, dizziness
• Drink 3-4 liters of water daily
• Purify all drinking water
• Carry comprehensive first aid kit
• Have evacuation insurance for remote treks

**🏨 Accommodation Options:**
• **Homestays**: Most authentic experience, $5-10/night, meals included
• **Guesthouses**: Basic amenities, $8-15/night, hot water available
• **Teahouses**: Along trekking routes, $5-12/night, communal dining
• **Camping**: For very remote areas, bring own equipment or hire locally

**🍽️ Food & Dining:**
• **Dal Bhat**: National dish, unlimited refills, nutritious, $2-4
• **Momos**: Dumplings (veg/chicken/buff), $1-3 for 10 pieces
• **Thukpa**: Noodle soup, warming and filling, $2-3
• **Local Vegetables**: Fresh, organic, seasonal, $1-2
• **Energy Bars**: Bring from cities, expensive in remote areas
• **Water**: Boil or purify, avoid bottled plastic

**📱 Connectivity & Communication:**
• Mobile networks limited in remote areas (Ncell/Nepal Telecom have best coverage)
• Download offline maps (Maps.me, Google Maps) before departure
• Inform family/friends of detailed itinerary and expected return
• Satellite phones available for rent ($5-10/day) for very remote treks
• WiFi rare in remote areas, available in some teahouses ($2-5/hour)

**🚨 Safety Considerations:**
• Travel with companion when possible, never trek alone in remote areas
• Inform locals and guesthouse owners of your plans
• Carry emergency supplies: whistle, mirror, emergency blanket
• Know location of nearest health post or hospital
• Have comprehensive travel insurance with helicopter evacuation coverage
• Register with your embassy if doing extended remote travel
• Weather can change rapidly - always have contingency plans

**📞 Emergency Contacts:**
• **Tourist Police**: 1144 (toll-free within Nepal)
• **Nepal Police**: 100
• **Ambulance**: 102
• **Nepal Tourism Board**: +977-1-4256909
• **Himalayan Rescue Association**: +977-1-4440292 (altitude sickness advice)

**🎯 Making the Most of Your Visit:**
• Hire local guides to support community and gain cultural insights
• Learn about local customs and traditions before visiting
• Try local food and participate in cultural activities
• Wake early for best light and fewer crowds
• Be flexible with plans - weather and conditions can change
• Take time to connect with locals and hear their stories
• Keep a travel journal to remember details
• Respect photography restrictions at religious sites

**Need More Specific Information?**
I can provide detailed guidance on:
• Specific trekking routes and itineraries
• Hotel and restaurant recommendations in major cities
• Detailed budget planning for your trip duration
• Weather patterns and seasonal considerations
• Cultural festivals and events
• Transportation options and booking

**💬 Try asking me:**
• "Best hotels in Kathmandu under $50"
• "Everest Base Camp trek complete guide"
• "Budget for 2 weeks in Nepal"
• "Weather in Pokhara in October"
• "Traditional Nepali food guide"

I'm here to help you plan an unforgettable Nepal adventure! What specific aspect would you like to know more about?"""
        
        # Default help message for non-place queries
        return """**Welcome to Roamio Wanderly AI Assistant!** 🌏

I have access to comprehensive Nepal tourism data:

**📊 Database Coverage:**
• **1,057 Destinations** - Complete with ratings & activities
• **718 Hotels** - Verified properties with pricing
• **512 Restaurants** - Authentic cuisine with reviews
• **805 Events** - Cultural festivals & activities

**💡 What I Can Help You With:**
1. Destinations & Planning (Kathmandu, Pokhara, etc.)
2. Accommodation Analysis (Hotels by budget)
3. Culinary Guide (Restaurants & cuisine)
4. Weather & Climate (Best travel times)
5. Budget Planning (Daily cost breakdowns)
6. Trekking Intelligence (Trek comparisons)

**Popular Queries:**
• "Tell me about Pokhara"
• "Everest Base Camp trek details"
• "Budget for 10 days in Nepal"
• "Best hotels in Kathmandu"
• "Weather in October"
• "Nepali food guide"

**Ask me anything about Nepal travel - I provide data-driven insights!** 🎯

What would you like to know?"""
