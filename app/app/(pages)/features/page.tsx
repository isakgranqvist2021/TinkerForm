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
        <PageTitle className="mt-12 mb-12 text-center">
          Why Choose TinkerForm?
        </PageTitle>

        <FeatureCards className="flex gap-6 flex-wrap justify-center" />
      </Container>
    </Drawer>
  );
}
