'use client'

import { Poppins } from 'next/font/google'
import LoginForm from '@/app/components/LoginForm'
import Image from 'next/image'
import { useTranslation } from '@/lib/translations'
import { useParams } from 'next/navigation'
import LanguageButton from '@/app/components/LanguageButton'
import FloatingLanguageButton from '@/app/components/FloatingLanguagebutton'

const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
})

export default function Page() {
  const { locale } = useParams()  // gets the locale from the dynamic route
  const t = useTranslation(locale || 'ar')

  return (
    <div className={`${PoppinsFont.variable} w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2`}>
      <FloatingLanguageButton/>
      {/* Left Section */}
      <div className="bg-cyan-800 w-full text-white bg-gradient-to-tl from-cyan-600 via-transparent to-gray-300 rtl:bg-gradient-to-br">
        <div className="py-4 px-7 flex justify-between  font-poppins items-start font-bold ">
          <Image src="/images/logo.png" height="80" width="90" alt="this is our logo" priority />
       
        </div>
        <p className="font-poppins w-full flex justify-center items-center text-6xl px-10 py-32 rtl:text-right ltr:text-left">
          {t('welcomeMessage')}
        </p>
      </div>

      {/* Right Section */}
      <div className="bg-white w-full flex  items-center">
        <LoginForm locale={locale} />
      </div>
    </div>
  )
}