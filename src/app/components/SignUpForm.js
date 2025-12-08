'use client';

import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/translations';

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

  const router = useRouter();
  const t = useTranslation(locale);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    try {
      const formattedPhone = `${countryCode.replace('+', '')}${phoneNumber}`;

      const response = await fetch('https://api.neurovisesolutions.com/auth/signup', {
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
    }
  };

  return (
    <div className={`${PoppinsFont.variable} flex justify-center w-full min-h-screen items-center text-black`}>
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h1 className="font-poppins text-gray-900 text-2xl py-5 font-bold">
          {t('signupTitle')}
        </h1>

        {successMessage && (
          <p className="text-green-500 text-sm mb-4">{successMessage}</p>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              {t('phoneNumber')}
            </label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="mr-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+91">+91</option>
                <option value="+92">+92</option>
                <option value="+971">+971</option>
                <option value="+972">+972</option>




                {/* Add more country codes here if you want */}
              </select>
              
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder={t('phoneNumberPlaceholder')}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder={t('confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          >
            {t('signUp')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t('alreadyHaveAccount')}{' '}
          <Link href={`/${locale}`} className="text-teal-500 hover:text-teal-700">
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
