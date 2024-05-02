/*
  Warnings:

  - Added the required column `lastModified` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "lastModified" TIMESTAMP(3) NOT NULL;
