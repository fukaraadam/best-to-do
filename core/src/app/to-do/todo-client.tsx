'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { getTodoList, onCreateTodoItem } from '@/lib/actions';
import { PhotoIcon } from '@heroicons/react/16/solid';

type ListItemType = NonNullable<
  Awaited<ReturnType<typeof getTodoList>>['data']
>[number];

export function TodoList() {
  const [todoList, setTodoList] = useState<ListItemType[]>([]);
  const [state, setState] = useState<{ pending: Boolean; error?: string }>({
    pending: true,
  });
  useEffect(() => {
    getTodoList()
      .then((response) => {
        if (response.error) {
          setState({ pending: false, error: response.error });
          return;
        }
        setState({ pending: false });
        setTodoList(response.data || []);
      })
      .catch((error) => {
        setState({
          pending: false,
          error: error?.message || 'Unexpected error',
        });
      });
  }, []);
  return (
    <div className="mt-2 w-full overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Title</th>
            <th>Details</th>
            <th>Completed?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {state.pending ? (
            <tr>
              <td colSpan={5}>
                <div className="flex justify-center">
                  <span className="loading loading-ring loading-lg"></span>
                </div>
              </td>
            </tr>
          ) : state.error ? (
            <tr>
              <td colSpan={5} className="text-center text-red-500">
                {state.error}
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
  return (
    <tr>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              {item.image?.id ? (
                <Image
                  src={`/api/file?${new URLSearchParams({ fileId: item.image.id, isImage: 'true' })}`}
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
            {item.tags.map((tag, index) => (
              <span key={index} className="badge badge-ghost badge-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </td>
      <td>{item.details}</td>
      <td>{item.completed ? 'true' : 'false'}</td>
      <th>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </th>
    </tr>
  );
}

export function TodoMenu() {
  const [state, action] = useFormState(onCreateTodoItem, null);

  return (
    <>
      <button
        className="btn btn-outline btn-primary"
        onClick={() =>
          (document.getElementById('newTodoModal') as any).showModal()
        }
      >
        +New
      </button>
      <dialog id="newTodoModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-neutral absolute right-2 top-2 z-50">
              ✕
            </button>
          </form>

          <form action={action}>
            <div className="card lg:card-side bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
                  alt="Album"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="input input-bordered w-full max-w-xs"
                  />
                </h2>
                <p>
                  <textarea
                    placeholder="Details"
                    name="details"
                    className="textarea textarea-bordered textarea-xs w-full max-w-xs"
                  ></textarea>
                </p>
                <div className="card-actions justify-end">
                  <CreateSubmitButton />
                  {state?.error && (
                    <p className="text-center text-red-500">
                      {typeof state.error === 'string'
                        ? state.error
                        : 'Unexpected Error'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

function CreateSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="modal-action">
      <button type="submit" aria-disabled={pending} className="btn btn-primary">
        Create
      </button>
    </div>
  );
}
