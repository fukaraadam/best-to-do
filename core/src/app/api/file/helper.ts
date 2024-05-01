export function getFileUrl(fileId: string, isImage: boolean) {
  return `/api/file?${new URLSearchParams({ fileId, isImage: isImage.toString() })}`;
}
