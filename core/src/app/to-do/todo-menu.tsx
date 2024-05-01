'use client';

import { useContext } from 'react';
import { ContextContent } from './todo-context';

export function TodoMenu() {
  const { setModalTodoId } = useContext(ContextContent);
  return (
    <button
      className="btn btn-outline btn-primary"
      onClick={() => {
        setModalTodoId(undefined);
        (document.getElementById('todoModal') as any).showModal();
      }}
    >
      +New
    </button>
  );
}
