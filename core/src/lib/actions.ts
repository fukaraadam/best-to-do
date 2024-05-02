'use server';

import { uploadUserFile, deleteUserFile } from './file';
import prisma from './db';
import { auth } from './auth';

export async function getTodoList() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const data = await prisma.todo.findMany({
    where: { userId: session.user.id },
    include: {
      image: true,
      attachment: true,
    },
    orderBy: {
      lastModified: 'desc',
    },
  });
  return { data };
}

export async function onTodoItem(prevState: any, data: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }
  const todoId = data.get('id') as string | null;

  const image = data.get('image');
  const imageAction = data.get('imageAction') as string | null;

  const attachment = data.get('attachment');
  const attachmentAction = data.get('attachmentAction') as string | null;

  const todoData = {
    title: data.get('title') as string | null,
    details: data.get('details') as string | null,
    tags: [],
    completed: data.get('completed') === 'on',
    lastModified: new Date().toISOString(),
    userId: session.user.id,
  };

  // Create or update todo item
  let newTodo;
  if (todoId) {
    // update
    newTodo = await prisma.todo.update({
      where: { id: todoId },
      include: {
        image: true,
        attachment: true,
      },
      data: todoData,
    });
  } else {
    // create
    newTodo = await prisma.todo.create({
      include: {
        image: true,
        attachment: true,
      },
      data: todoData,
    });
  }

  // Todo image
  if (imageAction === 'create' || imageAction === 'update') {
    const isValidImage =
      image instanceof File &&
      image.name !== 'undefined' &&
      image.type.startsWith('image');
    if (!isValidImage) return { error: 'Invalid image type' };
    if (imageAction === 'update' && newTodo.image) {
      await deleteFile(true, session.user.id, newTodo.image.id);
    }
    const imageUpResult = await createFile(
      image,
      true,
      session.user.id,
      newTodo.id,
    );
    newTodo.image = imageUpResult;
  } else if (imageAction === 'delete' && newTodo.image) {
    await deleteFile(true, session.user.id, newTodo.image.id);
  }

  // Todo Attachment
  if (attachmentAction === 'create' || attachmentAction === 'update') {
    const isValidFile =
      attachment instanceof File && attachment.name !== 'undefined';
    if (!isValidFile) return { error: 'Invalid file type' };
    if (attachmentAction === 'update' && newTodo.attachment) {
      await deleteFile(false, session.user.id, newTodo.attachment.id);
    }
    const attachmentUpResult = await createFile(
      attachment,
      false,
      session.user.id,
      newTodo.id,
    );
    newTodo.attachment = attachmentUpResult;
  } else if (attachmentAction === 'delete' && newTodo.attachment) {
    await deleteFile(false, session.user.id, newTodo.attachment.id);
  }

  return { data: newTodo };
}

async function createFile(
  file: File,
  isImage: boolean,
  userId: string,
  todoId: string,
) {
  let newFile;

  // create
  const data = {
    size: file.size,
    type: file.type,
    name: file.name,
    lastModified: new Date(file.lastModified).toISOString(),
    todoId: todoId,
  };

  if (isImage) {
    newFile = await prisma.fileImage.create({
      data,
    });
  } else {
    newFile = await prisma.fileAttachment.create({
      data,
    });
  }
  await uploadUserFile(file, isImage, newFile.id, userId);
  return newFile;
}

async function deleteFile(
  isImage: boolean,
  userId: string,
  fileId: string | null,
) {
  if (fileId) {
    if (isImage) {
      await prisma.fileImage.delete({ where: { id: fileId } });
    } else {
      await prisma.fileAttachment.delete({ where: { id: fileId } });
    }
    await deleteUserFile(isImage, fileId, userId);
  }
}

export async function onDeleteTodoItem(prevState: any, data: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }
  const todoIds = data.get('ids') as string[] | null;
  if (!todoIds || todoIds?.length === 0) {
    return { error: 'Missing todo ids' };
  }

  for (const id of todoIds) {
    const removedItem = await prisma.todo.delete({
      where: { id, userId: session.user.id },
      include: {
        image: true,
        attachment: true,
      },
    });

    if (removedItem.image) {
      await deleteFile(true, session.user.id, removedItem.image.id);
    }
    if (removedItem.attachment) {
      await deleteFile(false, session.user.id, removedItem.attachment.id);
    }
  }
}
