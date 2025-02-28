-- CreateTable
CREATE TABLE `receipt` (
    `receipt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `expire_date` DATE NOT NULL,
    `confirm_price` DOUBLE NOT NULL,
    `discount_rate` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `total_after_discount` DOUBLE NOT NULL,
    `vat` DOUBLE NOT NULL DEFAULT 7.0,
    `vat_amount` DOUBLE NOT NULL,
    `total_all` DOUBLE NOT NULL,
    `total_inthai` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `credit_term` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`receipt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipt_item` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `receipt_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `receipt` ADD CONSTRAINT `receipt_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_item` ADD CONSTRAINT `receipt_item_receipt_id_fkey` FOREIGN KEY (`receipt_id`) REFERENCES `receipt`(`receipt_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_item` ADD CONSTRAINT `receipt_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
