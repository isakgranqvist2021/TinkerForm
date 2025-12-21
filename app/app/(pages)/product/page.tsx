import {
  BuildingStorefrontIcon,
  CurrencyEuroIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { Drawer } from 'components/drawer';
import { Container } from 'containers/main-container';
import Link from 'next/link';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Product',
  description: 'Discover our product offerings.',
});

export default function Page() {
  return (
    <Drawer>
      <div className="flex flex-col flex-grow">
        <div className="bg-base-200 py-6 sm:py-16">
          <Container>
            <div className="flex flex-col gap-4 items-center text-center">
              <WrenchScrewdriverIcon className="size-12 text-primary" />

              <h2 className="text-3xl font-bold text-primary">
                What is TinkerForm?
              </h2>

              <p className="max-w-prose">
                TinkerForm is a powerful and user-friendly form builder that
                allows you to create custom forms for various purposes,
                including surveys, feedback collection, event registrations, and
                more.
              </p>

              <Link href="/features" className="link link-primary">
                Explore Features
              </Link>
            </div>
          </Container>
        </div>

        <div className="bg-base-100 py-6 sm:py-16">
          <Container>
            <div className="flex flex-col gap-4 items-center text-center">
              <BuildingStorefrontIcon className="size-12 text-secondary" />

              <h2 className="text-3xl font-bold text-secondary">
                Home page for your forms
              </h2>

              <p className="max-w-prose">
                Automatically generate a professional landing page to showcase
                all your active forms in one place. Whether you're listing job
                openings or service requests, provide a centralized career-style
                hub for your applicants.
              </p>

              <Link href="/dashboard/forms/new" className="link link-secondary">
                Create your first form
              </Link>
            </div>
          </Container>
        </div>

        <div className="bg-base-200 py-6 sm:py-16">
          <Container>
            <div className="flex flex-col gap-4 items-center text-center">
              <AdjustmentsHorizontalIcon className="size-12 text-primary" />

              <h2 className="text-3xl font-bold text-primary">
                We value customization
              </h2>

              <p className="max-w-prose">
                TinkerForm allows you to customize your forms to match your
                branding and style preferences. Choose from various themes,
                colors, and layouts to create a unique form experience for your
                users.
              </p>

              <Link href="/dashboard/forms/new" className="link link-primary">
                Create your first form
              </Link>
            </div>
          </Container>
        </div>

        <div className="bg-base-100 py-6 sm:py-16">
          <Container>
            <div className="flex flex-col gap-4 items-center text-center">
              <CurrencyEuroIcon className="size-12 text-secondary" />

              <h2 className="text-3xl font-bold text-secondary">
                What are the pricing plans?
              </h2>

              <p className="max-w-prose">
                TinkerForm offers a free plan with essential features to get you
                started. For more advanced functionalities, we provide premium
                packages that include additional features such as advanced
              </p>

              <Link href="/pricing" className="link link-secondary">
                See pricing options
              </Link>
            </div>
          </Container>
        </div>
      </div>
    </Drawer>
  );
}
