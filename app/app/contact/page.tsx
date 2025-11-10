import { Drawer } from 'components/drawer';
import { PageTitle } from 'components/page-title';
import { Container } from 'containers/main-container';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Contact Us',
  description: 'Get in touch with TinkerForm.',
});

export default function Page() {
  return (
    <Drawer>
      <Container>
        <PageTitle>Contact Us</PageTitle>
      </Container>
    </Drawer>
  );
}
