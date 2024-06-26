'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { ContextContent, type ListItemType } from './todo-context';
import { getFileUrl } from '@/app/api/file/helper';
import { PhotoIcon } from '@heroicons/react/16/solid';

export function TodoList() {
  const { listState, todoList, checkedList, setCheckedList } =
    useContext(ContextContent);
  const allChecked = checkedList.length === todoList.length;
  const onCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedList(e.target.checked ? todoList.map((item) => item.id) : []);
  };

  return (
    <div className="mt-2 w-full overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={allChecked}
                  onChange={onCheckAll}
                />
              </label>
            </th>
            <th>Title</th>
            <th>Details</th>
            <th>Completed?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listState.pending ? (
            <tr>
              <td colSpan={5}>
                <div className="flex justify-center">
                  <span className="loading loading-ring loading-lg"></span>
                </div>
              </td>
            </tr>
          ) : listState.error ? (
            <tr>
              <td colSpan={5} className="text-center text-red-500">
                {listState.error}
              </td>
            </tr>
          ) : todoList && todoList.length > 0 ? (
            todoList.map((item) => <ListItem key={item.id} item={item} />)
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                Nothing here yet, add some task!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ListItem({ item }: { item: ListItemType }) {
  const { setModalTodoId, setIsModalOpen, checkedList, setCheckedList } =
    useContext(ContextContent);
  const isChecked = checkedList.includes(item.id);
  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedList(
      e.target.checked
        ? [...checkedList, item.id]
        : checkedList.filter((id) => id !== item.id),
    );
  };
  return (
    <tr>
      <th>
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={isChecked}
            onChange={onCheck}
          />
        </label>
      </th>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              {item.image?.id ? (
                <Image
                  src={getFileUrl(item.image.id, true)}
                  alt="Todo List Avatar"
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              ) : (
                <PhotoIcon className="h-full w-full" />
              )}
            </div>
          </div>
          <div>
            <div className="font-bold">{item.title}</div>
            {item.tag && (
              <span className="badge badge-ghost badge-sm">{item.tag}</span>
            )}
          </div>
        </div>
      </td>
      <td>{item.details}</td>
      <td>{item.completed ? 'true' : 'false'}</td>
      <th>
        <button
          className="btn btn-ghost btn-xs"
          onClick={() => {
            setModalTodoId(item.id);
            setIsModalOpen(true);
          }}
        >
          Details
        </button>
      </th>
    </tr>
  );
}
