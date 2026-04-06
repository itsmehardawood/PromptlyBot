'use client';

import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/translations';
import { apiUrl } from '@/lib/api';

const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
});

export default function SignUpForm({ locale }) {
  const [countryCode, setCountryCode] = useState('+1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const t = useTranslation(locale);
  const isArabic = locale === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedPhone = `${countryCode.replace('+', '')}${phoneNumber}`;

      const response = await fetch(apiUrl('/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          phone: formattedPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(t('signupSuccess'));
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 1500);
      } else {
        setError(data.detail || t('signupError'));
        setSuccessMessage('');
      }
    } catch (error) {
      setError(t('signupError'));
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${PoppinsFont.variable} w-full text-black ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-2xl shadow-cyan-900/15 backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
          {isArabic ? 'انضم إلينا الآن' : 'Join now'}
        </p>
        <h1 className="font-poppins pb-1 pt-2 text-3xl font-bold text-slate-900">
          {t('signupTitle')}
        </h1>
        <p className="mb-5 text-sm text-slate-500">
          {isArabic ? 'أنشئ حسابك وابدأ إعداد البوت خلال دقائق.' : 'Create your account and start configuring your bot in minutes.'}
        </p>

        {successMessage && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>
        )}

        {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('phoneNumber')}
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={isSubmitting}
                className="w-24 rounded-lg border border-slate-300 px-2 py-2.5 text-sm shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+92">+92</option>
                <option value="+971">+971</option>
                <option value="+972">+972</option>
              </select>
              
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder={t('phoneNumberPlaceholder')}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
                required
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder={t('confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              required
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-cyan-400"
          >
            {isSubmitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isSubmitting ? (isArabic ? 'جار إنشاء الحساب...' : 'Creating account...') : t('signUp')}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          {t('alreadyHaveAccount')}{' '}
          <Link href={`/${locale}/login`} className="font-semibold text-cyan-600 hover:text-cyan-700">
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
