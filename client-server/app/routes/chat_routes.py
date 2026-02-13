from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Chat, Message, SearchHistory
from ..ai import get_ai_reply
from datetime import datetime
import re


chat_bp = Blueprint("chat", __name__)

# ----------- CREATE NEW CHAT -----------
@chat_bp.route("/new", methods=["POST"])
def create_chat():
    data = request.json
    user_id = data.get("user_id")
    title = data.get("title", "New Chat")

    new_chat = Chat(user_id=user_id, title=title)
    db.session.add(new_chat)
    db.session.commit()

    return jsonify({
        "chat_id": new_chat.id,
        "title": new_chat.title,
        "created_at": new_chat.created_at.isoformat()
    })


# ----------- SAVE USER OR BOT MESSAGE -----------
@chat_bp.route("/message", methods=["POST"])
def save_message():
    data = request.json
    msg = Message(
        chat_id=data["chat_id"],
        sender=data["sender"],
        content=data["content"]
    )

    db.session.add(msg)
    db.session.commit()
    return jsonify({"status": "saved", "message_id": msg.id})


# ----------- GET ALL MESSAGES FROM CHAT -----------
@chat_bp.route("/messages", methods=["GET"])
def get_messages():
    chat_id = request.args.get("chat_id")
    msgs = db.session.query(Message).filter_by(chat_id=chat_id).order_by(Message.created_at.asc()).all()

    return jsonify([
        {
            "id": m.id,
            "sender": m.sender,
            "content": m.content,
            "timestamp": m.created_at.isoformat()
        }
        for m in msgs
    ])


# ----------- GET CHAT HISTORY FOR USER -----------
@chat_bp.route("/history", methods=["GET"])
def chat_history():
    user_id = request.args.get("user_id")
    limit = request.args.get("limit", 20, type=int)
    
    chats = db.session.query(Chat).filter_by(user_id=user_id, is_active=True)\
                     .order_by(Chat.updated_at.desc())\
                     .limit(limit).all()

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "created_at": c.created_at.isoformat(),
            "updated_at": c.updated_at.isoformat(),
            "message_count": db.session.query(Message).filter_by(chat_id=c.id).count()
        }
        for c in chats
    ])


# ----------- SEARCH CHATS -----------
@chat_bp.route("/search", methods=["GET"])
def search_chats():
    user_id = request.args.get("user_id")
    query = request.args.get("query")

    if not query:
        return jsonify([])

    # Search in chat titles and message content
    chat_results = db.session.query(Chat).filter(
        Chat.user_id == user_id,
        Chat.is_active == True,
        Chat.title.ilike(f"%{query}%")
    ).all()

    message_results = db.session.query(Chat).join(Message).filter(
        Chat.user_id == user_id,
        Chat.is_active == True,
        Message.content.ilike(f"%{query}%")
    ).distinct().all()

    # Combine and deduplicate results
    all_chats = {chat.id: chat for chat in chat_results + message_results}

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "created_at": c.created_at.isoformat(),
            "updated_at": c.updated_at.isoformat()
        }
        for c in all_chats.values()
    ])


# ----------- GET SEARCH HISTORY -----------
@chat_bp.route("/search-history", methods=["GET"])
def get_search_history():
    user_id = request.args.get("user_id")
    limit = request.args.get("limit", 50, type=int)
    query_type = request.args.get("type")  # Optional filter by type
    
    query = db.session.query(SearchHistory).filter_by(user_id=user_id)
    
    if query_type:
        query = query.filter_by(query_type=query_type)
    
    searches = query.order_by(SearchHistory.created_at.desc()).limit(limit).all()

    return jsonify([
        {
            "id": s.id,
            "query": s.query,
            "query_type": s.query_type,
            "response_summary": s.response_summary,
            "created_at": s.created_at.isoformat(),
            "is_favorite": s.is_favorite,
            "chat_id": s.chat_id
        }
        for s in searches
    ])


