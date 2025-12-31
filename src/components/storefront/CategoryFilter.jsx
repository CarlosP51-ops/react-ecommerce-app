import { useState } from 'react';
import { CATEGORIES } from '../../utils/constants';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll ? CATEGORIES : CATEGORIES.slice(0, 6);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Catégories</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg ${
            selectedCategory === 'all'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Toutes catégories</span>
        </button>
        
        {displayedCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg ${
              selectedCategory === category
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{category}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {/* Vous pouvez ajouter le nombre de produits par catégorie ici */}
            </span>
          </button>
        ))}
      </div>
      
      {CATEGORIES.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-indigo-600 hover:text-indigo-500 w-full text-center"
        >
          {showAll ? 'Voir moins' : 'Voir plus de catégories'}
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;