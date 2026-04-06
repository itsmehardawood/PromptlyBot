import { Poppins } from 'next/font/google';
import SignUpForm from '../../components/SignUpForm';
import AuthShowcase from '@/app/components/AuthShowcase';
import AuthLanguageSwitcher from '@/app/components/AuthLanguageSwitcher';

const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
});

export default function SignUpPage({ params }) {
  const locale = params.locale;

  return (
    <div className={`min-h-screen bg-slate-950 text-black ${PoppinsFont.variable}`}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <AuthShowcase
          locale={locale}
          title={locale === 'ar' ? 'ابدأ مع PromptlyBot اليوم' : 'Start with PromptlyBot today'}
          subtitle={
            locale === 'ar'
              ? 'أنشئ حسابك وفعّل شات بوت احترافي لعملك بدون أي تعقيد تقني.'
              : 'Create your account and launch a professional chatbot for your business without technical complexity.'
          }
        />

        <section className="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_52%)]" />
          <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
            <AuthLanguageSwitcher />
          </div>
          <div className="relative w-full max-w-md">
            <SignUpForm locale={locale} />
          </div>
        </section>
      </div>
    </div>
  );
}
