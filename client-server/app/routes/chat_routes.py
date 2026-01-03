from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Chat, Message
from ..ai import get_ai_reply


chat_bp = Blueprint("chat", __name__)

# ----------- CREATE NEW CHAT -----------
@chat_bp.route("/new", methods=["POST"])
def create_chat():
    data = request.json
    user_id = data.get("user_id")

    new_chat = Chat(user_id=user_id)
    db.session.add(new_chat)
    db.session.commit()

    return jsonify({"chat_id": new_chat.id})


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
    return jsonify({"status": "saved"})


# ----------- GET ALL MESSAGES FROM CHAT -----------
@chat_bp.route("/messages", methods=["GET"])
def get_messages():
    chat_id = request.args.get("chat_id")
    msgs = Message.query.filter_by(chat_id=chat_id).all()

    return jsonify([
        {"type": m.sender, "text": m.content}
        for m in msgs
    ])


# ----------- GET CHAT HISTORY FOR USER -----------
@chat_bp.route("/history", methods=["GET"])
def chat_history():
    user_id = request.args.get("user_id")
    chats = Chat.query.filter_by(user_id=user_id).all()

    return jsonify([
        {"id": c.id, "title": c.title}
        for c in chats
    ])


# ----------- SEARCH CHATS -----------
@chat_bp.route("/search", methods=["GET"])
def search_chats():
    user_id = request.args.get("user_id")
    query = request.args.get("query")

    results = Chat.query.filter(
        Chat.user_id == user_id,
        Chat.title.ilike(f"%{query}%")
    ).all()

    return jsonify([
        {"id": c.id, "title": c.title}
        for c in results
    ])

@chat_bp.route("/ai-reply", methods=["POST"])
def ai_reply():
    from app.ai import get_ai_reply

    data = request.json
    chat_id = data.get("chat_id")
    message = data.get("message")

    if not chat_id or not message:
        return jsonify({"error": "chat_id and message are required"}), 400

    ai_text = get_ai_reply(message)

    return jsonify({
        "chat_id": chat_id,
        "reply": ai_text
    })



# ----------- SEND AND GET BOT REPLY -----------
@chat_bp.route("/send", methods=["POST"])
def send_message():
    data = request.json
    chat_id = data["chat_id"]
    user_msg = data["message"]

    # save user message
    msg = Message(chat_id=chat_id, sender="user", content=user_msg)
    db.session.add(msg)
    db.session.commit()

    # ai reply
    bot_reply = get_ai_reply(user_msg)

    # save bot reply
    bot_msg = Message(chat_id=chat_id, sender="bot", content=bot_reply)
    db.session.add(bot_msg)
    db.session.commit()

    return jsonify({"reply": bot_reply})
