import { MainContainer } from 'containers/main-container';
import { sectionMapper } from 'db/mapper';
import { findFormById, listSectionsByFormId } from 'db/query';
import { PageProps } from 'types/page';

export async function generateMetadata(props: PageProps<{ id: string }>) {
  const params = await props.params;
  const form = await findFormById(params.id);

  return {
    title: form ? form.title : 'Form',
  };
}

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const form = await findFormById(params.id);
  if (!form) {
    return <MainContainer>Form not found</MainContainer>;
  }

  const sections = await listSectionsByFormId(form.id);
  const mappedSections = sections.map(sectionMapper);

  return (
    <MainContainer>
      <h1>{form.title}</h1>
      <p className="whitespace-pre-wrap">{form.description}</p>

      {mappedSections.map((section) => {
        switch (section.type) {
          case 'text':
            return (
              <section key={section.id}>
                <h2 className="font-bold mb-2">{section.title}</h2>

                <input
                  required={section.required}
                  key={section.id}
                  className="input input-bordered w-full mb-4"
                />
              </section>
            );
        }
      })}

      <button className="btn btn-primary">Submit</button>
    </MainContainer>
  );
}
