'use client';

import { useState, useEffect, createContext, useCallback } from 'react';
import { getTodoList } from '@/lib/actions';

export type ListItemType = NonNullable<
  Awaited<ReturnType<typeof getTodoList>>['data']
>[number];

interface ContextType {
  todoList: ListItemType[];
  tagList: string[];
  setSelectedTag: (tag: string | undefined) => void;
  setSearch: (tag: string | undefined) => void;
  checkedList: string[];
  setCheckedList: (list: string[]) => void;
  updateTodoList: (filter?: { tag?: string; search?: string }) => void;
  listState: { pending: Boolean; error?: string };
  modalTodoId?: string;
  setModalTodoId: (id: string | undefined) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const ContextContent = createContext<ContextType>({
  todoList: [],
  tagList: [],
  setSelectedTag: () => {},
  setSearch: () => {},
  checkedList: [],
  setCheckedList: () => {},
  updateTodoList: () => {},
  listState: { pending: true },
  modalTodoId: undefined,
  setModalTodoId: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
});

export function TodoContext({ children }: { children: React.ReactNode }) {
  const [todoList, setTodoList] = useState<ListItemType[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>();
  const [search, setSearch] = useState<string>();
  const [checkedList, setCheckedList] = useState<string[]>([]);
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
    getTodoList({ tag: selectedTag, search })
      .then((response) => {
        if (response.error) {
          setListState({ pending: false, error: response.error });
          return;
        }
        setListState({ pending: false });
        setTodoList(response.data || []);
        setTagList(response.tags || []);
      })
      .catch((error) => {
        setListState({
          pending: false,
          error: error?.message || 'Unexpected error',
        });
      });
  }, [selectedTag, search]);

  useEffect(() => {
    updateTodoList();
  }, [updateTodoList]);

  return (
    <ContextContent.Provider
      value={{
        todoList,
        tagList,
        setSelectedTag,
        setSearch,
        checkedList,
        setCheckedList,
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
