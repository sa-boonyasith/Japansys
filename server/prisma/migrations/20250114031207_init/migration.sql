/*
  Warnings:

  - Added the required column `todo` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todo` ADD COLUMN `todo` VARCHAR(191) NOT NULL;
