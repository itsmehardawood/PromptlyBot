'use client'

import { Poppins } from 'next/font/google'
import LoginForm from '@/app/components/LoginForm'
import { useTranslation } from '@/lib/translations'
import { useParams } from 'next/navigation'
import AuthShowcase from '@/app/components/AuthShowcase'
import AuthLanguageSwitcher from '@/app/components/AuthLanguageSwitcher'

const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
})

export default function Page() {
  const { locale } = useParams()  // gets the locale from the dynamic route
  const t = useTranslation(locale || 'ar')

  return (
    <div className={`${PoppinsFont.variable} min-h-screen bg-slate-950 text-black`}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <AuthShowcase
          locale={locale}
          title={t('welcomeMessage')}
          subtitle={
            locale === 'ar'
              ? 'حوّل الزوار إلى عملاء عبر مساعد ذكي يعمل على مدار الساعة.'
              : 'Convert visitors into clients with an AI assistant that works around the clock.'
          }
        />

        <section className="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_52%)]" />
          <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
            <AuthLanguageSwitcher />
          </div>
          <div className="relative w-full max-w-md">
            <LoginForm locale={locale} />
          </div>
        </section>
      </div>
    </div>
  )
}