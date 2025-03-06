/*
  Warnings:

  - Added the required column `income_enddate` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `income_startdate` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `income` ADD COLUMN `income_enddate` DATE NOT NULL,
    ADD COLUMN `income_startdate` DATE NOT NULL;
