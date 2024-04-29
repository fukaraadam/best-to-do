'use server';

import { join } from 'path';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { auth } from './auth';

export type FormState = {
  isSuccess?: boolean;
  error?: string;
};

export async function onUserFileUpload(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const file = data.get('file');
  if (!(file instanceof File)) {
    return { error: 'Not a file' };
  }
  return await uploadUserFile(file);
}

export async function uploadUserFile(file: File): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const dir = join(process.cwd(), 'uploads', session.user.id);
  await mkdir(dir, { recursive: true });
  const path = join(dir, file.name);
  await writeFile(path, buffer);
  console.log(`open ${path} to see the uploaded file`);

  return { isSuccess: true };
}
