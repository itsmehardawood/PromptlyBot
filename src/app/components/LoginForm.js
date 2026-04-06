'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/translations';
import { apiUrl } from '@/lib/api';

function LoginForm({ locale = 'ar' }) {
  const t = useTranslation(locale);
  const router = useRouter();
  const isArabic = locale === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append('username', email); // ✅ use 'username' for FastAPI OAuth2
      formBody.append('password', password);
      formBody.append('grant_type', 'password'); // ✅ optional, but standard

      const response = await fetch(apiUrl('/auth/login'), {
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
          router.push(`/${locale}/admin/home`);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full text-black ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-2xl shadow-cyan-900/15 backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
          {isArabic ? 'مرحبا بعودتك' : 'Welcome back'}
        </p>
        <h1 className="pt-2 text-3xl font-bold text-slate-900">{t('login')}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {isArabic ? 'سجل الدخول لإدارة إعدادات البوت والخدمات.' : 'Log in to manage your chatbot settings and services.'}
        </p>

        {successMessage && <p className="mb-4 mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}
        {error && error.map((msg, index) => (
          <p key={index} className="mb-2 mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>
        ))}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">{t('email')}</label>
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
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">{t('password')}</label>
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

          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              {t('rememberMe') || 'Remember me'}
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-cyan-400"
          >
            {isSubmitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isSubmitting ? (isArabic ? 'جار تسجيل الدخول...' : 'Logging in...') : t('loginButton')}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/signup`} className="font-semibold text-cyan-600 hover:text-cyan-700">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;