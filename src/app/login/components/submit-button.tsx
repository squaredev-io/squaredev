'use client';

import { useCallback, useRef, useState } from 'react';

const useFormState = (formAction: any) => {};

export default function SubmitButton() {
  const [node, setNode] = useState<HTMLButtonElement | null>(null);
  const ref = useCallback((newNode: HTMLButtonElement) => {
    setNode(newNode);

    return newNode;
  }, []);

  if (typeof window !== 'undefined' && node) {
    // Find the first form element
    const form = node.closest('form');
  }

  return (
    <button ref={ref} type="submit">
      Create Account
    </button>
  );
}
