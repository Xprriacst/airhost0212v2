
import Airtable from 'airtable';

// Securely fetching API key and Base ID
const apiKey = process.env.VITE_AIRTABLE_API_KEY || '';
const baseId = process.env.VITE_AIRTABLE_BASE_ID || '';

if (!apiKey || !baseId) {
  console.error('Airtable API key or Base ID is missing. Please check your environment variables.');
  throw new Error('Missing Airtable configuration.');
}

const base = new Airtable({ apiKey }).base(baseId);

export const conversationService = {
  async fetchConversations(propertyId: string) {
    try {
      console.log(`Fetching conversations for property ID: ${propertyId}`);
      const records = await base('Conversations')
        .select({
          filterByFormula: `{Property} = '${propertyId}'`,
        })
        .all();
      return records.map((record) => ({
        id: record.id,
        propertyId: propertyId,
        guestName: record.get('Guest Name') || '',
        checkIn: record.get('Check-in Date') || '',
        checkOut: record.get('Check-out Date') || '',
        messages: JSON.parse(record.get('Messages') || '[]'),
        status: record.get('Status') || 'Unknown',
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw new Error('Failed to fetch conversations.');
    }
  },

  async addConversation(conversationData: Record<string, any>) {
    try {
      console.log('Adding a new conversation to Airtable...');
      const createdRecord = await base('Conversations').create(conversationData);
      return {
        id: createdRecord.id,
        ...createdRecord.fields,
      };
    } catch (error) {
      console.error('Error adding conversation to Airtable:', error);
      throw new Error('Failed to add conversation.');
    }
  },

  async deleteConversation(conversationId: string) {
    try {
      console.log(`Deleting conversation with ID: ${conversationId}`);
      await base('Conversations').destroy(conversationId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Failed to delete conversation.');
    }
  },
};
