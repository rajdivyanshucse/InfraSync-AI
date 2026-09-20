import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export const Dropdown = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-48 rounded-md bg-surface-elevated border border-slate-700/80 shadow-panel-lg p-1 animate-slide-up focus:outline-none',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {items.map((item, index) => {
            if (item.type === 'divider') {
              return <div key={`divider-${index}`} className="h-px bg-border my-1" />;
            }
            return (
              <button
                key={item.id || index}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center w-full gap-2 px-2.5 py-1.5 text-xs rounded transition-colors text-left select-none',
                  item.disabled && 'opacity-40 cursor-not-allowed',
                  item.danger
                    ? 'text-rose-400 hover:bg-infra-delayed/15'
                    : 'text-slate-200 hover:bg-surface-subtle hover:text-white'
                )}
              >
                {item.icon && <span className="w-4 h-4 shrink-0 text-slate-400">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
