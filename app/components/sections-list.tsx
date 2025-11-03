'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  closestCenter,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  closeAddSectionModal,
  openAddSectionModal,
  SectionFormModal,
} from './section-form-modal';
import { Form, Section } from 'models/form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  getSectionDefaultValues,
  useSectionFormContext,
} from './section-form-modal';
import React from 'react';
import { EmptyState } from './empty-state';

export function SectionsList() {
  const sectionFormContext = useSectionFormContext();
  const formContext = useFormContext<Form>();
  const fieldArray = useFieldArray<Form>({
    name: 'sections',
  });

  const sections = fieldArray.fields;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((item) => item.id === active.id);
      const newIndex = sections.findIndex((item) => item.id === over?.id);

      fieldArray.move(oldIndex, newIndex);
    }
  };

  const handleSubmit = (section: Section) => {
    if (sectionFormContext.mode === 'add') {
      fieldArray.append({
        ...section,
        id: crypto.randomUUID(),
        index: fieldArray.fields.length,
      });
    } else {
      const index = fieldArray.fields.findIndex(
        (s) => s.id === sectionFormContext.defaultValues.id,
      );
      fieldArray.update(index, section);
    }

    closeAddSectionModal();
  };

  const openAddSectionModalAndSetValues = () => {
    if (formContext.formState.isSubmitting) return;

    openAddSectionModal();
    sectionFormContext.setMode('add');
    sectionFormContext.setDefaultValues(getSectionDefaultValues('text'));
  };

  return (
    <React.Fragment>
      <SectionFormModal onSubmit={handleSubmit} />

      <div>
        <div className="mb-4">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-bold">2. Sections</h3>
              <p>Add sections to your form that the user can fill out.</p>
            </div>

            {sections.length > 0 && (
              <div className="tooltip" data-tip="Add Section">
                <button
                  className="btn btn-circle btn-accent"
                  onClick={openAddSectionModalAndSetValues}
                >
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
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {formContext.formState.errors.sections && (
            <p className="text-sm text-error mt-2">
              {formContext.formState.errors.sections.message}
            </p>
          )}
        </div>

        {sections.length > 0 ? (
          <div className="flex-grow">
            <ul className="list bg-base-100 rounded-box shadow-md">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, index) => (
                    <ListItem
                      key={section.id}
                      section={section}
                      index={index}
                      onDelete={() => {
                        fieldArray.remove(index);
                      }}
                      onDuplicate={() =>
                        fieldArray.append({
                          ...section,
                          title: 'Copy of ' + section.title,
                          id: crypto.randomUUID(),
                          index: fieldArray.fields.length,
                        })
                      }
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </ul>
          </div>
        ) : (
          <EmptyState
            title="No sections added yet"
            subtitle="Add sections to your form to start collecting information."
            cta={
              <button
                className="btn btn-outline"
                onClick={openAddSectionModalAndSetValues}
              >
                Add Section
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
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            }
          />
        )}
      </div>
    </React.Fragment>
  );
}

interface ListItemProps {
  section: Section;
  index: number;
  onDelete: () => void;
  onDuplicate: () => void;
}
function ListItem(props: ListItemProps) {
  const sectionFormContext = useSectionFormContext();
  const formContext = useFormContext<Form>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className="list-row justify-between flex"
      ref={setNodeRef}
      style={style}
      {...attributes}
      aria-describedby="Draggable"
    >
      <div>
        <div>
          {props.index + 1}. {props.section.title}
        </div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {props.section.description}
        </div>
      </div>

      <div className="flex">
        <div className="tooltip" data-tip="Move">
          <button
            disabled={formContext.formState.isSubmitting}
            className={
              'btn btn-square btn-ghost ' + (isDragging ? 'cursor-grab' : '')
            }
            {...listeners}
          >
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
                d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
              />
            </svg>
          </button>
        </div>

        <div className="tooltip" data-tip="Duplicate">
          <button
            disabled={formContext.formState.isSubmitting}
            className="btn btn-square btn-ghost"
            onClick={props.onDuplicate}
          >
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
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          </button>
        </div>
        <div className="tooltip" data-tip="Edit">
          <button
            disabled={formContext.formState.isSubmitting}
            className="btn btn-square btn-ghost"
            onClick={() => {
              sectionFormContext.setDefaultValues(props.section);
              sectionFormContext.setMode('edit');
              openAddSectionModal();
            }}
          >
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>

        <div className="tooltip" data-tip="Delete">
          <button
            disabled={formContext.formState.isSubmitting}
            className="btn btn-square btn-ghost"
            onClick={props.onDelete}
          >
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
