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
        <PageTitle>Support Page</PageTitle>
      </Container>
    </Drawer>
  );
}
