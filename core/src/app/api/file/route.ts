import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { stat } from 'fs/promises';
import { auth } from '@/lib/auth';
import { getUserFilePath, streamFile } from '@/lib/file';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const fileId = req.nextUrl.searchParams.get('fileId');
  if (!fileId) {
    return NextResponse.json({ error: 'Missing fileId' }, { status: 400 });
  }
  const isImageString = req.nextUrl.searchParams.get('isImage');
  if (!isImageString) {
    return NextResponse.json({ error: 'Missing isImage' }, { status: 400 });
  }
  const isImage = isImageString === 'true';

  const filePath = getUserFilePath(session.user.id, isImage, fileId);
  const data: ReadableStream<Uint8Array> = streamFile(filePath); // Stream the file with a 1kb chunk
  const stats = await stat(filePath); // Get the file size
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
