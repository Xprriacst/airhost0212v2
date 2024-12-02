import Airtable from 'airtable';
import type { Property } from '../types';
import { handleServiceError } from '../utils/error';

const base = new Airtable({ 
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

const mapRecordToProperty = (record: any): Property => ({
  id: record.id,
  name: record.get('Name') || '',
  address: record.get('Address') || '',
  accessCodes: {
    wifi: {
      name: record.get('WiFi Name') || '',
      password: record.get('WiFi Password') || ''
    },
    door: record.get('Door Code') || ''
  },
  houseRules: record.get('House Rules') || [],
  amenities: record.get('Amenities') || [],
  checkInTime: record.get('Check-in Time') || '',
  checkOutTime: record.get('Check-out Time') || '',
  maxGuests: record.get('Max Guests') || 0,
  photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
  description: record.get('Description'),
  parkingInfo: record.get('Parking Info'),
  restaurants: record.get('Restaurants'),
  fastFood: record.get('Fast Food'),
  emergencyContacts: record.get('Emergency Contacts')
});

export const airtableService = {
  async getProperties(): Promise<Property[]> {
    try {
      console.log('Fetching properties from Airtable...');
      const records = await base('Properties')
        .select({ view: 'Grid view' })
        .all();
      
      return records.map(mapRecordToProperty);
    } catch (error) {
      return handleServiceError(error, 'Airtable.getProperties');
    }
  },

  async deleteProperty(id: string): Promise<{ success: boolean }> {
    try {
      await base('Properties').destroy(id);
      return { success: true };
    } catch (error) {
      return handleServiceError(error, 'Airtable.deleteProperty');
    }
  }
};