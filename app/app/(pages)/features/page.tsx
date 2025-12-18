import { Drawer } from 'components/drawer';
import { FeatureCards } from 'components/feature-cards';
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
        <PageTitle className="mt-4 mb-6">Why Choose TinkerForm?</PageTitle>

        <FeatureCards />
      </Container>
    </Drawer>
  );
}
