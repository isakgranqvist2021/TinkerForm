import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { Drawer } from 'components/drawer';
import { PageTitle } from 'components/page-title';
import { features } from 'constants/features';
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-7xl">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group card bg-base-100 border border-base-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
