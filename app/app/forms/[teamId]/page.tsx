import { MapPinIcon } from '@heroicons/react/24/solid';
import { EmptyState } from 'components/empty-state';
import { ContentContainer, MainContainer } from 'containers/containers';
import Link from 'next/link';
import { getActiveFormsByTeamId } from 'services/api/team';
import { PageProps } from 'types/page';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Team Forms',
  description:
    'View all active forms, reports, and location-based surveys available for this team. Select a form below to get started.',
});

export default async function Page(props: PageProps<{ teamId: string }>) {
  const params = await props.params;

  const forms = await getActiveFormsByTeamId(params.teamId);

  if (!forms.length) {
    return (
      <MainContainer>
        <ContentContainer>
          <EmptyState
            title="No active forms"
            subtitle="This team does not have any active forms at the moment, check back later."
          />
        </ContentContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <ContentContainer>
        <div className="flex gap-6 justify-center flex-wrap">
          {forms.map((form) => (
            <Link
              href={`/forms/${params.teamId}/${form.id}`}
              key={form.id}
              className="hover-3d w-96"
            >
              <div className="flex flex-col items-between">
                <figure className="relative">
                  <img
                    src={form.coverImage}
                    alt={`${form.title} cover image`}
                    className="rounded"
                  />
                </figure>

                <div className="card-body">
                  <span className="flex items-start gap-2">
                    <MapPinIcon className="size-6 min-h-6 min-w-6 text-primary" />

                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {form.location}
                    </span>
                  </span>
                  <h2 className="card-title whitespace-nowrap overflow-hidden text-ellipsis block">
                    {form.title}
                  </h2>
                  <p className="line-clamp-2">
                    {form.description.replace(/<[^>]*>/g, ``)}
                  </p>

                  <div className="card-actions justify-end mt-2">
                    <button className="btn btn-neutral">Continue</button>
                  </div>
                </div>
              </div>

              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </Link>
          ))}
        </div>
      </ContentContainer>
    </MainContainer>
  );
}
