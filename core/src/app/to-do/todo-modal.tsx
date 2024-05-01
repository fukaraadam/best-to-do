'use client';

import { useEffect, useState, useContext } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ContextContent } from './todo-context';
import { onCreateTodoItem } from '@/lib/actions';
import { PhotoIcon } from '@heroicons/react/16/solid';

export function TodoModal() {
  const { updateTodoList, todoList, modalTodoId } = useContext(ContextContent);
  const [state, action] = useFormState(onCreateTodoItem, null);

  useEffect(() => {
    if (state?.data?.id) {
      setTimeout(() => {
        updateTodoList();
        (document.getElementById('todoModal') as any).close();
      }, 2000);
    }
  }, [state?.data?.id, updateTodoList]);

  const item = modalTodoId
    ? todoList.find((item) => item.id === modalTodoId)
    : undefined;
  return (
    <dialog id="todoModal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-neutral absolute right-2 top-2 z-50">
            ✕
          </button>
        </form>

        <form action={action}>
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <TodoImageEdit
              imageUrl={
                item?.image
                  ? `/api/file?${new URLSearchParams({ fileId: item.image.id, isImage: 'true' })}`
                  : undefined
              }
            />
            <div className="card-body">
              <h2 className="card-title">
                {item?.id && (
                  <input type="hidden" name="id" defaultValue={item.id} />
                )}
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="input input-bordered w-full max-w-xs"
                  defaultValue={item?.title || ''}
                />
              </h2>
              <p>
                <textarea
                  placeholder="Details"
                  name="details"
                  className="textarea textarea-bordered textarea-xs w-full max-w-xs"
                  defaultValue={item?.details || ''}
                ></textarea>
              </p>
              <input
                type="file"
                name="attachment"
                className="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs"
              />
              <label className="label w-full max-w-xs cursor-pointer">
                <span className="label-text">Completed?</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  name="completed"
                  defaultChecked={item?.completed || false}
                />
              </label>
              <div className="card-actions justify-end">
                <SubmitButton itemId={item?.id} />
              </div>
              {state?.error ? (
                <p className="text-error text-center">
                  {typeof state.error === 'string'
                    ? state.error
                    : 'Unexpected Error'}
                </p>
              ) : state?.data?.id ? (
                <p className="text-success text-center">Successful!</p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

function SubmitButton({ itemId }: { itemId?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="btn btn-primary"
      disabled={pending}
    >
      {pending ? 'Loading' : itemId ? 'Edit' : 'Create'}
    </button>
  );
}

function TodoImageEdit({ imageUrl }: { imageUrl?: string }) {
  const [image, setImage] = useState<File | null>(null);
  const uploadedImageUrl = image ? URL.createObjectURL(image) : undefined;
  return (
    <figure className="relative">
      {uploadedImageUrl || imageUrl ? (
        <img src={uploadedImageUrl || imageUrl} alt="Todo Image" />
      ) : (
        <PhotoIcon className="h-full w-full" />
      )}
      <label
        htmlFor="newTodoImage"
        className="btn btn-neutral absolute bottom-2"
      >
        Select Image
      </label>
      <input
        type="file"
        id="newTodoImage"
        name="image"
        // className="file-input file-input-bordered file-input-primary absolute bottom-2 w-full max-w-xs"
        className="hidden"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
    </figure>
  );
}
