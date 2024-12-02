import React, { useState, useEffect } from 'react';
import { airtableService } from '../services/airtableService';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch properties on component load
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await airtableService.getProperties();
        setProperties(data);
      } catch (err) {
        setError('Failed to load properties.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Toggle the Add Property form
  const handleAddProperty = () => {
    setShowForm((prev) => !prev);
  };

  // Handle form submission
  const handleFormSubmit = async (propertyData) => {
    try {
      const newProperty = await airtableService.addProperty(propertyData);
      setProperties((prev) => [...prev, newProperty]); // Update the properties list
      setShowForm(false); // Close the form
    } catch (err) {
      console.error('Error adding property:', err);
      setError('Failed to add property.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Properties</h1>
      <button
        onClick={handleAddProperty}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Add Property
      </button>

      {showForm && (
        <PropertyForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
      )}

      <ul>
        {properties.map((property) => (
          <li key={property.id}>{property.name}</li>
        ))}
      </ul>
    </div>
  );
};

const PropertyForm: React.FC<{ onSubmit: (data: any) => void; onCancel: () => void }> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ Name: name, Address: address });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-md">
      <h2>Add Property</h2>
      <div>
        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="text-gray-600">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
};

export default Properties;