# ----------- SAVE SEARCH TO HISTORY -----------
@chat_bp.route("/search-history", methods=["POST"])
def save_search_history():
    data = request.json
    user_id = data.get("user_id")
    query = data.get("query")
    chat_id = data.get("chat_id")
    response_summary = data.get("response_summary", "")
    
    # Determine query type based on content
    query_type = determine_query_type(query)
    
    # Check if similar search exists recently (avoid duplicates)
    recent_search = db.session.query(SearchHistory).filter_by(
        user_id=user_id,
        query=query
    ).filter(
        SearchHistory.created_at >= datetime.utcnow().replace(hour=0, minute=0, second=0)
    ).first()
    
    if not recent_search:
        search_entry = SearchHistory(
            user_id=user_id,
            chat_id=chat_id,
            query=query,
            query_type=query_type,
            response_summary=response_summary[:500] if response_summary else ""  # Limit summary length
        )
        
        db.session.add(search_entry)
        db.session.commit()
        
        return jsonify({
            "status": "saved",
            "search_id": search_entry.id,
            "query_type": query_type
        })
    
    return jsonify({"status": "duplicate_skipped"})


# ----------- TOGGLE FAVORITE SEARCH -----------
@chat_bp.route("/search-history/<int:search_id>/favorite", methods=["POST"])
def toggle_favorite_search(search_id):
    search_entry = db.session.query(SearchHistory).get_or_404(search_id)
    search_entry.is_favorite = not search_entry.is_favorite
    db.session.commit()
    
    return jsonify({
        "status": "updated",
        "is_favorite": search_entry.is_favorite
    })


# ----------- DELETE SEARCH HISTORY ENTRY -----------
@chat_bp.route("/search-history/<int:search_id>", methods=["DELETE"])
def delete_search_history(search_id):
    search_entry = db.session.query(SearchHistory).get_or_404(search_id)
    db.session.delete(search_entry)
    db.session.commit()
    
    return jsonify({"status": "deleted"})


# ----------- CLEAR ALL SEARCH HISTORY -----------
@chat_bp.route("/search-history/clear", methods=["DELETE"])
def clear_search_history():
    user_id = request.args.get("user_id")
    
    db.session.query(SearchHistory).filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({"status": "cleared"})


# ----------- UPDATE CHAT TITLE -----------
@chat_bp.route("/chat/<int:chat_id>/title", methods=["PUT"])
def update_chat_title(chat_id):
    data = request.json
    title = data.get("title")
    
    chat = db.session.query(Chat).get_or_404(chat_id)
    chat.title = title
    chat.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({"status": "updated", "title": title})


# ----------- DELETE CHAT -----------
@chat_bp.route("/chat/<int:chat_id>", methods=["DELETE"])
def delete_chat(chat_id):
    chat = db.session.query(Chat).get_or_404(chat_id)
    chat.is_active = False  # Soft delete
    db.session.commit()
    
    return jsonify({"status": "deleted"})


# ----------- AI REPLY WITH HISTORY TRACKING -----------
@chat_bp.route("/ai-reply", methods=["POST"])
def ai_reply():
    data = request.json
    chat_id = data.get("chat_id")
    message = data.get("message")
    user_id = data.get("user_id")

    if not chat_id or not message:
        return jsonify({"error": "chat_id and message are required"}), 400

    ai_text = get_ai_reply(message)
    
    # Save to search history if user_id provided
    if user_id:
        try:
            query_type = determine_query_type(message)
            response_summary = ai_text[:200] + "..." if len(ai_text) > 200 else ai_text
            
            search_entry = SearchHistory(
                user_id=user_id,
                chat_id=chat_id,
                query=message,
                query_type=query_type,
                response_summary=response_summary
            )
            
            db.session.add(search_entry)
            db.session.commit()
        except Exception as e:
            print(f"Error saving search history: {e}")

    return jsonify({
        "chat_id": chat_id,
        "reply": ai_text,
        "query_type": determine_query_type(message)
    })


