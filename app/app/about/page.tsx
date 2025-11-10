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
        <PageTitle>About Us</PageTitle>
      </Container>
    </Drawer>
  );
}
