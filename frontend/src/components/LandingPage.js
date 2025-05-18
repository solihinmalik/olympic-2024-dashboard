import React from 'react';

export default function LandingPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen text-center bg-white overflow-hidden">
      <img
        src="/background.png"
        alt="Olympic Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
      />
      <div className="z-10 space-y-4">
        <img src="/rings.png" alt="Olympic Rings" className="mx-auto w-48 h-36" />
        <h1 className="text-4xl font-bold text-gray-800">Olympic 2024</h1>
        <p className="text-lg text-gray-600">Olympic 2024 Paynet On-Site Assessment</p>
        <nav className="flex gap-6 justify-center text-gray-700 font-medium">
          <a href="/dashboard/athletes" className="hover:underline">Athletes</a>
          <a href="/dashboard/medals" className="hover:underline">Medals</a>
          <a href="/dashboard/sports" className="hover:underline">Sports</a>
        </nav>
      </div>
    </div>
  );
}
