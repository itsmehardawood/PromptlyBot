'use client';
import { useState } from 'react';
import SystemPromptModal from './Systemmodal';
import { useTranslation } from '@/lib/translations';

export default function SystemPromptButton({locale}) {
  const [open, setOpen] = useState(false);
  const t = useTranslation(locale);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 px-4 py-3 text-base font-semibold text-white shadow-md transition duration-300 hover:from-slate-800 hover:to-teal-900"
      >
       {t('ManageSystemPrompt')}
      </button>
      <SystemPromptModal  isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
