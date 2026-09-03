'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Building2, Wrench, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (params: {
    keyword?: string;
    skill?: string;
    company?: string;
    location?: string;
    page?: number;
  }) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [skill, setSkill] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const buildParams = (overrides: {
    keyword?: string;
    skill?: string;
    company?: string;
    location?: string;
  }) => ({
    keyword: overrides.keyword !== undefined ? overrides.keyword.trim() || undefined : keyword.trim() || undefined,
    skill: overrides.skill !== undefined ? overrides.skill.trim() || undefined : skill.trim() || undefined,
    company: overrides.company !== undefined ? overrides.company.trim() || undefined : company.trim() || undefined,
    location: overrides.location !== undefined ? overrides.location.trim() || undefined : location.trim() || undefined,
    page: 1,
  });

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    onSearch(buildParams({ keyword: value }));
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkill(value);
    onSearch(buildParams({ skill: value }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompany(value);
    onSearch(buildParams({ company: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    onSearch(buildParams({ location: value }));
  };

  const handleReset = () => {
    setKeyword('');
    setSkill('');
    setCompany('');
    setLocation('');
    setShowFilters(false);
    onSearch({ keyword: undefined, skill: undefined, company: undefined, location: undefined, page: 1 });
  };

  const hasFilters = Boolean(keyword || skill || company || location);

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={handleKeywordChange}
              placeholder="جستجو بر اساس نام، عنوان شغلی، شرکت..."
              className="input pr-10"
            />
          </div>
          {isLoading && (
            <div className="flex items-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            </div>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Filter className="h-4 w-4" />
            فیلترها
          </button>
          {hasFilters && (
            <button
              onClick={handleReset}
              className="btn btn-secondary"
              title="پاک کردن فیلترها"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 animate-fade-in">
            <div className="relative">
              <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={company}
                onChange={handleCompanyChange}
                placeholder="شرکت"
                className="input pr-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="موقعیت جغرافیایی"
                className="input pr-10"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
