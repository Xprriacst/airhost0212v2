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
  /**
   * Fetch conversations linked to a property
   * @param propertyId - The Record ID of the property
   * @returns List of conversations
   */
  async fetchConversations(propertyId: string) {
    try {
      console.log(`Fetching conversations for property ID: ${propertyId}`);
      const records = await base('Conversations')
        .select({
          filterByFormula: `{Properties} = '${propertyId}'`, // Corrected field name
        })
        .all();

      console.log('Raw records from Airtable:', records);

      return records.map((record) => ({
        id: record.id,
        propertyId,
        guestName: record.get('Guest Name') || '',
        guestEmail: record.get('Guest Email') || '',
        checkIn: record.get('Check-in Date') || '',
        checkOut: record.get('Check-out Date') || '',
        messages: (() => {
          const rawMessages = record.get('Messages');
          try {
            return typeof rawMessages === 'string'
              ? [{ text: rawMessages }]
              : JSON.parse(rawMessages || '[]');
          } catch {
            console.warn(`Invalid Messages format for record ${record.id}`);
            return [];
          }
        })(),
        status: record.get('Status') || 'Unknown',
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw new Error('Failed to fetch conversations. Ensure the Properties column in Airtable is correctly linked and the ID is valid.');
    }
  },

  /**
   * Add a new conversation to Airtable
   * @param conversationData - Data for the conversation
   * @returns The created conversation
   */
  async addConversation(conversationData: Record<string, any>) {
    try {
      console.log('Adding a new conversation to Airtable:', conversationData);
      const createdRecord = await base('Conversations').create({
        fields: conversationData,
      });

      console.log('Conversation added successfully:', createdRecord);

      return {
        id: createdRecord.id,
        ...createdRecord.fields,
      };
    } catch (error) {
      console.error('Error adding conversation to Airtable:', error);
      throw new Error('Failed to add conversation. Ensure all required fields are correctly filled.');
    }
  },

  /**
   * Delete a conversation from Airtable
   * @param conversationId - The Record ID of the conversation
   * @returns A success object
   */
  async deleteConversation(conversationId: string) {
    try {
      console.log(`Deleting conversation with ID: ${conversationId}`);
      await base('Conversations').destroy(conversationId);
      console.log(`Conversation with ID ${conversationId} deleted successfully.`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation from Airtable:', error);
      throw new Error('Failed to delete conversation. Ensure the ID is correct.');
    }
  },
};
