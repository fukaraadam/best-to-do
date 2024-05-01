'use client';

import { useEffect, useState, useContext } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { ContextContent } from './todo-context';
import { onCreateTodoItem } from '@/lib/actions';
import { getFileUrl } from '@/app/api/file/helper';
import { PhotoIcon } from '@heroicons/react/16/solid';

export function TodoModal() {
  const { isModalOpen } = useContext(ContextContent);
  if (!isModalOpen) return null;
  return <TodoModalComponent />;
}

export function TodoModalComponent() {
  const { updateTodoList, todoList, modalTodoId, setIsModalOpen } =
    useContext(ContextContent);
  const [state, action] = useFormState(onCreateTodoItem, null);

  useEffect(() => {
    if (state?.data?.id) {
      updateTodoList();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    }
  }, [state?.data?.id, updateTodoList, setIsModalOpen]);

  const item = modalTodoId
    ? todoList.find((item) => item.id === modalTodoId)
    : undefined;
  return (
    <dialog
      id="todoModal"
      className="modal modal-bottom sm:modal-middle modal-open"
    >
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-neutral absolute right-2 top-2 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          ✕
        </button>

        <form action={action}>
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <TodoImageEdit imageId={item?.image?.id} />
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
              {/* <input
                type="file"
                name="attachment"
                className="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs"
              /> */}
              <TodoAttachmentEdit attachmentId={item?.attachment?.id} />
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

function TodoImageEdit({ imageId }: { imageId?: string }) {
  const [image, setImage] = useState<File | null>();
  const uploadedImageUrl = image ? URL.createObjectURL(image) : undefined;
  const isChanged = image === undefined ? 'false' : 'true';
  const imageUrl = imageId && getFileUrl(imageId, true);
  return (
    <figure className="relative aspect-square lg:w-1/2">
      {imageId && <input type="hidden" name="imageId" defaultValue={imageId} />}
      {uploadedImageUrl || imageUrl ? (
        <Image
          src={uploadedImageUrl || imageUrl || ''}
          alt="Todo Image"
          fill
          className="object-contain"
          unoptimized={true}
        />
      ) : (
        <PhotoIcon className="h-full w-full" />
      )}
      <label
        htmlFor="newTodoImage"
        className="btn btn-neutral absolute bottom-2"
      >
        Select Image{isChanged === 'true' && '*'}
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
      <input type="hidden" name="imageChanged" value={isChanged} />
    </figure>
  );
}

function TodoAttachmentEdit({ attachmentId }: { attachmentId?: string }) {
  const [attachment, setAttachment] = useState<File | null>();
  const isChanged = attachment === undefined ? 'false' : 'true';
  const attachmentUrl = attachmentId && getFileUrl(attachmentId, false);
  return (
    <>
      {attachmentId && (
        <input type="hidden" name="attachmentId" defaultValue={attachmentId} />
      )}
      {attachmentUrl && (
        <a href={attachmentUrl} download className="btn btn-sm btn-primary">
          Download Attachment
        </a>
      )}
      <label htmlFor="newTodoAttachment" className="btn btn-neutral">
        Select Attachment{isChanged === 'true' && '*'}
      </label>
      <input
        type="file"
        id="newTodoAttachment"
        name="attachment"
        className="hidden"
        onChange={(e) => setAttachment(e.target.files?.[0] || null)}
      />
      <input type="hidden" name="attachmentChanged" value={isChanged} />
    </>
  );
}
