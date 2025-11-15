import { Drawer } from 'components/drawer';
import { PageTitle } from 'components/page-title';
import { Container } from 'containers/main-container';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Product Page',
  description: 'Discover our product offerings.',
});

export default function Page() {
  return (
    <Drawer>
      <Container>
        <PageTitle className="mb-4">What is TinkerForm?</PageTitle>

        <div className="mb-6">
          <div className="alert alert-info mb-4">
            <span>
              TinkerForm is a modern platform for building, sharing, and
              managing forms online. Whether you need feedback, surveys,
              registrations, or quizzes, TinkerForm makes it fast and easy.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Drag-and-Drop Form Builder</h2>
                <p>
                  Create beautiful forms in minutes with our intuitive
                  drag-and-drop interface. No coding required!
                </p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Secure &amp; Private</h2>
                <p>
                  Your data is protected with industry-standard security and
                  authentication measures, ensuring peace of mind for you and
                  your users.
                </p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Real-Time Response Management</h2>
                <p>
                  View, filter, and analyze responses instantly from your
                  dashboard. Easily keep track of submissions and activity.
                </p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">AI Powered Response Scoring</h2>
                <p>
                  Automatically evaluate and score form responses using advanced
                  AI algorithms. Gain insights into the quality and relevance of
                  submissions, helping you make informed decisions quickly and
                  efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200 mb-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            Who is TinkerForm for?
          </div>
          <div className="collapse-content">
            <ul className="list-disc ml-6">
              <li>Businesses collecting customer feedback</li>
              <li>Educators creating quizzes and surveys</li>
              <li>Event organizers managing registrations</li>
              <li>Developers needing quick form solutions</li>
            </ul>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            Why choose TinkerForm?
          </div>
          <div className="collapse-content">
            <ul className="list-disc ml-6">
              <li>Fast, user-friendly form creation</li>
              <li>Secure authentication and data storage</li>
              <li>Responsive dashboard for managing everything in one place</li>
            </ul>
          </div>
        </div>
      </Container>
    </Drawer>
  );
}
