'use client'

import { useState, useEffect } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagItem {
  id: string;
  name: string;
  color: string;
}

export default function Tags() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch this data from an API or local storage
    const mockTags: TagItem[] = [
      { id: '1', name: 'Vegan', color: 'bg-green-500' },
      { id: '2', name: 'Gluten-Free', color: 'bg-yellow-500' },
      { id: '3', name: 'High Protein', color: 'bg-red-500' },
      { id: '4', name: 'Low Carb', color: 'bg-blue-500' },
      { id: '5', name: 'Keto', color: 'bg-purple-500' },
    ];
    setTags(mockTags);
  }, []);

  const addTag = () => {
    if (newTagName.trim()) {
      const newTag: TagItem = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: `bg-${['red', 'blue', 'green', 'yellow', 'purple'][Math.floor(Math.random() * 5)]}-500`,
      };
      setTags([...tags, newTag]);
      setNewTagName('');
    }
  };

  const removeTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tags</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Tag</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter tag name"
            className="flex-grow p-2 border rounded mr-2"
          />
          <button
            onClick={addTag}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Plus className="mr-2" />
            Add Tag
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Existing Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <div
              key={tag.id}
              className={`${tag.color} text-white px-3 py-1 rounded-full flex items-center`}
            >
              <Tag className="w-4 h-4 mr-2" />
              {tag.name}
              <button
                onClick={() => removeTag(tag.id)}
                className="ml-2 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

