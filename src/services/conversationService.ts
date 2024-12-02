import Airtable from 'airtable';

// Assurez-vous que vos variables d'environnement sont correctement définies
const apiKey = process.env.VITE_AIRTABLE_API_KEY || '';
const baseId = process.env.VITE_AIRTABLE_BASE_ID || '';

if (!apiKey || !baseId) {
  console.error('Airtable API key or Base ID is missing. Please check your environment variables.');
  throw new Error('Missing Airtable configuration.');
}

const base = new Airtable({ apiKey }).base(baseId);

export const conversationService = {
  /**
   * Récupère les conversations associées à une propriété
   * @param propertyId - L'ID (Record ID) de la propriété
   * @returns Une liste de conversations
   */
  async fetchConversations(propertyId: string) {
    try {
      console.log(`Fetching conversations for property ID: ${propertyId}`);
      const records = await base('Conversations')
        .select({
          filterByFormula: `{Property} = '${propertyId}'`,
        })
        .all();

      console.log('Conversations received from Airtable:', records);

      return records.map((record) => ({
        id: record.id,
        propertyId: propertyId,
        guestName: record.get('Guest Name') || '',
        guestEmail: record.get('Guest Email') || '',
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

  /**
   * Ajoute une nouvelle conversation dans Airtable
   * @param conversationData - Les données de la conversation
   * @returns La conversation ajoutée
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
      throw new Error('Failed to add conversation.');
    }
  },

  /**
   * Supprime une conversation dans Airtable
   * @param conversationId - L'ID (Record ID) de la conversation
   * @returns Un objet avec un statut de succès
   */
  async deleteConversation(conversationId: string) {
    try {
      console.log(`Deleting conversation with ID: ${conversationId}`);
      await base('Conversations').destroy(conversationId);
      console.log(`Conversation with ID ${conversationId} deleted successfully.`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation from Airtable:', error);
      throw new Error('Failed to delete conversation.');
    }
  },
};
