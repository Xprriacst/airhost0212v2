import Airtable from 'airtable';

const base = new Airtable({ 
  apiKey: 'patlhfIgBrQOublx1.abb4f6845a28c05bdbb50de759bff59e27ae77c1fac38009506be9e2fe2c727a'
}).base('appOuR5fZOnAGiS3b');

async function createProperties() {
  console.log('Création des propriétés...');
  
  const properties = [
    {
      fields: {
        Name: 'Studio Blois',
        Address: '13 rue des Papegaults, Blois',
        'WiFi Name': 'FREEBOX-AE4AC6',
        'WiFi Password': 'barbani@%-solvi38-irrogatura-cannetum?&',
        'Door Code': '210',
        'House Rules': ['Max 4 personnes', 'Pas de visiteurs supplémentaires', 'Respecter le calme'],
        'Amenities': ['TV', 'Cuisine', 'Chauffage'],
        'Check-in Time': '15:00',
        'Check-out Time': '11:00',
        'Max Guests': 4,
        'Description': 'Charmant studio en plein cœur de Blois',
        'Parking Info': 'Parking gratuit : Parking du Mail (5 minutes à pied)',
        'Restaurants': ['Brute Maison de Cuisine', 'Le Diffa', "Bro's Restaurant"],
        'Fast Food': ["Frenchy's", 'Le Berliner', 'Osaka'],
        'Emergency Contacts': ['+33 6 17 37 04 84', '+33 6 20 16 93 17']
      }
    },
    {
      fields: {
        Name: 'Villa Sunset',
        Address: '123 Avenue de la Plage, Biarritz',
        'WiFi Name': 'SunsetVilla_5G',
        'WiFi Password': 'welcome2024!',
        'Door Code': '4080#',
        'House Rules': ['Pas de fête', 'Pas de fumée', 'Calme entre 22h et 8h'],
        'Amenities': ['Piscine', 'Accès plage', 'Parking gratuit'],
        'Check-in Time': '15:00',
        'Check-out Time': '11:00',
        'Max Guests': 6
      }
    }
  ];

  const createdProperties = await base('Properties').create(properties);
  console.log(`✓ ${createdProperties.length} propriétés créées`);
  return createdProperties;
}

async function createConversations(properties: any[]) {
  console.log('\nCréation des conversations...');

  const conversations = [
    {
      fields: {
        'Property': [properties[0].id], // Studio Blois
        'Guest Name': 'Pierre Dubois',
        'Guest Email': 'pierre.dubois@email.com',
        'Check-in Date': '2024-03-10',
        'Check-out Date': '2024-03-15',
        'Status': 'Confirmed',
        'Messages': JSON.stringify([
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
        ])
      }
    },
    {
      fields: {
        'Property': [properties[0].id], // Studio Blois
        'Guest Name': 'Marie Laurent',
        'Guest Email': 'marie.laurent@email.com',
        'Check-in Date': '2024-03-15',
        'Check-out Date': '2024-03-20',
        'Status': 'Confirmed',
        'Emergency Tags': ['probleme_stock'],
        'Messages': JSON.stringify([
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
        ])
      }
    },
    {
      fields: {
        'Property': [properties[0].id], // Studio Blois
        'Guest Name': 'Thomas Bernard',
        'Guest Email': 'thomas.bernard@email.com',
        'Check-in Date': '2024-03-12',
        'Check-out Date': '2024-03-17',
        'Status': 'Confirmed',
        'Emergency Tags': ['reponse_inconnue'],
        'Messages': JSON.stringify([
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
        ])
      }
    }
  ];

  const createdConversations = await base('Conversations').create(conversations);
  console.log(`✓ ${createdConversations.length} conversations créées`);
}

async function populateAirtable() {
  try {
    console.log('=== Début de la population de la base de données ===\n');
    
    const properties = await createProperties();
    await createConversations(properties);
    
    console.log('\n✓ Base de données peuplée avec succès !');
  } catch (error) {
    console.error('\n❌ Erreur lors de la population :', error);
    process.exit(1);
  }
}

populateAirtable();