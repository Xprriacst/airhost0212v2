import Airtable from 'airtable';
import type { Property } from '../types';
import { handleServiceError } from '../utils/error';

// Ensure API key and Base ID are fetched securely
const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY || '';
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID || '';

if (!apiKey || !baseId) {
  console.error('Airtable API key or Base ID is missing. Please check your environment variables.');
  throw new Error('Missing Airtable configuration.');
}

const base = new Airtable({ apiKey }).base(baseId);

// Map Airtable records to Property objects
const mapRecordToProperty = (record: any): Property => ({
  id: record.id,
  name: record.get('Name') || '',
  address: record.get('Address') || '',
  accessCodes: {
    wifi: {
      name: record.get('WiFi Name') || '',
      password: record.get('WiFi Password') || '',
    },
    door: record.get('Door Code') || '',
  },
  houseRules: record.get('House Rules') || [],
  amenities: record.get('Amenities') || [],
  checkInTime: record.get('Check-in Time') || '',
  checkOutTime: record.get('Check-out Time') || '',
  maxGuests: record.get('Max Guests') || 0,
  photos: record.get('Photos') || [],
  description: record.get('Description') || '',
  parkingInfo: record.get('Parking Info') || '',
  restaurants: record.get('Restaurants') || [],
  fastFood: record.get('Fast Food') || [],
  emergencyContacts: record.get('Emergency Contacts') || [],
});

export const airtableService = {
  /**
   * Fetch all properties from Airtable
   */
  async getProperties(): Promise<Property[]> {
    try {
      console.log('Fetching properties from Airtable...');
      const records = await base('Properties')
        .select({ view: 'Grid view' })
        .all();
      return records.map(mapRecordToProperty);
    } catch (error) {
      console.error('Error fetching properties from Airtable:', error);
      return handleServiceError(error, 'Airtable.getProperties');
    }
  },

  /**
   * Add a new property to Airtable
   * @param propertyData - Data for the new property
   * @returns The created property object
   */
  async addProperty(propertyData: Record<string, any>): Promise<Property | null> {
    try {
      console.log('Adding a property to Airtable...');
      const createdRecord = await base('Properties').create({
        fields: propertyData,
      });
      return mapRecordToProperty(createdRecord);
    } catch (error) {
      console.error('Error adding property to Airtable:', error);
      return handleServiceError(error, 'Airtable.addProperty');
    }
  },

  /**
   * Delete a property from Airtable
   * @param id - The Record ID of the property
   * @returns Success status
   */
  async deleteProperty(id: string): Promise<{ success: boolean }> {
    try {
      console.log(`Deleting property with ID: ${id}`);
      await base('Properties').destroy(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting property from Airtable:', error);
      return handleServiceError(error, 'Airtable.deleteProperty');
    }
  },
};
