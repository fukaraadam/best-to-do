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
  });
  return { data };
}

export async function onCreateTodoItem(prevState: any, data: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }
  const todoId = data.get('id') as string | null;

  const image = data.get('image');
  const imageId = data.get('imageId') as string | null;
  const imageChanged = data.get('imageChanged') === 'true';

  const attachment = data.get('attachment');
  const attachmentId = data.get('attachmentId') as string | null;
  const attachmentChanged = data.get('attachmentChanged') === 'true';

  const todoData = {
    title: data.get('title') as string | null,
    details: data.get('details') as string | null,
    tags: [],
    completed: data.get('completed') === 'on',
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
  const isImageExist = image instanceof File && image.name !== 'undefined';
  if (imageChanged) {
    if (isImageExist) {
      if (!image.type.startsWith('image')) {
        return { error: 'Invalid image type' };
      }
      const imageUpResult = await createOrUpdateFile(
        image,
        true,
        session.user.id,
        newTodo.id,
        imageId,
      );
      newTodo.image = imageUpResult;
    }
  }

  // Todo Atachment
  const isAttachmentExist =
    attachment instanceof File && attachment.name !== 'undefined';
  if (attachmentChanged) {
    if (isAttachmentExist) {
      const attachmentUpResult = await createOrUpdateFile(
        attachment,
        false,
        session.user.id,
        newTodo.id,
        attachmentId,
      );
      newTodo.attachment = attachmentUpResult;
    }
  }

  return { data: newTodo };
}

async function createOrUpdateFile(
  file: File,
  isImage: boolean,
  userId: string,
  todoId: string,
  fileId?: string | null,
) {
  let newFile;
  if (fileId) {
    // update
    const data = {
      size: file.size,
      type: file.type,
      name: file.name,
      lastModified: new Date(file.lastModified).toISOString(),
    };

    if (isImage) {
      newFile = await prisma.fileImage.update({
        where: { id: fileId },
        data,
      });
    } else {
      newFile = await prisma.fileAttachment.update({
        where: { id: fileId },
        data,
      });
    }
  } else {
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
  }
  await uploadUserFile(file, isImage, newFile.id, userId);
  return newFile;
}

async function deleteFile(
  isImage: boolean,
  userId: string,
  todoId: string,
  fileId?: string | null,
) {
  if (fileId) {
    if (isImage) {
      await prisma.fileImage.delete({ where: { id: fileId } });
    } else {
      await prisma.fileAttachment.delete({ where: { id: fileId } });
    }
    await deleteUserFile(isImage, todoId, userId);
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

  const removedList = await prisma.todo.deleteMany({
    where: { id: { in: todoIds }, userId: session.user.id },
  });

  return { data: removedList };
}
