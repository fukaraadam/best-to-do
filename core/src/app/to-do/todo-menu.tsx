'use client';

import { useContext } from 'react';
import { ContextContent } from './todo-context';

export function TodoMenu() {
  const { tagList, setSelectedTag, setSearch, setModalTodoId, setIsModalOpen } =
    useContext(ContextContent);
  const onTagChange = (e: any) => {
    setSelectedTag(e.target.value === 'All Tags' ? undefined : e.target.value);
  };
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center">
      <div className="join">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => {
            setModalTodoId(undefined);
            setIsModalOpen(true);
          }}
        >
          +New
        </button>
        <button
          className="btn btn-outline btn-error"
          onClick={() => {
            setModalTodoId(undefined);
            setIsModalOpen(true);
          }}
          disabled
        >
          Delete
        </button>
      </div>
      <select
        className="select max-w-xs"
        onChange={onTagChange}
        defaultValue="All Tags"
      >
        <option>All Tags</option>
        {tagList.map((tag) => (
          <option key={tag}>{tag}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search"
        className="input input-bordered max-w-xs"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
