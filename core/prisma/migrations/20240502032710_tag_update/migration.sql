/*
  Warnings:

  - You are about to drop the column `tags` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "tags",
ADD COLUMN     "tag" TEXT;
