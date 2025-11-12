import { Drawer } from 'components/drawer';
import { PageTitle } from 'components/page-title';
import { Container } from 'containers/main-container';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Features',
  description: 'Explore the features of TinkerForm.',
});

export default function Page() {
  return (
    <Drawer>
      <Container>
        <PageTitle className="mb-4">Form Section Types</PageTitle>

        <div className="mb-6">
          <div className="alert alert-info mb-4">
            <span>
              TinkerForm lets you build forms using a variety of section types.
              Mix and match these to collect the information you need!
            </span>
          </div>

          <div className="card bg-base-200 mb-4">
            <div className="card-body">
              <h2 className="card-title">Response Table &amp; Stats</h2>
              <p>
                As a form creator, you can view all responses in a clear table
                and track important statistics:
              </p>
              <ul className="list-disc ml-6">
                <li>
                  <strong>Views</strong>: See how many times your form has been
                  viewed.
                </li>
                <li>
                  <strong>Responses</strong>: Track the number of submissions
                  received.
                </li>
                <li>
                  <strong>Average Completion Time</strong>: Monitor how long it
                  takes users to complete your form.
                </li>
                <li>
                  <strong>Completion Rate</strong>: Measure the percentage of
                  users who finish your form.
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Text</h2>
                <p>Collect short or long text answers from your users.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Link</h2>
                <p>Request a URL or website address from your users.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Phone</h2>
                <p>Let users enter their phone number in a validated format.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Email</h2>
                <p>Collect email addresses with built-in validation.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">File</h2>
                <p>Allow users to upload files and documents securely.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Range</h2>
                <p>
                  Let users select a value within a specified range (e.g.,
                  1–10).
                </p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Boolean</h2>
                <p>Simple yes/no or true/false questions for quick answers.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Multiple Choice</h2>
                <p>Present a list of options for users to choose from.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Drawer>
  );
}
