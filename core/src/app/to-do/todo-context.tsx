'use client';

import { useState, useEffect, createContext, useCallback } from 'react';
import { getTodoList } from '@/lib/actions';

export type ListItemType = NonNullable<
  Awaited<ReturnType<typeof getTodoList>>['data']
>[number];

interface ContextType {
  todoList: ListItemType[];
  updateTodoList: () => void;
  listState: { pending: Boolean; error?: string };
  modalTodoId?: string;
  setModalTodoId: (id: string | undefined) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const ContextContent = createContext<ContextType>({
  todoList: [],
  updateTodoList: () => {},
  listState: { pending: true },
  modalTodoId: undefined,
  setModalTodoId: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
});

export function TodoContext({ children }: { children: React.ReactNode }) {
  const [todoList, setTodoList] = useState<ListItemType[]>([]);
  const [listState, setListState] = useState<{
    pending: Boolean;
    error?: string;
  }>({
    pending: true,
  });
  const [modalTodoId, setModalTodoId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateTodoList = useCallback(() => {
    setListState({ pending: true });
    getTodoList()
      .then((response) => {
        if (response.error) {
          setListState({ pending: false, error: response.error });
          return;
        }
        setListState({ pending: false });
        setTodoList(response.data || []);
      })
      .catch((error) => {
        setListState({
          pending: false,
          error: error?.message || 'Unexpected error',
        });
      });
  }, []);

  useEffect(() => {
    updateTodoList();
  }, [updateTodoList]);

  return (
    <ContextContent.Provider
      value={{
        todoList,
        updateTodoList,
        listState,
        modalTodoId,
        setModalTodoId,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </ContextContent.Provider>
  );
}
