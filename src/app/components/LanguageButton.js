'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Optional icon library

const LanguageButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const switchLanguage = (newLocale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 transition"
      >
        {locale === 'en' ? 'English' : 'Arabic'}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-slate-800 border rounded shadow-md">
          <button
            onClick={() => switchLanguage('en')}
            className="block w-full px-4 py-2 text-left hover:bg-slate-500"
          >
            English
          </button>
          <button
            onClick={() => switchLanguage('ar')}
            className="block w-full px-4 py-2 text-left hover:bg-slate-500"
          >
Arabic          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageButton;
