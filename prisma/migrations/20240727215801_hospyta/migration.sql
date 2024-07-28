/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostCategory" DROP CONSTRAINT "PostCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PostCategory" DROP CONSTRAINT "PostCategory_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "PostCategory";
