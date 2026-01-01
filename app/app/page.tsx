import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { Drawer } from 'components/drawer';
import { FeatureCards } from 'components/feature-cards';
import { PackageCards } from 'components/package-cards';
import Link from 'next/link';
import React from 'react';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Home',
  description: 'Build beautiful forms, fast and easily with TinkerForm.',
});

export default async function Page() {
  return (
    <Drawer>
      <Hero />

      <Pricing />

      <Features />
    </Drawer>
  );
}

function Features() {
  return (
    <div className="overflow-hidden w-full px-4 py-6 md:px-4 md:py-12 lg:px-4 lg:py-12 flex flex-col gap-4 bg-base-200">
      <h2 className="text-center text-3xl font-bold mb-4">
        Why Choose TinkerForm?
      </h2>

      <FeatureCards className="w-full flex flex-wrap gap-6 justify-center mx-auto max-w-7xl" />

      <Link href="/contact" className="text-center link mt-4">
        Missing a feature? Contact us!
      </Link>
    </div>
  );
}

function Pricing() {
  return (
    <div className="px-4 py-6 md:px-4 md:py-12 lg:px-4 lg:py-12 flex flex-col gap-4 bg-base-100">
      <h2 className="text-center text-3xl font-bold">Our Packages</h2>

      <div className="flex flex-col gap-8">
        <PackageCards className="flex flex-wrap flex-row!" />

        <Link href="/support" className="text-center link">
          Contact Support
        </Link>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="hero bg-base-200 py-12 md:py-18 lg:py-36 flex-grow">
      <div className="hero-content flex flex-col items-center text-center">
        <h1 className="flex flex-col text-5xl sm:text-6xl lg:text-7xl font-bold max-w-[18ch]">
          <span>Build beautiful forms</span>
          <span className="text-secondary">without hassle.</span>
        </h1>

        <p className="max-w-[48ch] text-base sm:text-xl mt-4">
          TinkerForm lets you quickly create, share, and track forms for any
          purpose—all from a simple, user-friendly dashboard.
        </p>

        <Link href="/dashboard/forms" className="btn btn-primary btn-lg mt-4">
          Try For Free
        </Link>
      </div>
    </div>
  );
}
