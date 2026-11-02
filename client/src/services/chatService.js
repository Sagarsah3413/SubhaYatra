// Chat Service - API interactions for chat functionality
import { API_URL } from '../config/api';

const API_BASE_URL = `${API_URL}/api/chat`;

class ChatService {
  
  // ==================== CHAT MANAGEMENT ====================
  
  /**
   * Create a new chat session
   */
  async createChat(userId, title = 'New Chat') {
    try {
      const response = await fetch(`${API_BASE_URL}/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          title: title
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create chat: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }
  
  /**
   * Get chat history for a user
   */
  async getChatHistory(userId, limit = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/history?user_id=${userId}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get chat history: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  }
  
  /**
   * Get messages from a specific chat
   */
  async getChatMessages(chatId) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages?chat_id=${chatId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }
  
  /**
   * Send a message to the backend Cohere proxy and get the AI reply.
   * The Cohere API key lives only on the backend.
   *
   * @returns {Promise<{ reply?: string, fallback?: boolean }>}
   *   On success: { reply }. If the backend signals the AI is unavailable
   *   (not configured / upstream error), resolves to { fallback: true } so the
   *   caller can use its local responder instead of throwing.
   */
  async sendCohereMessage(message, currency = 'USD') {
    try {
      const response = await fetch(`${API_BASE_URL}/cohere`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, currency })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Backend asks us to fall back (unconfigured key, upstream failure).
        if (data && data.fallback) {
          return { fallback: true };
        }
        throw new Error(data?.error || `Cohere proxy failed: ${response.statusText}`);
      }

      return data; // { reply }
    } catch (error) {
      console.error('Error calling Cohere proxy:', error);
      // Network-level failure: signal fallback rather than breaking the chat.
      return { fallback: true };
    }
  }

  /**
   * Send a message and get AI reply
   */
  async sendMessage(chatId, message, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          message: message,
          user_id: userId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
  /**
   * Update chat title
   */
  async updateChatTitle(chatId, title) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${chatId}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update chat title: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating chat title:', error);
      throw error;
    }
  }
  
  /**
   * Delete a chat
   */
  async deleteChat(chatId) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete chat: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
  
  // ==================== SEARCH FUNCTIONALITY ====================
  
  /**
   * Search chats by content
   */
  async searchChats(userId, query) {
    try {
      const response = await fetch(`${API_BASE_URL}/search?user_id=${userId}&query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to search chats: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching chats:', error);
      throw error;
    }
  }
  
  // ==================== SEARCH HISTORY ====================
  
  /**
   * Get search history for a user
   */
  async getSearchHistory(userId, limit = 50, type = null) {
    try {
      let url = `${API_BASE_URL}/search-history?user_id=${userId}&limit=${limit}`;
      if (type) {
        url += `&type=${type}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to get search history: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting search history:', error);
      throw error;
    }
  }
  
  /**
   * Save search to history (usually called automatically)
   */
  async saveSearchHistory(userId, query, chatId, responseSummary) {
    try {
      const response = await fetch(`${API_BASE_URL}/search-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          query: query,
          chat_id: chatId,
          response_summary: responseSummary
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save search history: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving search history:', error);
      throw error;
    }
  }
  
  /**
   * Toggle favorite status of a search
   */
  async toggleFavoriteSearch(searchId) {
    try {
      const response = await fetch(`${API_BASE_URL}/search-history/${searchId}/favorite`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle favorite: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
  
  /**
   * Delete a search history entry
   */
  async deleteSearchHistory(searchId) {
    try {
      const response = await fetch(`${API_BASE_URL}/search-history/${searchId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete search history: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting search history:', error);
      throw error;
    }
  }
  
  /**
   * Clear all search history for a user
   */
  async clearSearchHistory(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/search-history/clear?user_id=${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear search history: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error clearing search history:', error);
      throw error;
    }
  }
  
  // ==================== UTILITY METHODS ====================
  
  /**
   * Get query type icon based on type
   */
  getQueryTypeIcon(type) {
    const icons = {
      'hotel': '🏨',
      'restaurant': '🍜',
      'trekking': '🏔️',
      'culture': '🏛️',
      'weather': '🌤️',
      'budget': '💰',
      'destination': '📍',
      'general': '💬'
    };
    
    return icons[type] || icons['general'];
  }
  
  /**
   * Format search history for display
   */
  formatSearchHistory(searches) {
    return searches.map(search => ({
      ...search,
      icon: this.getQueryTypeIcon(search.query_type),
      shortQuery: search.query.length > 50 ? search.query.substring(0, 47) + '...' : search.query,
      shortSummary: search.response_summary && search.response_summary.length > 100 
        ? search.response_summary.substring(0, 97) + '...' 
        : search.response_summary,
      timeAgo: this.getTimeAgo(search.created_at)
    }));
  }
  
  /**
   * Get human-readable time ago
   */
  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  }
}

// Export singleton instance
export default new ChatService();