import { Drawer } from 'components/drawer';
import { PageTitle } from 'components/page-title';
import { Container } from 'containers/main-container';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Support Page',
  description: 'Get help and support for your TinkerForm account.',
});

export default function Page() {
  return (
    <Drawer>
      <Container>
        <PageTitle className="mb-4">Support &amp; FAQ</PageTitle>

        <div className="mb-8">
          <div className="collapse collapse-arrow bg-base-200 mb-2">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              How do I create a new form?
            </div>
            <div className="collapse-content">
              <p>
                Go to your dashboard and click &quot;Create New Form&quot;. Use
                the drag-and-drop builder to add sections and customize your
                form.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-200 mb-2">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              Can I see who responded to my form?
            </div>
            <div className="collapse-content">
              <p>
                You can view all responses in your dashboard. If you collect
                emails or other identifiers, those will be shown with each
                response.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-200 mb-2">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              What stats are available for my forms?
            </div>
            <div className="collapse-content">
              <p>
                Track views, responses, completion rate, and average completion
                time for each form you create.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-200 mb-2">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              Is my data secure?
            </div>
            <div className="collapse-content">
              <p>
                Yes, TinkerForm uses modern authentication and security
                standards to keep your data safe and private.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-200 mb-2">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              Do you offer a trial period?
            </div>
            <div className="collapse-content">
              <p>
                Please contact our support team for information about trial
                periods and special offers.
              </p>
            </div>
          </div>
        </div>
        <div className="alert alert-info">
          <span>
            Still have a question? Visit our{' '}
            <a href="/contact" className="link link-primary">
              Contact Page
            </a>{' '}
            and we&apos;ll be happy to help!
          </span>
        </div>
      </Container>
    </Drawer>
  );
}
