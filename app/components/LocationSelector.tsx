"use client";

import React, { useState, useEffect } from 'react';

interface Location {
  id: string;
  name: string;
  type: string;
}

interface LocationSelectorProps {
  onChange: (locations: string[]) => void;
  hasError?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onChange }) => {
  const [locations, setLocations] = useState<Location[]>([]); // Ensure locations is initialized as an empty array
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    // Charger les lieux et les types dynamiquement
    const fetchLocations = async () => {
      const response = await fetch('/api/locations');
      const data: Location[] = await response.json();
      setLocations(data);
    };

    fetchLocations();
  }, []);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    const selectedNames = selectedOptions
      .map((id) => {
        const location = locations.find((loc) => loc.id === id);
        return location ? location.name : id;
      });
    setSelectedLocations(selectedNames);
    onChange(selectedNames);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const filteredLocations = selectedType
    ? locations.filter((location) => location.type === selectedType)
    : locations;

  return (
    <div className="location-selector">
      <label htmlFor="types" className="text-black">Filtrer par type :</label>
      <select
        id="types"
        onChange={handleTypeChange}
        className="w-full p-2 border border-gray-300 rounded-md text-black mb-4"
      >
        <option value="">Tous les types</option>
        {[...new Set(locations.map((location) => location.type))].map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <label htmlFor="locations" className="text-black">Choisissez un ou plusieurs lieux :</label>
      <select
        id="locations"
        multiple
        onChange={handleSelect}
        value={selectedLocations}
        className="w-full p-2 border border-gray-300 rounded-md text-black"
      >
        {filteredLocations.map((location) => (
          <option key={location.id} value={location.id}>{location.name} ({location.type})</option>
        ))}
      </select>

      <style jsx>{`
        .error-border {
          border: 2px solid red;
        }
      `}</style>
    </div>
  );
};

export default LocationSelector;