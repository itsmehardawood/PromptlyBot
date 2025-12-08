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
        className="w-full py-2 px-21  text-lg font-semibold text-white bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 hover:from-slate-800 hover:to-teal-900 rounded-xl transition duration-300 shadow-md"
      >
       {t('ManageSystemPrompt')}
      </button>
      <SystemPromptModal  isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
