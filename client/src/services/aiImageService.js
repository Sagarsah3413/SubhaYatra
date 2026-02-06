/**
 * AI Image Service - Generate images for places without existing images
 */

const API_BASE_URL = 'http://localhost:8000';

class AIImageService {
  constructor() {
    this.cache = new Map(); // Cache generated images
    this.generatingImages = new Set(); // Track images being generated
  }

  /**
   * Generate an AI image for a place using a free AI image generation service
   */
  async generateImageForPlace(place) {
    const cacheKey = `${place.name}_${place.type}`;
    
    console.log(`🎨 generateImageForPlace called for: ${place.name} (type: ${place.type})`);
    
    // Check if already cached
    if (this.cache.has(cacheKey)) {
      console.log(`✅ Using cached image for: ${place.name}`);
      return this.cache.get(cacheKey);
    }

    // Check if already generating
    if (this.generatingImages.has(cacheKey)) {
      console.log(`⏳ Already generating image for: ${place.name}`);
      return null; // Return null to show fallback while generating
    }

    try {
      this.generatingImages.add(cacheKey);
      console.log(`🚀 Starting image generation for: ${place.name}`);
      
      // Create a descriptive prompt for the place
      const prompt = this.createPromptForPlace(place);
      console.log(`📝 Generated prompt: ${prompt}`);
      
      // Generate image using Picsum (placeholder service) or other free services
      const imageUrl = await this.generateWithFallbackServices(prompt, place);
      console.log(`🖼️ Generated image URL: ${imageUrl}`);
      
      // Cache the result
      if (imageUrl) {
        this.cache.set(cacheKey, imageUrl);
        console.log(`💾 Cached image for: ${place.name}`);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('❌ Error generating AI image:', error);
      return null;
    } finally {
      this.generatingImages.delete(cacheKey);
    }
  }

  /**
   * Create a descriptive prompt based on place information - Nepal focused
   */
  createPromptForPlace(place) {
    const { name, type, location, description, tags } = place;
    
    // Base prompt with Nepal context
    let basePrompt = 'Nepal tourism destination';
    
    // Add specific Nepal context based on type
    switch (type?.toLowerCase()) {
      case 'cultural_religious_sites':
      case 'cultural_&_religious_sites':
        basePrompt = 'Nepal temple, Hindu Buddhist architecture, traditional Nepali culture, pagoda style, Kathmandu valley heritage';
        break;
      case 'natural_attractions':
        basePrompt = 'Nepal Himalayas, mountain landscape, Everest Annapurna region, pristine nature, Himalayan peaks, Nepal scenic beauty';
        break;
      case 'trekking_adventure':
      case 'trekking_&_adventure':
        basePrompt = 'Nepal trekking, Himalayan adventure, mountain trail, Everest base camp style, Nepal hiking, Sherpa culture';
        break;
      case 'village_rural_tourism':
        basePrompt = 'Nepal village, traditional Nepali culture, rural Nepal, terraced fields, Sherpa Gurung village, authentic Nepal';
        break;
      case 'urban_modern_attractions':
        basePrompt = 'Kathmandu Pokhara city, Nepal urban, Durbar Square, modern Nepal, Nepal city life';
        break;
      default:
        basePrompt = 'Nepal tourist destination, beautiful Nepal, Himalayan country, Nepal travel photography';
    }

    // Add specific location context
    if (location?.toLowerCase().includes('kathmandu')) {
      basePrompt += ', Kathmandu valley, Nepal capital';
    } else if (location?.toLowerCase().includes('pokhara')) {
      basePrompt += ', Pokhara lakeside, Annapurna view';
    } else if (location?.toLowerCase().includes('everest') || location?.toLowerCase().includes('solukhumbu')) {
      basePrompt += ', Everest region, Khumbu valley';
    } else if (location?.toLowerCase().includes('chitwan')) {
      basePrompt += ', Chitwan jungle, Nepal wildlife';
    }

    // Add specific details from name
    if (name?.toLowerCase().includes('temple') || name?.toLowerCase().includes('mandir')) {
      basePrompt += ', sacred Nepal temple, religious architecture';
    }
    if (name?.toLowerCase().includes('lake') || name?.toLowerCase().includes('tal')) {
      basePrompt += ', pristine Nepal lake, mountain reflection';
    }
    if (name?.toLowerCase().includes('mountain') || name?.toLowerCase().includes('peak') || name?.toLowerCase().includes('himal')) {
      basePrompt += ', Nepal mountain peak, snow-capped Himalayas';
    }
    if (name?.toLowerCase().includes('national park')) {
      basePrompt += ', Nepal national park, protected wilderness';
    }
    if (name?.toLowerCase().includes('village') || name?.toLowerCase().includes('gaun')) {
      basePrompt += ', traditional Nepal village, authentic culture';
    }

    return `${basePrompt}, high quality Nepal photography, vibrant colors, authentic Nepal, detailed Himalayan landscape`;
  }

  /**
   * Generate image using multiple fallback services - Nepal tourism focused
   */
  async generateWithFallbackServices(prompt, place) {
    console.log(`🔄 generateWithFallbackServices called for: ${place.name}`);
    
    // Service 1: Simple Unsplash (most reliable)
    try {
      console.log('📸 Trying simple Unsplash service...');
      const simpleUnsplash = await this.generateSimpleUnsplashImage(place);
      if (simpleUnsplash) {
        console.log(`✅ Simple Unsplash success: ${simpleUnsplash}`);
        return simpleUnsplash;
      }
    } catch (error) {
      console.warn('⚠️ Simple Unsplash service failed:', error);
    }

    // Service 2: Curated Nepal tourism images
    try {
      console.log('🇳🇵 Trying curated Nepal tourism images...');
      const curated = await this.generateWithCuratedNepalImages(place);
      if (curated) {
        console.log(`✅ Curated Nepal success: ${curated}`);
        return curated;
      }
    } catch (error) {
      console.warn('⚠️ Curated Nepal service failed:', error);
    }

    // Service 3: Unsplash with very specific Nepal tourism terms
    try {
      console.log('📸 Trying specific Nepal Unsplash service...');
      const unsplash = await this.generateWithSpecificNepalUnsplash(place);
      if (unsplash) {
        console.log(`✅ Specific Nepal Unsplash success: ${unsplash}`);
        return unsplash;
      }
    } catch (error) {
      console.warn('⚠️ Specific Nepal Unsplash service failed:', error);
    }

    // Service 4: Nepal-themed placeholder with tourism context
    try {
      console.log('🏔️ Trying Nepal tourism placeholder...');
      const placeholder = await this.generateWithNepalTourismPlaceholder(place);
      if (placeholder) {
        console.log(`✅ Nepal tourism placeholder success: ${placeholder}`);
        return placeholder;
      }
    } catch (error) {
      console.warn('⚠️ Nepal tourism placeholder failed:', error);
    }

    console.warn(`❌ All Nepal tourism services failed for: ${place.name}`);
    return null;
  }

  /**
   * Generate simple Unsplash image (most reliable)
   */
  async generateSimpleUnsplashImage(place) {
    console.log(`📸 Generating simple Unsplash image for: ${place.name}`);
    
    // Create unique identifier
    const placeId = this.createPlaceIdentifier(place);
    
    // Simple, reliable search terms
    let searchQuery = 'nepal';
    
    if (place.type?.includes('hotel') || place.type?.includes('accommodation')) {
      searchQuery = 'nepal+hotel';
    } else if (place.type?.includes('restaurant') || place.type?.includes('food')) {
      searchQuery = 'nepal+food';
    } else if (place.type?.includes('temple') || place.type?.includes('cultural')) {
      searchQuery = 'nepal+temple';
    } else if (place.type?.includes('natural') || place.type?.includes('nature')) {
      searchQuery = 'nepal+mountain';
    } else if (place.type?.includes('trekking') || place.type?.includes('adventure')) {
      searchQuery = 'nepal+trekking';
    } else if (place.type?.includes('village') || place.type?.includes('rural')) {
      searchQuery = 'nepal+village';
    }
    
    const url = `https://source.unsplash.com/800x600/?${searchQuery}&sig=${placeId}`;
    
    console.log(`📸 Simple Unsplash URL: ${url} (query: ${searchQuery})`);
    
    return url;
  }

  /**
   * Generate using contextual Nepal tourism images based on place description and type
   */
  async generateWithCuratedNepalImages(place) {
    console.log(`🇳🇵 Generating contextual Nepal image for: ${place.name}`);
    console.log(`📝 Description: ${place.description}`);
    console.log(`🏷️ Type: ${place.type}`);
    
    // Analyze place description and type to generate specific search terms
    const searchTerms = this.analyzeAndGenerateSearchTerms(place);
    console.log(`🔍 Generated search terms: ${searchTerms.join(', ')}`);
    
    // Generate unique image URL based on place identity
    const uniqueImageUrl = this.generateUniqueNepalImage(place, searchTerms);
    
    console.log(`🎯 Generated unique Nepal image: ${uniqueImageUrl}`);
    
    return uniqueImageUrl;
  }

  /**
   * Analyze place description and generate specific search terms
   */
  analyzeAndGenerateSearchTerms(place) {
    const { name, type, description, location, activities, tags } = place;
    const searchTerms = [];
    
    // Base Nepal context
    searchTerms.push('nepal');
    
    // Analyze type for specific categories
    if (type?.includes('hotel') || type?.includes('accommodation')) {
      searchTerms.push('hotel', 'accommodation', 'lodge');
      if (location?.toLowerCase().includes('kathmandu')) {
        searchTerms.push('kathmandu', 'hotel');
      } else if (location?.toLowerCase().includes('pokhara')) {
        searchTerms.push('pokhara', 'lakeside', 'hotel');
      } else if (location?.toLowerCase().includes('everest') || location?.toLowerCase().includes('solukhumbu')) {
        searchTerms.push('everest', 'mountain', 'lodge');
      } else {
        searchTerms.push('mountain', 'lodge', 'traditional');
      }
    } else if (type?.includes('restaurant') || type?.includes('food')) {
      searchTerms.push('restaurant', 'food', 'dining');
      if (description?.toLowerCase().includes('traditional') || description?.toLowerCase().includes('nepali')) {
        searchTerms.push('traditional', 'nepali', 'cuisine');
      } else if (description?.toLowerCase().includes('international')) {
        searchTerms.push('international', 'dining');
      } else {
        searchTerms.push('local', 'food', 'authentic');
      }
    } else if (type?.includes('temple') || type?.includes('cultural') || type?.includes('religious')) {
      searchTerms.push('temple', 'cultural', 'heritage');
      if (name?.toLowerCase().includes('buddha') || description?.toLowerCase().includes('buddhist')) {
        searchTerms.push('buddhist', 'stupa', 'monastery');
      } else if (name?.toLowerCase().includes('hindu') || description?.toLowerCase().includes('hindu')) {
        searchTerms.push('hindu', 'temple', 'pagoda');
      } else {
        searchTerms.push('traditional', 'architecture', 'sacred');
      }
    } else if (type?.includes('natural') || type?.includes('nature')) {
      if (name?.toLowerCase().includes('lake') || description?.toLowerCase().includes('lake')) {
        searchTerms.push('lake', 'reflection', 'pristine');
      } else if (name?.toLowerCase().includes('mountain') || description?.toLowerCase().includes('mountain')) {
        searchTerms.push('mountain', 'himalayan', 'peaks');
      } else if (name?.toLowerCase().includes('forest') || description?.toLowerCase().includes('forest')) {
        searchTerms.push('forest', 'wilderness', 'nature');
      } else if (name?.toLowerCase().includes('waterfall') || description?.toLowerCase().includes('waterfall')) {
        searchTerms.push('waterfall', 'cascade', 'natural');
      } else {
        searchTerms.push('landscape', 'scenic', 'natural');
      }
    } else if (type?.includes('trekking') || type?.includes('adventure')) {
      searchTerms.push('trekking', 'hiking', 'adventure');
      if (description?.toLowerCase().includes('everest') || location?.toLowerCase().includes('everest')) {
        searchTerms.push('everest', 'basecamp', 'sherpa');
      } else if (description?.toLowerCase().includes('annapurna') || location?.toLowerCase().includes('annapurna')) {
        searchTerms.push('annapurna', 'circuit', 'mountain');
      } else {
        searchTerms.push('trail', 'mountain', 'hiking');
      }
    } else if (type?.includes('village') || type?.includes('rural')) {
      searchTerms.push('village', 'rural', 'traditional');
      if (description?.toLowerCase().includes('sherpa') || location?.toLowerCase().includes('everest')) {
        searchTerms.push('sherpa', 'culture', 'mountain');
      } else if (description?.toLowerCase().includes('gurung') || description?.toLowerCase().includes('magar')) {
        searchTerms.push('ethnic', 'culture', 'traditional');
      } else {
        searchTerms.push('rural', 'authentic', 'lifestyle');
      }
    } else {
      // Default tourism
      searchTerms.push('tourism', 'destination', 'travel');
    }
    
    // Add location-specific terms
    if (location?.toLowerCase().includes('kathmandu')) {
      searchTerms.push('kathmandu', 'valley', 'capital');
    } else if (location?.toLowerCase().includes('pokhara')) {
      searchTerms.push('pokhara', 'lakeside', 'annapurna');
    } else if (location?.toLowerCase().includes('chitwan')) {
      searchTerms.push('chitwan', 'jungle', 'wildlife');
    } else if (location?.toLowerCase().includes('lumbini')) {
      searchTerms.push('lumbini', 'birthplace', 'buddha');
    }
    
    // Add activity-specific terms
    if (activities) {
      const activityLower = activities.toLowerCase();
      if (activityLower.includes('viewpoint')) {
        searchTerms.push('viewpoint', 'panoramic', 'vista');
      }
      if (activityLower.includes('hiking')) {
        searchTerms.push('hiking', 'trail', 'outdoor');
      }
      if (activityLower.includes('photography')) {
        searchTerms.push('scenic', 'photogenic', 'beautiful');
      }
    }
    
    // Add description-specific terms
    if (description) {
      const descLower = description.toLowerCase();
      if (descLower.includes('strawberry') || descLower.includes('farm')) {
        searchTerms.push('farm', 'agriculture', 'rural');
      }
      if (descLower.includes('trout') || descLower.includes('fish')) {
        searchTerms.push('fishing', 'trout', 'fresh');
      }
      if (descLower.includes('panoramic') || descLower.includes('view')) {
        searchTerms.push('panoramic', 'view', 'scenic');
      }
      if (descLower.includes('ancient') || descLower.includes('historical')) {
        searchTerms.push('ancient', 'historical', 'heritage');
      }
    }
    
    return [...new Set(searchTerms)]; // Remove duplicates
  }

  /**
   * Generate unique Nepal image URL based on place identity
   */
  generateUniqueNepalImage(place, searchTerms) {
    // Create a unique identifier for this place
    const placeId = this.createPlaceIdentifier(place);
    
    // Determine the best image service based on place type
    if (place.type?.includes('hotel') || place.type?.includes('accommodation')) {
      return this.generateHotelImage(place, searchTerms, placeId);
    } else if (place.type?.includes('restaurant') || place.type?.includes('food')) {
      return this.generateRestaurantImage(place, searchTerms, placeId);
    } else {
      return this.generateTourismImage(place, searchTerms, placeId);
    }
  }

  /**
   * Generate hotel-specific image
   */
  generateHotelImage(place, searchTerms, placeId) {
    const hotelTerms = searchTerms.filter(term => 
      ['hotel', 'accommodation', 'lodge', 'resort', 'guesthouse', 'traditional', 'luxury', 'mountain', 'lakeside'].includes(term)
    ).join('+');
    
    const searchQuery = hotelTerms || 'nepal+hotel+accommodation';
    return `https://source.unsplash.com/800x600/?${searchQuery}&sig=${placeId}`;
  }

  /**
   * Generate restaurant-specific image
   */
  generateRestaurantImage(place, searchTerms, placeId) {
    const foodTerms = searchTerms.filter(term => 
      ['restaurant', 'food', 'dining', 'cuisine', 'traditional', 'nepali', 'local', 'authentic', 'international'].includes(term)
    ).join('+');
    
    const searchQuery = foodTerms || 'nepal+restaurant+food';
    return `https://source.unsplash.com/800x600/?${searchQuery}&sig=${placeId}`;
  }

  /**
   * Generate tourism destination image
   */
  generateTourismImage(place, searchTerms, placeId) {
    // Select the most relevant terms for tourism
    const tourismTerms = searchTerms.slice(0, 4).join('+'); // Use top 4 most relevant terms
    
    const searchQuery = tourismTerms || 'nepal+tourism+destination';
    return `https://source.unsplash.com/800x600/?${searchQuery}&sig=${placeId}`;
  }

  /**
   * Create unique identifier for place to ensure consistent but unique images
   */
  createPlaceIdentifier(place) {
    // Combine name, type, and location to create unique identifier
    const identifier = `${place.name}_${place.type}_${place.location}`.toLowerCase();
    
    // Generate hash
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36); // Convert to base36 for shorter string
  }

