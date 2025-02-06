/*
  Warnings:

  - You are about to drop the column `invoice_number` on the `invoice` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `invoice_invoice_number_key` ON `invoice`;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `invoice_number`;
