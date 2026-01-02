'use client';

import { useAcceptCookies } from 'hooks/use-accept-cookies';
import React from 'react';

interface CookieBannerProps {
  isOpen: boolean;
}
export function CookieBanner(props: CookieBannerProps) {
  const [isOpen, setIsOpen] = React.useState(props.isOpen);

  const acceptCookies = useAcceptCookies();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-slate-900/20 backdrop-blur-sm">
      <div className="w-full bg-base-100 border-t border-base-200 shadow-2xl p-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <span className="text-3xl">🍪</span>
            <div>
              <h3 className="text-lg font-bold text-base-content">
                A quick note on cookies
              </h3>
              <p className="text-sm text-base-content/70">
                By continuing to use this site, you agree that we store cookies
                to improve your experience and analyze our traffic.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              className="btn btn-primary px-10 rounded-xl w-full sm:w-auto order-1 sm:order-2"
              onClick={() => {
                setIsOpen(false);
                acceptCookies.trigger();
              }}
            >
              Sounds good!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
