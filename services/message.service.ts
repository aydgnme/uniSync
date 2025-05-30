import { apiService } from './api.service';

export interface Message {
  id: string;
  sender: string;
  subject: string;
  message: string;
  time: string;
  unread: boolean;
}

class MessageService {
  private static instance: MessageService;

  private constructor() {}

  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  public async getMessages(): Promise<Message[]> {
    return apiService.get<Message[]>('/messages');
  }

  public async getMessage(id: string): Promise<Message> {
    return apiService.get<Message>(`/messages/${id}`);
  }

  public async markAsRead(id: string): Promise<void> {
    return apiService.patch<void>(`/messages/${id}/read`);
  }

  public async deleteMessage(id: string): Promise<void> {
    return apiService.delete<void>(`/messages/${id}`);
  }
}

export const messageService = MessageService.getInstance(); 