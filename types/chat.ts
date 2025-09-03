/**
 * Chat related interfaces
 */

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'system';
    timestamp: Date;
    type?: 'text' | 'payment' | 'options' | 'system';
    options?: MessageOption[];
}

export interface MessageOption {
    title: string;
    icon: string;
    action: string;
} 