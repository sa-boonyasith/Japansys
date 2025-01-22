-- CreateTable
CREATE TABLE `Expense` (
    `expen_id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `Date` DATE NOT NULL,
    `Type_Expense` VARCHAR(191) NOT NULL,
    `Money` INTEGER NOT NULL,
    `desc` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Expense_employee_id_key`(`employee_id`),
    PRIMARY KEY (`expen_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
