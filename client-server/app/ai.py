# ------------------ AI REPLY FUNCTION ------------------

def get_ai_reply(message: str) -> str:
    """Get AI reply for chat message"""
    # Simple AI response logic
    message_lower = message.lower()
    
    if "hello" in message_lower or "hi" in message_lower:
        return "Hello! Welcome to Roamio Wanderly! How can I help you plan your Nepal adventure today?"
    
    elif "pokhara" in message_lower:
        return "Pokhara is a beautiful city known as the 'City of Lakes'. It offers stunning views of the Himalayas, beautiful lakes, and activities like paragliding and boating. Would you like to know more about specific attractions in Pokhara?"
    
    elif "kathmandu" in message_lower:
        return "Kathmandu is the capital city of Nepal, rich in culture and history. You can visit ancient temples, Durbar Square, and experience vibrant local markets. What specific information about Kathmandu would you like?"
    
    elif "everest" in message_lower:
        return "Mount Everest is the world's highest peak! The Everest Base Camp trek is one of the most popular adventures. Are you interested in trekking information or just curious about the mountain?"
    
    elif "hotel" in message_lower or "stay" in message_lower:
        return "I can help you find great accommodation options! What city or area in Nepal are you planning to visit? I can recommend hotels based on your budget and preferences."
    
    elif "food" in message_lower or "restaurant" in message_lower:
        return "Nepal has amazing cuisine! From traditional Dal Bhat to momos and Newari dishes. What type of food are you interested in, and which city?"
    
    elif "weather" in message_lower:
        return "Nepal's weather varies by region and season. Generally, spring (March-May) and autumn (September-November) are the best times to visit. What specific region are you planning to visit?"
    
    elif "price" in message_lower or "cost" in message_lower:
        return "Costs in Nepal vary greatly. Budget travelers can manage $20-30 per day, while mid-range travelers might spend $50-100 per day. What's your budget range and what type of experience are you looking for?"
    
    else:
        return "I'd be happy to help you plan your Nepal adventure! You can ask me about destinations, hotels, restaurants, weather, costs, or trekking. What specific information would you like?"
