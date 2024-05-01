-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "details" TEXT,
    "tags" TEXT[],
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileImage" (
    "id" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "todoId" TEXT NOT NULL,

    CONSTRAINT "FileImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAttachment" (
    "id" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "todoId" TEXT NOT NULL,

    CONSTRAINT "FileAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileImage_todoId_key" ON "FileImage"("todoId");

-- CreateIndex
CREATE UNIQUE INDEX "FileAttachment_todoId_key" ON "FileAttachment"("todoId");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileImage" ADD CONSTRAINT "FileImage_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
