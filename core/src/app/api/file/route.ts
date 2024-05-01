import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
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
  // const stats = await stat(filePath); // Get the file size
  let stats;
  if (isImage) {
    stats = await prisma.fileImage.findUnique({
      where: {
        id: fileId,
      },
    });
  } else {
    stats = await prisma.fileAttachment.findUnique({
      where: {
        id: fileId,
      },
    });
  }

  if (!stats) {
    return NextResponse.json({ error: 'File not found' }, { status: 400 });
  }

  const res = new NextResponse(data, {
    // Create a new NextResponse for the file with the given stream from the disk
    status: 200, //STATUS 200: HTTP - Ok
    headers: new Headers({
      //Headers
      'content-disposition': `attachment; filename=${stats.name}`, //State that this is a file attachment
      'content-type': stats.type, //Set the file type
      'content-length': stats.size + '', //State the file size
    }),
  });

  return res;
}
