import { Poppins } from 'next/font/google';
import SignUpForm from '../../components/SignUpForm';
import Image from 'next/image';
import LanguageButton from '@/app/components/LanguageButton';

const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
});

export default function SignUpPage({ params }) {
  const locale = params.locale;

  return (
    <div className={`w-full min-h-screen bg-slate-900 bg-gradient-to-bl from-teal-900 via-transparent to-teal-900 items-center text-black ${PoppinsFont.variable}`}>
               <LanguageButton />

  
      <SignUpForm locale={locale} />
    </div>
  );
}
