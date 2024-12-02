import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../types';

const Properties: React.FC = () => {
  const navigate = useNavigate();
  const [properties] = useState<Property[]>([
    {
      id: '1',
      name: 'Studio Blois',
      address: '13 rue des Papegaults, Blois',
      accessCodes: {
        wifi: {
          name: 'FREEBOX-AE4AC6',
          password: 'barbani@%-solvi38-irrogatura-cannetum?&'
        },
        door: '210'
      },
      houseRules: ['Max 4 personnes', 'Pas de visiteurs supplémentaires', 'Respecter le calme'],
      amenities: ['TV', 'Cuisine', 'Chauffage'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      maxGuests: 4,
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
    },
    {
      id: '2',
      name: 'Villa Sunset',
      address: '123 Avenue de la Plage, Biarritz',
      accessCodes: {
        wifi: {
          name: 'SunsetVilla_5G',
          password: 'welcome2024!'
        },
        door: '4080#'
      },
      houseRules: ['Pas de fête', 'Pas de fumée', 'Calme entre 22h et 8h'],
      amenities: ['Piscine', 'Accès plage', 'Parking gratuit'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      maxGuests: 6,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6']
    }
  ]);

  const handleViewConversations = (propertyId: string) => {
    navigate(`/conversations/${propertyId}`);
  };

  return (
    <div className="p-4 space-y-4">
      {properties.map(property => (
        <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src={property.photos[0]}
            alt={property.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{property.name}</h3>
            <p className="text-gray-500 text-sm">{property.address}</p>
            <div className="mt-4">
              <button
                onClick={() => handleViewConversations(property.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Voir les conversations
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Properties;