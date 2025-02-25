/*
  Warnings:

  - You are about to drop the column `desc` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `item_no` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `quotation` table. All the data in the column will be lost.
  - You are about to alter the column `vat` on the `quotation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `confirm_price` on the `quotation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `subtotal` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vat_amount` to the `quotation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `quotation` DROP FOREIGN KEY `quotation_product_id_fkey`;

-- DropIndex
DROP INDEX `quotation_product_id_fkey` ON `quotation`;

-- AlterTable
ALTER TABLE `quotation` DROP COLUMN `desc`,
    DROP COLUMN `discount`,
    DROP COLUMN `item_no`,
    DROP COLUMN `product_id`,
    DROP COLUMN `quantity`,
    DROP COLUMN `total`,
    DROP COLUMN `unit_price`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `subtotal` DOUBLE NOT NULL,
    ADD COLUMN `vat_amount` DOUBLE NOT NULL,
    MODIFY `vat` DOUBLE NOT NULL DEFAULT 7.0,
    MODIFY `confirm_price` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `quotation_item` (
    `quotation_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `quotation_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`quotation_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quotation_item` ADD CONSTRAINT `quotation_item_quotation_id_fkey` FOREIGN KEY (`quotation_id`) REFERENCES `quotation`(`quotation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation_item` ADD CONSTRAINT `quotation_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
