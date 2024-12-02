import type { Conversation, Message } from '../types';
import { aiService } from './aiService';

const MOCK_CONVERSATIONS: Conversation[] = [
  // Conversations pour Château de Chenonceau
  {
    id: 'conv1',
    propertyId: '1',
    guestName: 'Pierre Dubois',
    checkIn: '2024-03-10',
    checkOut: '2024-03-15',
    messages: [
      {
        id: '1',
        text: "Bonjour et bienvenue au logement ! N'hésitez pas si vous avez des questions :)",
        isUser: true,
        timestamp: new Date('2024-03-10T14:30:00'),
        sender: 'Hôte'
      },
      {
        id: '2',
        text: "Merci, quel est le wifi ?",
        isUser: false,
        timestamp: new Date('2024-03-10T14:31:00'),
        sender: 'Pierre Dubois'
      },
      {
        id: '3',
        text: "Le WIFI est AZER1234 :) bon séjour à vous !",
        isUser: true,
        timestamp: new Date('2024-03-10T14:32:00'),
        sender: 'Hôte'
      }
    ]
  },
  {
    id: 'conv2',
    propertyId: '1',
    guestName: 'Marie Laurent',
    checkIn: '2024-03-15',
    checkOut: '2024-03-20',
    emergencyTags: ['probleme_stock'],
    messages: [
      {
        id: '1',
        text: "Bonjour et bienvenue au logement ! N'hésitez pas si vous avez des questions :)",
        isUser: true,
        timestamp: new Date('2024-03-15T15:15:00'),
        sender: 'Hôte'
      },
      {
        id: '2',
        text: "Bonjour, il n'y a pas de drap housse dans le logement",
        isUser: false,
        timestamp: new Date('2024-03-15T15:16:00'),
        sender: 'Marie Laurent'
      }
    ]
  },
  {
    id: 'conv3',
    propertyId: '1',
    guestName: 'Thomas Bernard',
    checkIn: '2024-03-12',
    checkOut: '2024-03-17',
    emergencyTags: ['reponse_inconnue'],
    messages: [
      {
        id: '1',
        text: "Bonjour et bienvenue au logement ! N'hésitez pas si vous avez des questions :)",
        isUser: true,
        timestamp: new Date('2024-03-12T09:15:00'),
        sender: 'Hôte'
      },
      {
        id: '2',
        text: "Bonjour possibilité de prendre un jour en plus",
        isUser: false,
        timestamp: new Date('2024-03-12T09:16:00'),
        sender: 'Thomas Bernard'
      }
    ]
  }
];

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    return MOCK_CONVERSATIONS;
  },

  async getConversationsByProperty(propertyId: string): Promise<Conversation[]> {
    const conversations = await this.getConversations();
    return conversations.filter(conv => conv.propertyId === propertyId);
  },

  async getConversation(id: string): Promise<Conversation | null> {
    const conversations = await this.getConversations();
    return conversations.find(conv => conv.id === id) || null;
  },

  async addMessage(conversationId: string, message: Omit<Message, 'id'>): Promise<Message> {
    const newMessage = {
      ...message,
      id: Date.now().toString()
    };
    return newMessage;
  }
};