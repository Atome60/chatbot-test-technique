"use client";

import React, { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  category: string;
}

interface ItemSelectorProps {
  onChange: (items: string[]) => void;
  hasError?: boolean;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ onChange, hasError }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    // Charger les items et les catégories dynamiquement
    const fetchItems = async () => {
      const response = await fetch('/api/items');
      const data: Item[] = await response.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    const selectedNames = selectedOptions
      .map((id) => {
        const item = items.find((itm) => itm.id === id);
        return item ? item.name : id;
      });
    onChange(selectedNames);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <div className="item-selector">
      <label htmlFor="categories" className="text-black">Filtrer par catégorie :</label>
      <select
        id="categories"
        onChange={handleCategoryChange}
        className="w-full p-2 border border-gray-300 rounded-md text-black mb-4"
      >
        <option value="">Toutes les catégories</option>
        {[...new Set(items.map((item) => item.category))].map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <label htmlFor="items" className="text-black">Choisissez un ou plusieurs items :</label>
      <select
        id="items"
        multiple
        onChange={handleSelect}
        className={`w-full p-2 border border-gray-300 rounded-md text-black ${hasError ? 'error-border' : ''}`}
      >
        {filteredItems.map((item) => (
          <option key={item.id} value={item.id}>{item.name} ({item.category})</option>
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

export default ItemSelector;