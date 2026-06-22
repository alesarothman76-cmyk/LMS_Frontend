import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ar'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'ar';

export default getRequestConfig(async (params) => {
  const locale = (await params.requestLocale) as Locale;

  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});