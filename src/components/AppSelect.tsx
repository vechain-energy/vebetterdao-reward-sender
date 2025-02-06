import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AppData } from '../types';
import { convertIpfsUrl } from '../utils/ipfs';
import clsx from 'clsx';

interface AppSelectProps {
  apps: AppData[];
  value: string;
  onChange: (value: string) => void;
}

export function AppSelect({ apps, value, onChange }: AppSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedApp = apps.find(app => app.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full px-4 py-2 text-left border rounded-lg bg-white",
          "flex items-center justify-between",
          "focus:outline-none focus:ring-2 focus:ring-orange-500",
          isOpen ? "ring-2 ring-orange-500" : ""
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {selectedApp ? (
            <>
              {selectedApp.metadata.logoUrl && (
                <img
                  src={convertIpfsUrl(selectedApp.metadata.logoUrl)}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span>{selectedApp.name}</span>
            </>
          ) : (
            <span className="text-gray-500">Select an app...</span>
          )}
        </div>
        <ChevronDown className={clsx(
          "w-5 h-5 transition-transform",
          isOpen ? "transform rotate-180" : ""
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul
            role="listbox"
            className="py-1"
          >
            {apps.map((app) => (
              <li
                key={app.id}
                role="option"
                aria-selected={app.id === value}
                onClick={() => {
                  onChange(app.id);
                  setIsOpen(false);
                }}
                className={clsx(
                  "px-4 py-2 flex items-center gap-2 cursor-pointer",
                  "hover:bg-orange-50",
                  app.id === value ? "bg-orange-50" : ""
                )}
              >
                {app.metadata.logoUrl && (
                  <img
                    src={convertIpfsUrl(app.metadata.logoUrl)}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{app.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}