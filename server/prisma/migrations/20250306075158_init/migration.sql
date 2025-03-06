/*
  Warnings:

  - You are about to drop the column `total_all` on the `payment` table. All the data in the column will be lost.
  - Added the required column `date` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_enddate` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_startdate` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` DROP COLUMN `total_all`,
    ADD COLUMN `date` DATE NOT NULL,
    ADD COLUMN `payment_enddate` DATE NOT NULL,
    ADD COLUMN `payment_startdate` DATE NOT NULL,
    ADD COLUMN `source` VARCHAR(191) NOT NULL;
