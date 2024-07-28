/*
  Warnings:

  - You are about to drop the `_ImageToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ImageToPost" DROP CONSTRAINT "_ImageToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToPost" DROP CONSTRAINT "_ImageToPost_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageId" TEXT;

-- DropTable
DROP TABLE "_ImageToPost";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
