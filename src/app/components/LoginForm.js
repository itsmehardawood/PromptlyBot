'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/translations';

function LoginForm({ locale = 'ar' }) {
  const t = useTranslation(locale);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load saved credentials if available
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    const savedPassword = localStorage.getItem('remembered_password');
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError([t('error.requiredFields')]);
      return;
    }

    try {
      const formBody = new URLSearchParams();
      formBody.append('username', email); // ✅ use 'username' for FastAPI OAuth2
      formBody.append('password', password);
      formBody.append('grant_type', 'password'); // ✅ optional, but standard

      const response = await fetch('https://api.neurovisesolutions.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);

        // Save credentials if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem('remembered_email', email);
          localStorage.setItem('remembered_password', password);
        } else {
          // Clear remembered credentials if unchecked
          localStorage.removeItem('remembered_email');
          localStorage.removeItem('remembered_password');
        }

        setSuccessMessage(t('SuccessfulLogin'));
        setError(null);

        setTimeout(() => {
          router.push(`/${locale}`);
        }, 2000);
      } else {
        if (Array.isArray(data.detail)) {
          const messages = data.detail.map((err) => err.msg);
          setError(messages);
        } else {
          setError([t('loginFailed')]);
        }
        setSuccessMessage('');
      }
    } catch (err) {
      setError([t('error.generic')]);
      setSuccessMessage('');
    }
  };

  return (
    <div className={`py-20 flex justify-center  w-full text-black ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h1 className="text-gray-900 text-2xl py-10 font-bold">{t('login')}</h1>

        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        {error && error.map((msg, index) => (
          <p key={index} className="text-red-500 text-sm mb-2">{msg}</p>
        ))}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              {t('rememberMe') || 'Remember me'}
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          >
            {t('loginButton')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/signup`} className="text-teal-500 hover:text-teal-700">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;