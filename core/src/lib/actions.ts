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

  const newTodo = await prisma.todo.create({
    data: {
      title: data.get('title') as string | null,
      details: data.get('details') as string | null,
      tags: [],
      completed: false,
      userId: session.user.id,
    },
  });

  return { data: newTodo };
}
