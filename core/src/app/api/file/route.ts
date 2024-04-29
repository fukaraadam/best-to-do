import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { ReadableOptions } from 'stream';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const userFile = req.nextUrl.searchParams.get('userfile');
  if (!userFile) {
    return NextResponse.json({ error: 'Missing userfile' }, { status: 400 });
  }
  const filePath = path.join(
    process.cwd(),
    'uploads',
    session.user.id,
    userFile,
  );
  const stats = await fs.promises.stat(filePath); // Get the file size
  const data: ReadableStream<Uint8Array> = streamFile(filePath); // Stream the file with a 1kb chunk
  const res = new NextResponse(data, {
    // Create a new NextResponse for the file with the given stream from the disk
    status: 200, //STATUS 200: HTTP - Ok
    headers: new Headers({
      //Headers
      'content-disposition': `attachment; filename=${path.basename(filePath)}`, //State that this is a file attachment
      'content-type': 'application/png', //Set the file type
      'content-length': stats.size + '', //State the file size
    }),
  });

  return res;
}

/**
 * Return a stream from the disk
 * @param {string} path - The location of the file
 * @param {ReadableOptions} options - The streamable options for the stream (ie how big are the chunks, start, end, etc).
 * @returns {ReadableStream} A readable stream of the file
 */
function streamFile(
  path: string,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

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
