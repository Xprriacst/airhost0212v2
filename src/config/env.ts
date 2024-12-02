import { z } from 'zod';

const envSchema = z.object({
  openai: z.object({
    apiKey: z.string().min(1, 'OpenAI API key is required'),
  }),
  airtable: z.object({
    apiKey: z.string().min(1, 'Airtable API key is required'),
    baseId: z.string().min(1, 'Airtable Base ID is required'),
  }),
  make: z.object({
    webhookUrl: z.string().url('Make webhook URL must be a valid URL'),
    webhookSecret: z.string().min(1, 'Make webhook secret is required'),
  }),
});

export const env = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  },
  airtable: {
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID,
  },
  make: {
    webhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL,
    webhookSecret: import.meta.env.MAKE_WEBHOOK_SECRET,
  },
};

const validateEnv = () => {
  try {
    envSchema.parse(env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw error;
  }
};

validateEnv();