import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ChartBarSquareIcon,
  InformationCircleIcon,
  SunIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import { Theme } from 'config/theme';
import { sectionTypes } from 'models/form';

export function FeatureCards(props: React.ComponentProps<'div'>) {
  return (
    <div className="flex gap-6 flex-wrap" {...props}>
      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <WrenchIcon className="size-12 text-primary mb-2" />

          <p>
            Pick from {sectionTypes.length} different section types to build
            your form. Such as multiple choice, file upload, and more.
          </p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <AdjustmentsHorizontalIcon className="size-12 text-primary mb-2" />

          <p>
            Control when your form should end by setting a submission limit or
            an end date.
          </p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <SunIcon className="size-12 text-primary mb-2" />

          <p>
            Style your form with a cover image and pick from one of our{' '}
            {Object.keys(Theme).length} themes.
          </p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <ChartBarSquareIcon className="size-12 text-primary mb-2" />

          <p>
            Analyze responses with AI and compare answers using charts and
            graphs.
          </p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <ArrowDownTrayIcon className="size-12 text-primary mb-2" />

          <p>Export your form responses as CSV for easy analysis and sharing</p>
        </div>
      </div>

      <div className="w-96 card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <InformationCircleIcon className="size-12 text-primary mb-2" />
          <p>
            Get help and support whenever you need it with our dedicated
            customer service.
          </p>
        </div>
      </div>
    </div>
  );
}
