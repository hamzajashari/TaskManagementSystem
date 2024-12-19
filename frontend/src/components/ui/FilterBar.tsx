import React, { useState } from 'react';
import { Priority } from '../../models/Priority';
import Button from './Button';
import { TaskFilterParams } from '../../models/TaskModel';

interface FilterBarProps {
  filters: TaskFilterParams;
  onFilterChange: (filters: TaskFilterParams) => void;
  onResetFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDateChange = (field: 'dueDateFrom' | 'dueDateTo', value: string) => {
    if (!value) {
      const newFilters = { ...filters };
      delete newFilters[field];
      onFilterChange(newFilters);
    } else {
      onFilterChange({
        ...filters,
        [field]: value
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search and Expand Row */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            className="w-full form-input border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
            placeholder="Search tasks..."
            value={filters.searchTerm || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              searchTerm: e.target.value || undefined
            })}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </Button>
        {isExpanded && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Collapsible Filters */}
      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full form-select text-sm rounded-md border-gray-300"
                value={filters.isCompleted === undefined ? '' : String(filters.isCompleted)}
                onChange={(e) => onFilterChange({
                  ...filters,
                  isCompleted: e.target.value === '' ? undefined : e.target.value === 'true'
                })}
              >
                <option value="">All</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full form-select text-sm rounded-md border-gray-300"
                value={filters.priority || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  priority: e.target.value as Priority || undefined
                })}
              >
                <option value="">All</option>
                {Object.values(Priority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="flex gap-1">
                <select
                  className="flex-1 form-select text-sm rounded-md border-gray-300"
                  value={filters.sortBy || ''}
                  onChange={(e) => onFilterChange({
                    ...filters,
                    sortBy: e.target.value || undefined
                  })}
                >
                  <option value="">Default</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="createdAt">Created</option>
                </select>
                <button
                  className={`px-2 rounded-md border ${
                    filters.sortDescending 
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                      : 'bg-gray-50 border-gray-300 text-gray-700'
                  }`}
                  onClick={() => onFilterChange({
                    ...filters,
                    sortDescending: !filters.sortDescending
                  })}
                  title={filters.sortDescending ? "Descending" : "Ascending"}
                >
                  {filters.sortDescending ? '↓' : '↑'}
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="flex gap-1">
                <input
                  type="date"
                  className="w-1/2 form-input text-sm rounded-md border-gray-300"
                  value={(filters.dueDateFrom instanceof Date 
                    ? filters.dueDateFrom.toISOString().split('T')[0] 
                    : filters.dueDateFrom) || ''}
                  onChange={(e) => handleDateChange('dueDateFrom', e.target.value)}
                  placeholder="From"
                />
                <input
                  type="date"
                  className="w-1/2 form-input text-sm rounded-md border-gray-300"
                  value={(filters.dueDateTo instanceof Date 
                    ? filters.dueDateTo.toISOString().split('T')[0] 
                    : filters.dueDateTo) || ''}
                  onChange={(e) => handleDateChange('dueDateTo', e.target.value)}
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar; 