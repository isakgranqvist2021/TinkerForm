'use client';

import { Section } from 'models/form';
import {
  ControlledBooleanInput,
  ControlledFileInput,
  ControlledInput,
  ControlledRangeInput,
  ControlledSelect,
  ControlledTextarea,
} from 'components/inputs';

import React from 'react';
import { ContentContainer, MainContainer } from 'containers/containers';

interface AnswerFormContentProps {
  sections: Section[];
  hasResponded: boolean;
  disabled: boolean;

  coverImage: string | null;
  title: string;
  location: string;
  description: string;
}

export function AnswerFormContent(props: AnswerFormContentProps) {
  return (
    <React.Fragment>
      {props.coverImage && (
        <img
          src={props.coverImage}
          className="w-full h-96 mb-8 object-cover"
          alt="Cover image"
        />
      )}

      <MainContainer>
        <ContentContainer className="w-[760px] max-w-full gap-8">
          <div>
            <div className="flex justify-between">
              <div className="mb-4">
                <h1 className="m-0 mb-2 text-xl font-bold">{props.title}</h1>

                {props.location.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>

                    <p>{props.location}</p>
                  </div>
                )}
              </div>
            </div>

            <p
              className="m-0 whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: props.description }}
            ></p>
          </div>

          <div className="divider"></div>

          {props.hasResponded ? (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <p className="font-medium">Thank you for your response!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 pb-12">
              {props.sections
                .sort((a, b) => a.index - b.index)
                .map((section) => {
                  switch (section.type) {
                    case 'text':
                      if (section.max > 200) {
                        return (
                          <ControlledTextarea
                            name={section.id}
                            label={section.title}
                            placeholder="Your answer"
                            description={section.description}
                            key={section.id}
                            disabled={props.disabled}
                            minLength={section.min}
                            maxLength={section.max}
                          />
                        );
                      }

                      return (
                        <ControlledInput
                          name={section.id}
                          label={section.title}
                          placeholder="Your answer"
                          description={section.description}
                          key={section.id}
                          disabled={props.disabled}
                          minLength={section.min}
                          maxLength={section.max}
                        />
                      );

                    case 'link':
                      return (
                        <ControlledInput
                          name={section.id}
                          label={section.title}
                          placeholder="Your answer"
                          description={section.description}
                          key={section.id}
                          disabled={props.disabled}
                        />
                      );

                    case 'email':
                      return (
                        <ControlledInput
                          name={section.id}
                          label={section.title}
                          type="email"
                          placeholder="Your answer"
                          description={section.description}
                          key={section.id}
                          disabled={props.disabled}
                        />
                      );

                    case 'phone':
                      return (
                        <ControlledInput
                          name={section.id}
                          label={section.title}
                          type="tel"
                          placeholder="Your answer"
                          description={section.description}
                          key={section.id}
                          disabled={props.disabled}
                        />
                      );

                    case 'file':
                      return (
                        <ControlledFileInput
                          name={section.id}
                          label={section.title}
                          description={section.description}
                          key={section.id}
                          disabled={props.disabled}
                        />
                      );

                    case 'range':
                      return (
                        <ControlledRangeInput
                          name={section.id}
                          label={section.title}
                          description={section.description}
                          key={section.id}
                          disabled={props.disabled}
                          min={section.min}
                          max={section.max}
                        />
                      );

                    case 'boolean':
                      return (
                        <ControlledBooleanInput
                          name={section.id}
                          label={section.title}
                          description={section.description}
                          key={section.id}
                          disabled={props.disabled}
                        />
                      );

                    case 'multiple-choice':
                      return (
                        <ControlledSelect
                          name={section.id}
                          label={section.title}
                          description={section.description}
                          key={section.id}
                          disabled={props.disabled}
                          options={section.options.map((option) => ({
                            value: option.text,
                            label: option.text,
                          }))}
                        />
                      );
                  }
                })}

              <button
                className="btn btn-primary w-fit mt-4 ml-auto block flex gap-2"
                disabled={props.disabled}
              >
                Send
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          )}
        </ContentContainer>
      </MainContainer>
    </React.Fragment>
  );
}
