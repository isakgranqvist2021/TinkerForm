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
      <div>
        <h1 className="m-0 text-lg font-bold">{form.title}</h1>
        <p className="m-0 whitespace-pre-wrap max-w-prose">
          {form.description}
        </p>
      </div>

      {mappedSections.map((section) => {
        switch (section.type) {
          case 'text':
          case 'link':
            return (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{section.title}</legend>
                <input
                  placeholder="Your answer"
                  type="text"
                  className="input"
                />
                <p className="label">{section.description}</p>
              </fieldset>
            );

          case 'email':
            return (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{section.title}</legend>
                <input
                  placeholder="Your answer"
                  type="email"
                  className="input"
                />
                <p className="label">{section.description}</p>
              </fieldset>
            );

          case 'phone':
            return (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{section.title}</legend>
                <input placeholder="Your answer" type="tel" className="input" />
                <p className="label">{section.description}</p>
              </fieldset>
            );
        }
      })}

      <button className="btn btn-primary w-fit">Submit</button>
    </MainContainer>
  );
}
