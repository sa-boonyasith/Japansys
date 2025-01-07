/*
  Warnings:

  - Made the column `email` on table `jobapplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `jobapplication` MODIFY `email` VARCHAR(150) NOT NULL,
    MODIFY `birth_date` VARCHAR(191) NULL;