  /**
   * Generate using Unsplash with contextual Nepal tourism terms
   */
  async generateWithSpecificNepalUnsplash(place) {
    console.log(`📸 Generating contextual Unsplash image for: ${place.name}`);
    
    // Use the same analysis as curated images
    const searchTerms = this.analyzeAndGenerateSearchTerms(place);
    const placeId = this.createPlaceIdentifier(place);
    
    // Create specific search query based on place type and description
    let searchQuery = '';
    
    if (place.type?.includes('hotel') || place.type?.includes('accommodation')) {
      const hotelTerms = searchTerms.filter(term => 
        ['nepal', 'hotel', 'accommodation', 'lodge', 'resort', 'mountain', 'lakeside', 'traditional'].includes(term)
      );
      searchQuery = hotelTerms.slice(0, 3).join('+') || 'nepal+hotel+accommodation';
    } else if (place.type?.includes('restaurant') || place.type?.includes('food')) {
      const foodTerms = searchTerms.filter(term => 
        ['nepal', 'restaurant', 'food', 'dining', 'cuisine', 'traditional', 'nepali'].includes(term)
      );
      searchQuery = foodTerms.slice(0, 3).join('+') || 'nepal+restaurant+food';
    } else if (place.type?.includes('temple') || place.type?.includes('cultural')) {
      const templeTerms = searchTerms.filter(term => 
        ['nepal', 'temple', 'cultural', 'heritage', 'buddhist', 'hindu', 'pagoda', 'stupa'].includes(term)
      );
      searchQuery = templeTerms.slice(0, 3).join('+') || 'nepal+temple+heritage';
    } else if (place.type?.includes('natural') || place.type?.includes('nature')) {
      const natureTerms = searchTerms.filter(term => 
        ['nepal', 'mountain', 'lake', 'forest', 'waterfall', 'himalayan', 'landscape', 'scenic'].includes(term)
      );
      searchQuery = natureTerms.slice(0, 3).join('+') || 'nepal+mountain+landscape';
    } else if (place.type?.includes('trekking') || place.type?.includes('adventure')) {
      const trekkingTerms = searchTerms.filter(term => 
        ['nepal', 'trekking', 'hiking', 'adventure', 'everest', 'annapurna', 'trail'].includes(term)
      );
      searchQuery = trekkingTerms.slice(0, 3).join('+') || 'nepal+trekking+mountain';
    } else if (place.type?.includes('village') || place.type?.includes('rural')) {
      const villageTerms = searchTerms.filter(term => 
        ['nepal', 'village', 'rural', 'traditional', 'sherpa', 'culture', 'authentic'].includes(term)
      );
      searchQuery = villageTerms.slice(0, 3).join('+') || 'nepal+village+traditional';
    } else {
      // General tourism with most relevant terms
      const generalTerms = searchTerms.filter(term => 
        ['nepal', 'tourism', 'destination', 'travel', 'scenic', 'beautiful'].includes(term)
      );
      searchQuery = generalTerms.slice(0, 3).join('+') || 'nepal+tourism+destination';
    }
    
    const url = `https://source.unsplash.com/800x600/?${searchQuery}&sig=${placeId}`;
    
    console.log(`📸 Contextual Unsplash URL: ${url} (query: ${searchQuery})`);
    
    return url;
  }



