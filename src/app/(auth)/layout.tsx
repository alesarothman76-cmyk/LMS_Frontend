// app/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication — LMS",
  description: "Sign in to the Digital Library Management System",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 bg-neutral-950"
      dir="ltr"
    >
      {/* Immersive background graphic */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url("https://tse3.mm.bing.net/th/id/OIP.eJ_SZ2utJKXASd6_NJFlKwHaE8?cb=thfvnextfalcon2&rs=1&pid=ImgDetMain&o=7&rm=3")`,
        }}
      />

      {/* Dark archival overlay mask to ensure form readability */}
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="relative bg-[#1e1b18]/95 border border-[#3a342c] rounded-lg shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#9c8465] to-transparent" />

          <div className="px-8 py-10">{children}</div>

          {/* Bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#3a342c] to-transparent" />
        </div>

        {/* Version badge */}
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#9c8465]/70">
          DLMS · Build 1.0.42
        </p>
      </div>
    </div>
  );
}