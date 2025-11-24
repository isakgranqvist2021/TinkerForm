import { test, expect, describe } from 'vitest';
import { AnswerForm } from './form';
import { render, screen } from '@testing-library/react';
import { Theme } from 'config/theme';

test('Something', () => {
  describe('renders the App component', () => {
    const coverImageSrc = 'https://img.com';

    render(
      <AnswerForm
        response={{
          id: crypto.randomUUID(),

          createdAt: Date.now().toLocaleString(),
          updatedAt: Date.now().toLocaleString(),

          fkFormId: crypto.randomUUID(),
          completedAt: null,

          reasoning: null,
          score: null,
        }}
        form={{
          id: crypto.randomUUID(),
          createdAt: Date.now().toLocaleString(),
          updatedAt: Date.now().toLocaleString(),

          title: '',
          description: '',
          coverImage: coverImageSrc,
          email: '',
          location: '',

          responseCount: 10,
          theme: Theme.autumn,
        }}
        sections={[]}
      />,
    );

    expect(screen.getByTestId('answer-form')).toBeDefined();
  });
});
