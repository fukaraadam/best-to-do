'use server';

import { uploadUserFile, type UploadState } from './file';
import prisma from './db';
import { auth } from './auth';

export async function onUserFileUpload(
  prevState: UploadState,
  data: FormData,
): Promise<UploadState> {
  const file = data.get('file');
  if (!(file instanceof File)) {
    return { error: 'Not a file' };
  }
  const isImageString = data.get('isImage');
  const isImage = isImageString === 'true';

  return await uploadUserFile(file, isImage, file.name);
}

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
  const image = data.get('image');
  const isImageExist = image instanceof File && image.name !== 'undefined';
  const attachment = data.get('attachment');
  const isAttachmentExist =
    attachment instanceof File && attachment.name !== 'undefined';

  const newTodo = await prisma.todo.create({
    include: {
      image: true,
      attachment: true,
    },
    data: {
      title: data.get('title') as string | null,
      details: data.get('details') as string | null,
      tags: [],
      completed: (data.get('completed') === 'on') as boolean | undefined,
      userId: session.user.id,
      ...(isImageExist && {
        image: {
          create: {
            size: image.size,
            type: image.type,
            name: image.name,
            lastModified: new Date(image.lastModified).toISOString(),
          },
        },
      }),
      ...(isAttachmentExist && {
        attachment: {
          create: {
            size: attachment.size,
            type: attachment.type,
            name: attachment.name,
            lastModified: new Date(attachment.lastModified).toISOString(),
          },
        },
      }),
    },
  });

  if (isImageExist && newTodo.image?.id) {
    const imageUpResult = await uploadUserFile(image, true, newTodo.image.id);
    if (imageUpResult.error) {
      return { error: imageUpResult.error };
    }
  }
  if (isAttachmentExist && newTodo.attachment?.id) {
    const attachmentUpResult = await uploadUserFile(
      attachment,
      false,
      newTodo.attachment.id,
    );
    if (attachmentUpResult.error) {
      return { error: attachmentUpResult.error };
    }
  }
  console.log('newTodo: ', newTodo);
  return { data: newTodo };
}
