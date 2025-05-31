export interface Message {
  id: string;
  sender: string;
  subject: string;
  message: string;
  time: string;
  unread: boolean;
}

// This is a mock service. Replace with actual API calls in production
export const messageService = {
  getMessages: async (): Promise<Message[]> => {
    // TODO: Implement actual API call
    return [];
  },

  markAsRead: async (messageId: string): Promise<void> => {
    // TODO: Implement actual API call
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    // TODO: Implement actual API call
  }
}; 