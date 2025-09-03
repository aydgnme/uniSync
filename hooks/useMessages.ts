import { Message, messageService } from '@/services/message.service';
import { useCallback, useState } from 'react';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await messageService.getMessages();
      setMessages(data);
    } catch (error) {
      setIsError(true);
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, unread: false } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== messageId)
      );
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, []);

  return {
    messages,
    isLoading,
    isError,
    refetch: fetchMessages,
    markAsRead,
    deleteMessage
  };
}; 