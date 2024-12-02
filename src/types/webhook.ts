import { z } from 'zod';

export const whatsappMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  sender: z.string().min(1, 'Sender is required'),
  timestamp: z.string().min(1, 'Timestamp is required')
});

export type WhatsappMessage = z.infer<typeof whatsappMessageSchema>;

export interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface WhatsappResponsePayload {
  Body: string;
}