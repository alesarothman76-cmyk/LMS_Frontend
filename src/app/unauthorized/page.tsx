// src/app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600">401 - غير مصرح بالدخول</h1>
      <p className="mt-4 text-gray-600">عذراً، لا تملك الصلاحية للوصول إلى هذه الصفحة.</p>
      <a href="/login" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">
        العودة لتسجيل الدخول
      </a>
    </div>
  );
} 