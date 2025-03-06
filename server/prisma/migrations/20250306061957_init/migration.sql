/*
  Warnings:

  - Added the required column `date` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_all` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `income` ADD COLUMN `date` DATE NOT NULL,
    ADD COLUMN `source` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `total_all` DOUBLE NOT NULL;
