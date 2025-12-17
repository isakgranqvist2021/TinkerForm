import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ChartBarSquareIcon,
  SunIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import { Drawer } from 'components/drawer';
import { PageTitle } from 'components/page-title';
import { Theme } from 'config/theme';
import { Container } from 'containers/main-container';
import { sectionTypes } from 'models/form';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Features',
  description: 'Explore the features of TinkerForm.',
});

export default function Page() {
  return (
    <Drawer>
      <Container>
        <PageTitle className="mt-4 mb-6">What can TinkerForm do?</PageTitle>

        <Cards />
      </Container>
    </Drawer>
  );
}

function Cards() {
  return (
    <div className="flex gap-6 flex-wrap">
      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body">
          <WrenchIcon className="size-12 text-primary" />

          <p>
            Pick from {sectionTypes.length} different section types to build
            your form. Such as multiple choice, text input, file upload, and
            more.
          </p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body">
          <AdjustmentsHorizontalIcon className="size-12 text-primary" />

          <p>
            Control when your form should end by setting a submission limit or
            an end date.
          </p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body">
          <SunIcon className="size-12 text-primary" />

          <p>
            Style your form with a cover image and pick from one of our{' '}
            {Object.keys(Theme).length} themes.
          </p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body">
          <ChartBarSquareIcon className="size-12 text-primary" />

          <p>
            Analyze responses with AI and compare answers using charts and
            graphs.
          </p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body">
          <ArrowDownTrayIcon className="size-12 text-primary" />

          <p>Export your form responses as CSV for easy analysis and sharing</p>
        </div>
      </div>
    </div>
  );
}
