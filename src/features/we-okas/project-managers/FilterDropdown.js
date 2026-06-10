import { useState } from 'react';
import { motion } from 'motion/react';

export default function FilterDropdown({ categories, onApply, onClose }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.name || '');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = categories.find(cat => cat.name === activeCategory);
  const filteredOptions = currentCategory?.options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const toggleOption = (categoryName, value) => {
    setSelectedFilters(prev => {
      const categorySelections = prev[categoryName] || [];
      const isSelected = categorySelections.includes(value);
      if (isSelected) {
        return { ...prev, [categoryName]: categorySelections.filter(v => v !== value) };
      } else {
        return { ...prev, [categoryName]: [...categorySelections, value] };
      }
    });
  };

  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  const handleClear = () => {
    setSelectedFilters({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 top-[48px] bg-white rounded-[12px] shadow-[0_8px_32px_rgba(10,30,63,0.12)] border border-[#e2e2e2] overflow-hidden z-50 w-[95vw] max-w-[480px]"
    >
      <div className="flex h-[60vh] max-h-[380px] min-h-[300px]">
        {/* Left: Categories */}
        <div className="w-[140px] bg-gradient-to-b from-[#f8f9fb] to-[#f4f7fb] flex flex-col">
          <div className="px-[16px] py-[16px] border-b border-[#e2e2e2]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-[#5c7089] tracking-[1px] uppercase">Categories</p>
          </div>
          <div className="flex-1 py-[8px]">
            {categories.map((category, index) => {
              const count = selectedFilters[category.name]?.length || 0;
              return (
                <motion.button
                  key={category.name}
                  onClick={() => { setActiveCategory(category.name); setSearchQuery(''); }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className={`${
                    activeCategory === category.name
                      ? 'bg-white text-[#0a1e3f] shadow-sm border-l-[3px] border-l-[#0a1e3f]'
                      : 'bg-transparent text-[#5c7089] hover:bg-white/50 border-l-[3px] border-l-transparent'
                  } w-full px-[16px] py-[12px] text-left font-['Inter:Medium',sans-serif] font-medium text-[14px] transition-all duration-200 flex items-center justify-between`}
                >
                  <span>{category.name}</span>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-[#0a1e3f] text-white rounded-full size-[20px] flex items-center justify-center text-[11px] font-semibold"
                    >
                      {count}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Options */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="px-[20px] py-[16px] border-b border-[#e2e2e2]">
            <div className="bg-[#f4f7fb] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[10px] focus-within:ring-2 focus-within:ring-[#0a1e3f]/10 transition-all">
              <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="5.5" stroke="#5c7089" strokeWidth="1.4" />
                <path d="M13 13L16.5 16.5" stroke="#5c7089" strokeLinecap="round" strokeWidth="1.4" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 font-['Inter:Regular',sans-serif] text-[14px] text-[#0a1e3f] bg-transparent border-none outline-none placeholder:text-[#5c7089]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-[20px] py-[12px]">
            {filteredOptions.length > 0 ? (
              <div className="flex flex-col gap-[4px]">
                {filteredOptions.map((option, index) => {
                  const isSelected = selectedFilters[activeCategory]?.includes(option.value) || false;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => toggleOption(activeCategory, option.value)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ x: 4 }}
                      className={`${isSelected ? 'bg-[#f4f7fb]' : 'bg-transparent'} flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px] hover:bg-[#f4f7fb] transition-all duration-150 text-left group`}
                    >
                      <motion.div
                        animate={{
                          backgroundColor: isSelected ? '#0a1e3f' : '#ffffff',
                          borderColor: isSelected ? '#0a1e3f' : '#d0d0d0',
                          scale: isSelected ? 1.05 : 1
                        }}
                        className="relative rounded-[4px] shrink-0 size-[18px] flex items-center justify-center border-[1.5px] transition-all duration-200"
                      >
                        {isSelected && (
                          <motion.svg
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="block size-[11px]" fill="none" viewBox="0 0 10 10"
                          >
                            <path d="M2 5.45L4 7.25L8 3.25" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                          </motion.svg>
                        )}
                      </motion.div>
                      <p className={`font-['Inter:Medium',sans-serif] font-medium text-[14px] ${isSelected ? 'text-[#0a1e3f]' : 'text-[#5c7089] group-hover:text-[#0a1e3f]'} transition-colors`}>
                        {option.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-[20px]">
                <svg className="size-[48px] mb-[12px] opacity-30" fill="none" viewBox="0 0 24 24">
                  <circle cx="10" cy="10" r="7" stroke="#5c7089" strokeWidth="1.5" />
                  <path d="M15 15L20 20" stroke="#5c7089" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#5c7089]">No results found</p>
                <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#9ca3af] mt-[4px]">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#e2e2e2] bg-[#fafbfc] px-[20px] py-[16px] flex items-center justify-between">
        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#5c7089] hover:text-[#0a1e3f] transition-colors flex items-center gap-[6px]"
        >
          <motion.svg whileHover={{ rotate: 90 }} className="size-[16px]" fill="none" viewBox="0 0 16 16">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          </motion.svg>
          Clear All
        </motion.button>
        <div className="flex gap-[12px]">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-[20px] py-[10px] rounded-[8px] font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#5c7089] hover:bg-[#f4f7fb] transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleApply}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-[20px] py-[10px] rounded-[8px] bg-[#0a1e3f] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white hover:bg-[#0a2a5a] transition-all shadow-sm hover:shadow-md"
          >
            Apply Filters
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
