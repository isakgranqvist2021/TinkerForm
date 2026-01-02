import { Drawer } from 'components/drawer';
import { PackageCards } from 'components/package-cards';
import { features } from 'constants/features';
import { sectionTypes } from 'models/form';
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
    <div className="hero bg-base-200 flex-grow">
      <div className="hero-content flex flex-col items-center text-center">
        <div className="flex flex-col items-center text-center pt-12 pb-8 md:pt-14 md:pb-10 lg:pt-32 lg:pb-28">
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

        <div className="pb-8 flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center gap-2 bg-success/10 text-success border border-success/20 rounded-full px-4 py-1.5 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">
              Form live in <span className="font-bold text-success">60s</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-base-100/50 border border-base-300 rounded-full px-4 py-1.5 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-secondary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
            <span className="text-sm font-medium">
              <span className="font-bold">{sectionTypes.length}+</span>{' '}
              components
            </span>
          </div>

          <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 shadow-sm animate-pulse-slow">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-[10px]">
              AI matching responses
            </span>
          </div>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-7xl">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group card bg-base-100 border border-base-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="card-body p-8">
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="size-6" />
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              <p className="text-base-content/70 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
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
