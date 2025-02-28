/*
  Warnings:

  - You are about to drop the column `discount` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `vat_rate` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `confirm_price` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_term` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_rate` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expire_date` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_after_discount` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_all` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vat_amount` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `invoice_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `discount`,
    DROP COLUMN `total`,
    DROP COLUMN `vat_rate`,
    ADD COLUMN `confirm_price` DOUBLE NOT NULL,
    ADD COLUMN `credit_term` INTEGER NOT NULL,
    ADD COLUMN `discount_rate` DOUBLE NOT NULL,
    ADD COLUMN `expire_date` DATE NOT NULL,
    ADD COLUMN `total_after_discount` DOUBLE NOT NULL,
    ADD COLUMN `total_all` DOUBLE NOT NULL,
    ADD COLUMN `total_inthai` VARCHAR(191) NULL,
    ADD COLUMN `vat_amount` DOUBLE NOT NULL,
    MODIFY `date` DATE NOT NULL,
    MODIFY `vat` DOUBLE NOT NULL DEFAULT 7.0,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `invoice_item` ADD COLUMN `unit_price` DOUBLE NOT NULL,
    ALTER COLUMN `discount` DROP DEFAULT;
