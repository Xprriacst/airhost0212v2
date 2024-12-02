
import { z } from 'zod';

// Schema validation for environment variables
const envSchema = z.object({
  airtable: z.object({
    apiKey: z.string().min(1, 'Airtable API key is required'),
    baseId: z.string().min(1, 'Airtable Base ID is required'),
  }),
  openai: z.object({
    apiKey: z.string().min(1, 'OpenAI API key is required').optional(),
  }),
  make: z.object({
    webhookUrl: z.string().url('Make webhook URL must be a valid URL').optional(),
    webhookSecret: z.string().min(1, 'Make webhook secret is required').optional(),
  }),
});

// Environment variables object
export const env = {
  airtable: {
    apiKey: process.env.VITE_AIRTABLE_API_KEY || '',
    baseId: process.env.VITE_AIRTABLE_BASE_ID || '',
  },
  openai: {
    apiKey: process.env.VITE_OPENAI_API_KEY || null,
  },
  make: {
    webhookUrl: process.env.VITE_MAKE_WEBHOOK_URL || null,
    webhookSecret: process.env.VITE_MAKE_WEBHOOK_SECRET || null,
  },
};

// Validate the environment configuration
const validateEnv = () => {
  try {
    envSchema.parse(env);
    console.log('Environment configuration validated successfully.');
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw error;
  }
};

validateEnv();
