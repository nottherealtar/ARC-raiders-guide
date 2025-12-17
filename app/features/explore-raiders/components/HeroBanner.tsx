'use client';

import Link from 'next/link';

export function HeroBanner() {
  return (
    <Link
      href="/"
      className="group relative block overflow-hidden rounded-lg w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-300 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ aspectRatio: '150/30' }}
      aria-label="Arc Raiders - Welcome to the guide"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-3 md:p-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 transition-transform duration-300 group-hover:translate-x-2">
          Arc Raiders
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-200">
          Your complete guide to survival and strategy
        </p>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-lg transition-colors duration-300" />
    </Link>
  );
}
