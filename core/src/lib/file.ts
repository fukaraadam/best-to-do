import { join } from 'path';
import { createReadStream } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import { ReadableOptions } from 'stream';

export function getUserFilePath(
  userId: string,
  isImage: boolean,
  fileId?: string,
) {
  const dirPath = join(
    process.cwd(),
    'uploads',
    userId,
    isImage ? 'images' : 'attachments',
  );

  return fileId ? join(dirPath, fileId) : dirPath;
}

export async function uploadUserFile(
  file: File,
  isImage: boolean,
  fileId: string,
  userId: string,
) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const dir = getUserFilePath(userId, isImage);
  await mkdir(dir, { recursive: true });
  const filePath = getUserFilePath(userId, isImage, fileId);
  await writeFile(filePath, buffer);
}

/**
 * Return a stream from the disk
 * @param {string} path - The location of the file
 * @param {ReadableOptions} options - The streamable options for the stream (ie how big are the chunks, start, end, etc).
 * @returns {ReadableStream} A readable stream of the file
 */
export function streamFile(
  path: string,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  const downloadStream = createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on('data', (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk)),
      );
      downloadStream.on('end', () => controller.close());
      downloadStream.on('error', (error: NodeJS.ErrnoException) =>
        controller.error(error),
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}
