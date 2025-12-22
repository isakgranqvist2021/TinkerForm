import {
  BuildingStorefrontIcon,
  CurrencyEuroIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { Drawer } from 'components/drawer';
import { Container } from 'containers/containers';
import Link from 'next/link';
import React from 'react';
import { cn, getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Product',
  description: 'Discover our product offerings.',
});

type Icon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;

interface Feature {
  title: string;
  description: string;
  href: string;
  Icon: Icon;
  cta: string;
}

const features: Feature[] = [
  {
    title: 'What is TinkerForm?',
    description:
      'TinkerForm is a powerful and user-friendly form builder that allows you to create custom forms for various purposes, including surveys, feedback collection, event registrations, and more.',
    href: '/features',
    Icon: WrenchScrewdriverIcon,
    cta: 'Explore Features',
  },
  {
    title: 'Find top responses using AI',
    description:
      'Save hours of manual review by letting our AI analyze your submissions. Automatically match form data against your specific criteria to highlight the best candidates or most relevant feedback instantly.',
    href: '/dashboard/forms/ai-analysis',
    Icon: SparklesIcon,
    cta: 'Try AI analysis',
  },
  {
    title: 'Home page for your forms',
    description:
      "Automatically generate a professional landing page to showcase all your active forms in one place. Whether you're listing job openings or service requests, provide a centralized career-style hub for your applicants.",
    href: '/dashboard/forms/new',
    Icon: BuildingStorefrontIcon,
    cta: 'Create your first form',
  },
  {
    title: 'We value customization',
    description:
      'TinkerForm allows you to customize your forms to match your branding and style preferences. Choose from various themes, colors, and layouts to create a unique form experience for your users.',
    href: '/dashboard/forms/new',
    Icon: AdjustmentsHorizontalIcon,
    cta: 'Create your first form',
  },
  {
    title: 'What are the pricing plans?',
    description:
      'TinkerForm offers a free plan with essential features to get you started. For more advanced functionalities, we provide premium packages that include additional features such as advanced.',
    href: '/pricing',
    Icon: CurrencyEuroIcon,
    cta: 'See pricing options',
  },
];

export default function Page() {
  return (
    <Drawer>
      <div className="flex flex-col flex-grow">
        {features.map((feature, i) => {
          const isOdd = i % 2 !== 0;

          return (
            <div
              className={cn(
                'py-6 sm:py-16',
                isOdd ? 'bg-base-100' : 'bg-base-200',
              )}
              key={i}
            >
              <Container>
                <div className="flex flex-col gap-4 items-center text-center">
                  <feature.Icon
                    className={cn(
                      'size-12',
                      isOdd ? 'text-primary' : 'text-secondary',
                    )}
                  />

                  <h2
                    className={cn(
                      'text-3xl font-bold',
                      isOdd ? 'text-primary' : 'text-secondary',
                    )}
                  >
                    {feature.title}
                  </h2>

                  <p className="max-w-prose">{feature.description}</p>

                  <Link
                    href={feature.href}
                    className={cn(
                      'link',
                      isOdd ? 'link-primary' : 'link-secondary',
                    )}
                  >
                    {feature.cta}
                  </Link>
                </div>
              </Container>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
}
