'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { ChevronDown, Languages } from 'lucide-react';

export default function AuthLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentLocale = locale === 'ar' ? 'ar' : 'en';

  const switchLanguage = (newLocale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setOpen(false);
  };

  useEffect(() => {
    const onOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  return (
    <div ref={ref} className="relative z-20">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex  w-full items-center justify-center  gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-cyan-500 hover:text-cyan-700"
      >
        <Languages size={16} />
        <span>{currentLocale === 'en' ? 'English' : 'العربية'}</span>
        <ChevronDown size={15} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => switchLanguage('en')}
            className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-cyan-50"
          >
            English
          </button>
          <button
            type="button"
            onClick={() => switchLanguage('ar')}
            className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-cyan-50"
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
