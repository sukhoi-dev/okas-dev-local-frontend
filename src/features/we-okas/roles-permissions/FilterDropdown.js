import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';

/**
 * Two-panel filter popup matching the design image.
 *
 * Props:
 *   categories: [{ id, label, options: [{ id, label }] }]
 *   selected:   { [categoryId]: Set<optionId> }
 *   onChange:   (categoryId, optionId, checked) => void
 *   onClear:    () => void
 *   onCancel:   () => void
 *   onApply:    () => void
 */
export default function FilterDropdown({ categories = [], selected = {}, onChange, onClear, onCancel, onApply }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');
  const [optionSearch, setOptionSearch]     = useState('');

  const currentCategory = categories.find((c) => c.id === activeCategory);
  const filteredOptions = (currentCategory?.options ?? []).filter((o) =>
    o.label.toLowerCase().includes(optionSearch.toLowerCase())
  );

  const totalSelected = Object.values(selected).reduce((n, set) => n + (set?.size ?? 0), 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full left-0 mt-[6px] bg-white rounded-[12px] shadow-[0_8px_40px_rgba(10,30,63,0.14)] border border-[#e8edf3] z-50 overflow-hidden"
        style={{ width: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[320px]">
          {/* ── Left: category list ── */}
          <div className="w-[140px] border-r border-[#f0f4f8] flex flex-col shrink-0">
            <div className="px-[16px] pt-[16px] pb-[10px]">
              <span className="text-[10px] font-semibold tracking-[2px] text-[#5c7089] uppercase">
                CATEGORIES
              </span>
            </div>
            <div className="flex flex-col gap-[2px] px-[8px] flex-1">
              {categories.map((cat) => {
                const isActive = cat.id === activeCategory;
                const count = selected[cat.id]?.size ?? 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setOptionSearch(''); }}
                    className={`flex items-center justify-between px-[10px] py-[10px] rounded-[6px] text-left transition-colors w-full ${isActive ? 'bg-[#f0f6ff]' : 'hover:bg-[#f4f7fb]'}`}
                  >
                    <div className="flex items-center gap-[8px]">
                      {isActive && <div className="w-[3px] h-[16px] rounded-full bg-[#0a1e3f] shrink-0 -ml-[4px]" />}
                      <span className={`text-[13px] ${isActive ? 'font-semibold text-[#0a1e3f]' : 'text-[#5c7089]'}`}>
                        {cat.label}
                      </span>
                    </div>
                    {count > 0 && (
                      <span className="bg-[#0a1e3f] text-white text-[10px] font-bold rounded-full size-[18px] flex items-center justify-center shrink-0">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right: options ── */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search */}
            <div className="px-[14px] pt-[14px] pb-[10px] border-b border-[#f0f4f8]">
              <div className="bg-[#f4f7fb] flex items-center gap-[8px] px-[12px] h-[36px] rounded-[6px]">
                <Search size={14} className="text-[#9bb0c7] shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={optionSearch}
                  onChange={(e) => setOptionSearch(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] text-[#0a1e3f] placeholder:text-[#9bb0c7] outline-none"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="flex-1 overflow-y-auto px-[14px] py-[10px]">
              {filteredOptions.length === 0 ? (
                <p className="text-[13px] text-[#9bb0c7] py-[8px]">No options found</p>
              ) : (
                <div className="flex flex-col gap-[4px]">
                  {filteredOptions.map((opt) => {
                    const checked = selected[activeCategory]?.has(opt.id) ?? false;
                    return (
                      <label
                        key={opt.id}
                        className="flex items-center gap-[10px] px-[6px] py-[9px] rounded-[6px] hover:bg-[#f4f7fb] cursor-pointer transition-colors"
                      >
                        <div
                          onClick={() => onChange(activeCategory, opt.id, !checked)}
                          className={`size-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                            checked ? 'bg-[#0a1e3f] border-[#0a1e3f]' : 'border-[#c0ccda]'
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 12 10" fill="none" className="size-[10px]">
                              <path d="M1.5 5.5L4.5 8L10.5 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[13px] text-[#0a1e3f]">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-[16px] py-[12px] border-t border-[#f0f4f8] bg-white">
          <button
            onClick={onClear}
            disabled={totalSelected === 0}
            className="flex items-center gap-[6px] text-[13px] text-[#5c7089] hover:text-[#0a1e3f] transition-colors disabled:opacity-40"
          >
            <X size={14} />
            <span>Clear All</span>
          </button>
          <div className="flex items-center gap-[8px]">
            <button
              onClick={onCancel}
              className="px-[16px] py-[8px] text-[13px] text-[#5c7089] hover:text-[#0a1e3f] transition-colors rounded-[6px] hover:bg-[#f4f7fb]"
            >
              Cancel
            </button>
            <button
              onClick={onApply}
              className="bg-[#0a1e3f] text-white px-[16px] py-[8px] rounded-[6px] text-[13px] font-semibold hover:bg-[#0a2a5a] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
