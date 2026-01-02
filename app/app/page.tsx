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

      <HowItWorks />

      <Features />

      <Pricing />
    </Drawer>
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
          Create, share, and track forms for any purpose—all from a simple,
          user-friendly dashboard with AI powered analysis.
        </p>

        <Link
          href="/dashboard/forms"
          className="btn btn-primary btn-lg px-12 rounded-full shadow-lg hover:scale-105 transition-transform mt-8"
        >
          Try For Free
          <span className="font-normal opacity-80 sm:flex hidden">
            — No credit card required
          </span>
        </Link>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Sign up & create',
      desc: 'Get a dedicated page for all your forms—perfect for listing jobs without a career site.',
      badge: 'Quick Setup',
    },
    {
      number: '2',
      title: 'Share & Collect',
      desc: 'Distribute your link and track views, completions, and drop-off rates in real-time.',
      badge: 'Real-time Docs',
    },
    {
      number: '3',
      title: 'AI Analysis',
      desc: 'Let AI match responses against your requirements and rank the best candidates automatically.',
      badge: 'Smart Sorting',
    },
  ];

  return (
    <section className="bg-base-200/50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            How it works
          </h2>
          <p className="text-lg opacity-70 max-w-xl mx-auto">
            From creation to deep insights in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-all duration-300 group"
            >
              <div className="card-body gap-4">
                <div className="flex justify-between items-start">
                  <span className="text-5xl font-black text-primary group-hover:text-primary transition-colors">
                    0{step.number}
                  </span>
                  <div className="badge badge-primary badge-outline">
                    {step.badge}
                  </div>
                </div>

                <h3 className="card-title text-xl font-bold">{step.title}</h3>
                <p className="text-base-content/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/dashboard/forms"
            className="btn btn-primary btn-lg px-12 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Try For Free
            <span className="font-normal opacity-80 sm:flex hidden">
              — No credit card required
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <div className="overflow-hidden w-full py-20 px-4 flex flex-col gap-4 bg-base-200">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Why Choose TinkerForm?
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
          Powerful tools to help you collect, manage, and analyze responses at
          scale.
        </p>
      </div>

      <FeatureCards className="w-full flex flex-wrap gap-6 justify-center mx-auto max-w-7xl" />
    </div>
  );
}

function Pricing() {
  return (
    <div className="py-20 px-4 flex flex-col gap-4 bg-base-200/50">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Our Packages
        </h2>
        <p className="text-lg opacity-70 max-w-xl mx-auto">
          Simple, transparent pricing that scales with your business. Start for
          free and upgrade as you grow.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <PackageCards className="flex flex-wrap flex-row!" />

        <Link href="/support" className="text-center link">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