# ----------- SEND AND GET BOT REPLY WITH HISTORY -----------
@chat_bp.route("/send", methods=["POST"])
def send_message():
    data = request.json
    chat_id = data["chat_id"]
    user_msg = data["message"]
    user_id = data.get("user_id")

    # Save user message
    user_message = Message(chat_id=chat_id, sender="user", content=user_msg)
    db.session.add(user_message)
    
    # Get AI reply
    bot_reply = get_ai_reply(user_msg)

    # Save bot reply
    bot_message = Message(chat_id=chat_id, sender="bot", content=bot_reply)
    db.session.add(bot_message)
    
    # Update chat timestamp
    chat = db.session.query(Chat).get(chat_id)
    if chat:
        chat.updated_at = datetime.utcnow()
        # Auto-generate title from first user message if still "New Chat"
        if chat.title == "New Chat" and len(user_msg) > 0:
            chat.title = generate_chat_title(user_msg)
    
    # Save to search history
    if user_id:
        try:
            query_type = determine_query_type(user_msg)
            response_summary = bot_reply[:200] + "..." if len(bot_reply) > 200 else bot_reply
            
            search_entry = SearchHistory(
                user_id=user_id,
                chat_id=chat_id,
                query=user_msg,
                query_type=query_type,
                response_summary=response_summary
            )
            
            db.session.add(search_entry)
        except Exception as e:
            print(f"Error saving search history: {e}")
    
    db.session.commit()

    return jsonify({
        "reply": bot_reply,
        "message_id": bot_message.id,
        "query_type": determine_query_type(user_msg)
    })


# ----------- SAVE LOCAL AI MESSAGES -----------
@chat_bp.route("/save-local", methods=["POST"])
def save_local_messages():
    """Save messages generated by local AI (Cohere) to the database"""
    data = request.json
    chat_id = data.get("chat_id")
    user_id = data.get("user_id")
    user_message = data.get("user_message")
    bot_response = data.get("bot_response")

    if not all([chat_id, user_id, user_message, bot_response]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Save user message
        user_msg = Message(chat_id=chat_id, sender="user", content=user_message)
        db.session.add(user_msg)
        
        # Save bot response
        bot_msg = Message(chat_id=chat_id, sender="bot", content=bot_response)
        db.session.add(bot_msg)
        
        # Update chat timestamp
        chat = db.session.query(Chat).get(chat_id)
        if chat:
            chat.updated_at = datetime.utcnow()
            # Auto-generate title from first user message if still "New Chat"
            if chat.title == "New Chat" and len(user_message) > 0:
                chat.title = generate_chat_title(user_message)
        
        db.session.commit()

        return jsonify({
            "status": "saved",
            "user_message_id": user_msg.id,
            "bot_message_id": bot_msg.id
        })
    except Exception as e:
        db.session.rollback()
        print(f"Error saving local AI messages: {e}")
        return jsonify({"error": str(e)}), 500


# ----------- HELPER FUNCTIONS -----------

def determine_query_type(query):
    """Determine the type of query based on keywords"""
    query_lower = query.lower()
    
    if any(word in query_lower for word in ['hotel', 'stay', 'accommodation', 'lodge', 'guesthouse']):
        return 'hotel'
    elif any(word in query_lower for word in ['restaurant', 'food', 'eat', 'cuisine', 'meal', 'dining']):
        return 'restaurant'
    elif any(word in query_lower for word in ['trek', 'hiking', 'mountain', 'everest', 'annapurna', 'adventure']):
        return 'trekking'
    elif any(word in query_lower for word in ['temple', 'culture', 'heritage', 'durbar', 'monastery', 'stupa']):
        return 'culture'
    elif any(word in query_lower for word in ['weather', 'climate', 'season', 'temperature']):
        return 'weather'
    elif any(word in query_lower for word in ['price', 'cost', 'budget', 'money', 'expensive']):
        return 'budget'
    elif any(word in query_lower for word in ['kathmandu', 'pokhara', 'chitwan', 'lumbini', 'place', 'destination']):
        return 'destination'
    else:
        return 'general'


def generate_chat_title(first_message):
    """Generate a chat title from the first message"""
    # Clean and truncate the message
    title = re.sub(r'[^\w\s]', '', first_message)
    title = ' '.join(title.split()[:4])  # Take first 4 words
    
    if len(title) > 30:
        title = title[:27] + "..."
    
    return title if title else "New Chat"
