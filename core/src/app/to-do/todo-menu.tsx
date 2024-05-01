'use client';

import { useContext } from 'react';
import { ContextContent } from './todo-context';

export function TodoMenu() {
  const { setModalTodoId, setIsModalOpen } = useContext(ContextContent);
  return (
    <button
      className="btn btn-outline btn-primary mt-4"
      onClick={() => {
        setModalTodoId(undefined);
        setIsModalOpen(true);
      }}
    >
      +New
    </button>
  );
}
