-- DropForeignKey
ALTER TABLE "FileAttachment" DROP CONSTRAINT "FileAttachment_todoId_fkey";

-- DropForeignKey
ALTER TABLE "FileImage" DROP CONSTRAINT "FileImage_todoId_fkey";

-- AddForeignKey
ALTER TABLE "FileImage" ADD CONSTRAINT "FileImage_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