  /**
   * Generate Nepal tourism-themed placeholder with contextual imagery
   */
  async generateWithNepalTourismPlaceholder(place) {
    console.log(`🏔️ Generating contextual placeholder for: ${place.name}`);
    
    const width = 800;
    const height = 600;
    const placeId = this.createPlaceIdentifier(place);
    
    // Determine colors and emoji based on place type and description
    let bgColor = '1E40AF'; // Nepal flag blue (default)
    let textColor = 'FFFFFF';
    let emoji = '🇳🇵';
    let typeText = 'Nepal Tourism';
    
    if (place.type?.includes('hotel') || place.type?.includes('accommodation')) {
      bgColor = '7C3AED'; // Purple for hotels
      emoji = '🏨';
      typeText = 'Nepal Hotel';
      if (place.description?.toLowerCase().includes('luxury')) {
        bgColor = 'B45309'; // Gold for luxury
        emoji = '✨';
        typeText = 'Luxury Nepal';
      } else if (place.description?.toLowerCase().includes('mountain') || place.location?.toLowerCase().includes('everest')) {
        bgColor = '059669'; // Mountain green
        emoji = '🏔️';
        typeText = 'Mountain Lodge';
      }
    } else if (place.type?.includes('restaurant') || place.type?.includes('food')) {
      bgColor = 'EA580C'; // Orange for restaurants
      emoji = '🍽️';
      typeText = 'Nepal Dining';
      if (place.description?.toLowerCase().includes('traditional') || place.description?.toLowerCase().includes('nepali')) {
        bgColor = 'DC2626'; // Nepal flag red
        emoji = '🥘';
        typeText = 'Nepali Cuisine';
      } else if (place.description?.toLowerCase().includes('international')) {
        bgColor = '7C2D12'; // Brown for international
        emoji = '🌍';
        typeText = 'International';
      }
    } else if (place.type?.includes('temple') || place.type?.includes('cultural') || place.type?.includes('religious')) {
      bgColor = 'DC2626'; // Nepal flag red for temples
      emoji = '🏛️';
      typeText = 'Nepal Temple';
      if (place.name?.toLowerCase().includes('buddha') || place.description?.toLowerCase().includes('buddhist')) {
        bgColor = 'F59E0B'; // Saffron for Buddhist
        emoji = '☸️';
        typeText = 'Buddhist Site';
      } else if (place.name?.toLowerCase().includes('hindu') || place.description?.toLowerCase().includes('hindu')) {
        bgColor = 'DC2626'; // Red for Hindu
        emoji = '🕉️';
        typeText = 'Hindu Temple';
      }
    } else if (place.type?.includes('natural') || place.type?.includes('nature')) {
      bgColor = '059669'; // Mountain green
      emoji = '🏞️';
      typeText = 'Nepal Nature';
      if (place.name?.toLowerCase().includes('lake') || place.description?.toLowerCase().includes('lake')) {
        bgColor = '0EA5E9'; // Lake blue
        emoji = '🏞️';
        typeText = 'Nepal Lake';
      } else if (place.name?.toLowerCase().includes('mountain') || place.description?.toLowerCase().includes('mountain')) {
        bgColor = '6B7280'; // Mountain gray
        emoji = '🏔️';
        typeText = 'Nepal Mountains';
      } else if (place.name?.toLowerCase().includes('waterfall') || place.description?.toLowerCase().includes('waterfall')) {
        bgColor = '06B6D4'; // Waterfall cyan
        emoji = '💧';
        typeText = 'Nepal Waterfall';
      }
    } else if (place.type?.includes('trekking') || place.type?.includes('adventure')) {
      bgColor = '7C2D12'; // Earth brown for trekking
      emoji = '🥾';
      typeText = 'Nepal Trekking';
      if (place.description?.toLowerCase().includes('everest') || place.location?.toLowerCase().includes('everest')) {
        bgColor = '1F2937'; // Dark for Everest
        emoji = '🏔️';
        typeText = 'Everest Trek';
      } else if (place.description?.toLowerCase().includes('annapurna') || place.location?.toLowerCase().includes('annapurna')) {
        bgColor = '059669'; // Green for Annapurna
        emoji = '⛰️';
        typeText = 'Annapurna Trek';
      }
    } else if (place.type?.includes('village') || place.type?.includes('rural')) {
      bgColor = 'B45309'; // Traditional orange
      emoji = '🏘️';
      typeText = 'Nepal Village';
      if (place.description?.toLowerCase().includes('sherpa') || place.location?.toLowerCase().includes('everest')) {
        bgColor = '374151'; // Dark for Sherpa
        emoji = '🏔️';
        typeText = 'Sherpa Village';
      } else if (place.description?.toLowerCase().includes('traditional')) {
        bgColor = 'DC2626'; // Traditional red
        emoji = '🏠';
        typeText = 'Traditional Village';
      }
    } else if (place.name?.toLowerCase().includes('national park')) {
      bgColor = '16A34A'; // Forest green
      emoji = '🌲';
      typeText = 'Nepal Park';
    }
    
    // Create contextual text based on place name and type
    const placeName = place.name || 'Nepal Destination';
    const displayText = `${emoji} ${placeName}`;
    
    // Add unique identifier to ensure different images for different places
    const encodedText = encodeURIComponent(displayText);
    
    // Create a more sophisticated placeholder URL with better styling
    const url = `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}&font=Arial&sig=${placeId}`;
    
    console.log(`🏔️ Contextual placeholder URL: ${url} (${typeText})`);
    
    return url;
  }

