import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { Drawer } from 'components/drawer';
import { FeatureCards } from 'components/feature-cards';
import { PageTitle } from 'components/page-title';
import { Container } from 'containers/containers';
import Link from 'next/link';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Features',
  description: 'Explore the features of TinkerForm.',
});

export default function Page() {
  return (
    <Drawer>
      <Container>
        <PageTitle className="mt-12 mb-12 text-center">
          Why Choose TinkerForm?
        </PageTitle>

        <FeatureCards className="flex gap-6 flex-wrap justify-center" />

        <div className="flex justify-center my-12">
          <Link
            href="/dashboard/forms"
            className="btn btn-primary mx-auto w-fit"
          >
            Get Started
            <ArrowRightCircleIcon className="size-6" />
          </Link>
        </div>
      </Container>
    </Drawer>
  );
}
