const { conversationService } = require('../../shared/conversationService');
 // Assurz-vous que le chemin est correct

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const body = JSON.parse(event.body);
    const { propertyId, guestName, guestEmail, message } = body;

    if (!propertyId || !guestName || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: propertyId, guestName, or message' }),
      };
    }

    console.log('Received message:', body);

    // Trouver ou créer une conversation
    const conversation = await conversationService.findOrCreateConversation({
      propertyId,
      guestName,
      guestEmail,
    });

    // Ajouter le message à la conversation
    const updatedConversation = await conversationService.addMessageToConversation(
      conversation.id,
      message
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message added successfully',
        conversation: updatedConversation,
      }),
    };
  } catch (error) {
    console.error('Error processing message:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process message' }),
    };
  }
};
