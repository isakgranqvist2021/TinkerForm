import { Drawer } from 'components/drawer';
import { PageTitle } from 'components/page-title';
import { Container } from 'containers/main-container';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'About Us',
  description: 'Learn more about TinkerForm and our mission.',
});

export default function Page() {
  return (
    <Drawer>
      <Container>
        <PageTitle className="mb-4">About TinkerForm</PageTitle>

        <div className="mb-8">
          <div className="card bg-base-200 mb-6">
            <div className="card-body">
              <h2 className="card-title">Our Mission</h2>
              <p>
                TinkerForm was created to make form building simple, fast, and
                accessible for everyone. Our mission is to empower individuals
                and teams to collect information, feedback, and insights with
                ease—no technical skills required.
              </p>
            </div>
          </div>
          <div className="card bg-base-200 mb-6">
            <div className="card-body">
              <h2 className="card-title">Our Story</h2>
              <p>
                TinkerForm started as a small project to help people create
                forms without hassle. Today, it’s a growing platform trusted by
                businesses, educators, and creators for its simplicity and
                reliability.
              </p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Meet the Team</h2>
              <p>
                TinkerForm is built by passionate developers and designers who
                care about user experience and data privacy. We’re always
                working to improve and add new features based on your feedback.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Drawer>
  );
}
