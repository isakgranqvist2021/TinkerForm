'use client';

import Link from 'next/link';

interface CopyFormLinkProps {
  formId: string;
}

export function CopyFormLink(props: CopyFormLinkProps) {
  return (
    <p>
      Link to form:{' '}
      <Link className="link" href={`/form/${props.formId}`}>
        {window.location.origin}/form/{props.formId}
      </Link>
    </p>
  );
}
