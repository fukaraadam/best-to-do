'use client';

import { useEffect, useState, useContext } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { ContextContent } from './todo-context';
import { onTodoItem } from '@/lib/actions';
import { getFileUrl } from '@/app/api/file/helper';
import {
  PhotoIcon,
  TrashIcon,
  ArrowDownOnSquareIcon,
} from '@heroicons/react/16/solid';

export function TodoModal() {
  const { isModalOpen } = useContext(ContextContent);
  if (!isModalOpen) return null;
  return <TodoModalComponent />;
}

export function TodoModalComponent() {
  const { updateTodoList, todoList, modalTodoId, setIsModalOpen } =
    useContext(ContextContent);
  const [state, action] = useFormState(onTodoItem, null);

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

type FileAction =
  | {
      action: 'create' | 'update';
      file: File;
    }
  | {
      action: 'delete';
      file: null;
      fileId: string;
    };

function TodoImageEdit({ imageId }: { imageId?: string }) {
  // null means remove image, undefined means no change
  const [fileAction, setFileAction] = useState<FileAction>();
  const imageUrl = fileAction?.file
    ? URL.createObjectURL(fileAction.file)
    : fileAction === undefined && imageId
      ? getFileUrl(imageId, true)
      : undefined;

  const onImageUpdate = (img: File | null) => {
    if (img && !img.type.startsWith('image')) return;
    else if (img && !imageId) setFileAction({ action: 'create', file: img });
    else if (img && imageId) setFileAction({ action: 'update', file: img });
    else if (img === null && imageId)
      setFileAction({ action: 'delete', file: null, fileId: imageId });
    else setFileAction(undefined);
  };
  return (
    <figure className="relative aspect-square lg:w-1/2">
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt="Todo Image"
            fill
            className="object-contain"
            unoptimized={true}
          />
          <button
            className="btn btn-sm btn-circle btn-error absolute right-2 top-2"
            onClick={() => onImageUpdate(null)}
          >
            <TrashIcon className="h-full w-full" />
          </button>
        </>
      ) : (
        <PhotoIcon className="h-full w-full" />
      )}
      <label
        htmlFor="newTodoImage"
        className="btn btn-primary absolute bottom-2"
      >
        Select Image{fileAction && '*'}
      </label>
      <input
        type="file"
        id="newTodoImage"
        name="image"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          e.target.files?.[0] && onImageUpdate(e.target.files?.[0]);
        }}
      />
      <input type="hidden" name="imageAction" value={fileAction?.action} />
    </figure>
  );
}

function TodoAttachmentEdit({ attachmentId }: { attachmentId?: string }) {
  // null means remove image, undefined means no change
  const [fileAction, setFileAction] = useState<FileAction>();
  const attachmentUrl = attachmentId && getFileUrl(attachmentId, false);
  const isDeletable =
    !(fileAction?.action === 'delete') && !!(attachmentId || fileAction?.file);

  const onFileUpdate = (file: File | null) => {
    if (file && !attachmentId) setFileAction({ action: 'create', file: file });
    else if (file && attachmentId)
      setFileAction({ action: 'update', file: file });
    else if (file === null && attachmentId)
      setFileAction({ action: 'delete', file: null, fileId: attachmentId });
    else setFileAction(undefined);
  };
  return (
    <div className="flex flex-col items-center">
      <h3>Attachment: </h3>
      <div className="join">
        <label htmlFor="newTodoAttachment" className="btn btn-neutral btn-sm">
          Select{fileAction && '*'}
        </label>
        {attachmentUrl && (
          <a
            href={attachmentUrl}
            download
            className="btn btn-sm btn-primary join-item"
          >
            <ArrowDownOnSquareIcon className="h-full w-full" />
          </a>
        )}
        {isDeletable && (
          <button
            className="btn btn-sm btn-error"
            onClick={() => onFileUpdate(null)}
          >
            <TrashIcon className="h-full w-full" />
          </button>
        )}
        <input
          type="file"
          id="newTodoAttachment"
          name="attachment"
          className="hidden"
          onChange={(e) => {
            e.target.files?.[0] && onFileUpdate(e.target.files?.[0]);
          }}
        />
        <input
          type="hidden"
          name="attachmentAction"
          value={fileAction?.action}
        />
      </div>
    </div>
  );
}