  /**
   * Generate a consistent seed from a string
   */
  generateSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  /**
   * Check if a place needs an AI-generated image
   */
  needsAIImage(place) {
    if (!place) {
      console.log('needsAIImage: No place provided');
      return false;
    }

    // Check if place has no images or all images are broken
    const hasValidImages = place.all_images && 
                          Array.isArray(place.all_images) && 
                          place.all_images.length > 0 &&
                          place.all_images.some(img => img && img.trim() !== '' && img !== 'null');
    
    const hasValidImageUrl = place.image_url && 
                            place.image_url.trim() !== '' && 
                            place.image_url !== 'null' &&
                            place.image_url !== null;
    
    const needsAI = !hasValidImages && !hasValidImageUrl;
    
    console.log(`🔍 needsAIImage for "${place.name}":`, {
      hasValidImages,
      hasValidImageUrl,
      needsAI,
      all_images: place.all_images,
      image_url: place.image_url,
      type: place.type
    });
    
    return needsAI;
  }

  /**
   * Get or generate image for a place
   */
  async getImageForPlace(place) {
    if (!this.needsAIImage(place)) {
      return null; // Place already has images
    }

    return await this.generateImageForPlace(place);
  }

  /**
   * Preload AI images for multiple places
   */
  async preloadImagesForPlaces(places) {
    const placesNeedingImages = places.filter(place => this.needsAIImage(place));
    
    // Generate images in batches to avoid overwhelming the services
    const batchSize = 3;
    const results = [];
    
    for (let i = 0; i < placesNeedingImages.length; i += batchSize) {
      const batch = placesNeedingImages.slice(i, i + batchSize);
      const batchPromises = batch.map(place => this.generateImageForPlace(place));
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches
        if (i + batchSize < placesNeedingImages.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Error in batch image generation:', error);
      }
    }
    
    return results;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      generatingCount: this.generatingImages.size,
      cachedImages: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export default new AIImageService();