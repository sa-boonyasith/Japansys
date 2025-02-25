/*
  Warnings:

  - You are about to drop the column `address` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `after_discount` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `contract_name` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `cus_name` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `no_item` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `project_name` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `sale_name` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `special_discount` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `tax_id` on the `quotation` table. All the data in the column will be lost.
  - Added the required column `confirm_price` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_rate` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expire_date` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_no` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_after_discount` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_all` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_inthai` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `quotation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoice_item` DROP FOREIGN KEY `invoice_item_invoice_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoice_item` DROP FOREIGN KEY `invoice_item_product_id_fkey`;

-- DropIndex
DROP INDEX `invoice_item_invoice_id_fkey` ON `invoice_item`;

-- DropIndex
DROP INDEX `invoice_item_product_id_fkey` ON `invoice_item`;

-- AlterTable
ALTER TABLE `quotation` DROP COLUMN `address`,
    DROP COLUMN `after_discount`,
    DROP COLUMN `amount`,
    DROP COLUMN `contract_name`,
    DROP COLUMN `cus_name`,
    DROP COLUMN `description`,
    DROP COLUMN `no_item`,
    DROP COLUMN `price`,
    DROP COLUMN `project_name`,
    DROP COLUMN `sale_name`,
    DROP COLUMN `special_discount`,
    DROP COLUMN `subtotal`,
    DROP COLUMN `tax_id`,
    ADD COLUMN `confirm_price` DOUBLE NOT NULL,
    ADD COLUMN `desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `discount_rate` DOUBLE NOT NULL,
    ADD COLUMN `expire_date` DATE NOT NULL,
    ADD COLUMN `item_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_id` INTEGER NOT NULL,
    ADD COLUMN `total_after_discount` DOUBLE NOT NULL,
    ADD COLUMN `total_all` DOUBLE NOT NULL,
    ADD COLUMN `total_inthai` VARCHAR(191) NOT NULL,
    ADD COLUMN `unit_price` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `quotation` ADD CONSTRAINT `quotation_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_item` ADD CONSTRAINT `invoice_item_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoice`(`invoice_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_item` ADD CONSTRAINT `invoice_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
