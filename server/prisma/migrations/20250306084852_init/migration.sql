-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('employee', 'user', 'admin', 'recruit') NOT NULL DEFAULT 'recruit',
    `employee_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_employee_id_key`(`employee_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `job_position` VARCHAR(150) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `documents` JSON NULL,
    `personal_info` JSON NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `liveby` VARCHAR(191) NOT NULL,
    `birth_date` DATE NOT NULL,
    `age` INTEGER NOT NULL,
    `ethnicity` VARCHAR(50) NOT NULL,
    `nationality` VARCHAR(50) NOT NULL,
    `religion` VARCHAR(50) NOT NULL,
    `marital_status` VARCHAR(50) NOT NULL,
    `military_status` VARCHAR(100) NOT NULL,
    `role` ENUM('employee', 'user', 'admin', 'recruit') NOT NULL DEFAULT 'employee',
    `photo` VARCHAR(191) NOT NULL,
    `banking` VARCHAR(191) NULL,
    `banking_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobApplication` (
    `job_id` INTEGER NOT NULL AUTO_INCREMENT,
    `application_date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `firstname` VARCHAR(100) NULL,
    `lastname` VARCHAR(100) NULL,
    `job_position` VARCHAR(150) NULL,
    `expected_salary` DOUBLE NULL,
    `documents` JSON NULL,
    `personal_info` JSON NULL,
    `phone_number` VARCHAR(20) NULL,
    `email` VARCHAR(150) NOT NULL,
    `liveby` VARCHAR(191) NULL,
    `birth_date` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `ethnicity` VARCHAR(50) NULL,
    `nationality` VARCHAR(50) NULL,
    `religion` VARCHAR(50) NULL,
    `marital_status` VARCHAR(50) NULL,
    `military_status` VARCHAR(100) NULL,
    `status` ENUM('new', 'wait', 'pass', 'reject') NULL DEFAULT 'new',
    `photo` TEXT NULL,
    `banking` VARCHAR(191) NULL,
    `banking_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `JobApplication_email_key`(`email`),
    PRIMARY KEY (`job_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attend` (
    `attend_id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `check_in_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `check_out_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `working_hours` DOUBLE NULL,
    `status` ENUM('check_in', 'check_out', 'not_checked_in') NOT NULL DEFAULT 'not_checked_in',

    PRIMARY KEY (`attend_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveRequest` (
    `leave_id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `leavetype` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `startdate` DATE NOT NULL,
    `enddate` DATE NOT NULL,
    `action` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`leave_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meetingroom` (
    `meeting_id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `startdate` DATE NOT NULL,
    `enddate` DATE NOT NULL,
    `timestart` VARCHAR(191) NOT NULL,
    `timeend` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (`meeting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rentcar` (
    `rentcar_id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `startdate` DATE NOT NULL,
    `enddate` DATE NOT NULL,
    `timestart` VARCHAR(191) NOT NULL,
    `timeend` VARCHAR(191) NOT NULL,
    `place` VARCHAR(191) NOT NULL,
    `car` VARCHAR(191) NOT NULL,
    `license_plate` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Allowed', 'Rejected') NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (`rentcar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `project_id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_name` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL,
    `progress_circle` INTEGER NOT NULL DEFAULT 0,
    `employee_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_project_name_key`(`project_name`),
    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Todo` (
    `todo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `status` ENUM('mustdo', 'inprogress', 'finish') NOT NULL DEFAULT 'mustdo',
    `project_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`todo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salary` (
    `salary_id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `payroll_startdate` DATE NOT NULL,
    `payroll_enddate` DATE NOT NULL,
    `payment_date` DATE NULL,
    `banking` VARCHAR(191) NOT NULL,
    `banking_id` INTEGER NOT NULL,
    `salary` DOUBLE NOT NULL DEFAULT 0,
    `absent_late` DOUBLE NOT NULL DEFAULT 0,
    `overtime` DOUBLE NOT NULL DEFAULT 0,
    `bonus` DOUBLE NOT NULL DEFAULT 0,
    `bonus_total` DOUBLE NOT NULL DEFAULT 0,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `providentfund` DOUBLE NOT NULL DEFAULT 0,
    `socialsecurity` DOUBLE NOT NULL DEFAULT 0,
    `expense` DOUBLE NOT NULL DEFAULT 0,
    `tax_total` DOUBLE NOT NULL DEFAULT 0,
    `salary_total` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`salary_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `expen_id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `type_expense` VARCHAR(191) NOT NULL,
    `money` INTEGER NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (`expen_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendhistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attend_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `check_in_time` DATETIME(3) NOT NULL,
    `check_out_time` DATETIME(3) NOT NULL,
    `working_hours` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cus_company_name` VARCHAR(191) NOT NULL,
    `contact_name` VARCHAR(191) NOT NULL,
    `cus_position` VARCHAR(191) NOT NULL,
    `cus_address` VARCHAR(191) NOT NULL,
    `cus_phone` VARCHAR(191) NOT NULL,
    `cus_tax_id` VARCHAR(191) NOT NULL,
    `cus_bankname` VARCHAR(191) NOT NULL,
    `cus_banknumber` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quotation` (
    `quotation_id` INTEGER NOT NULL AUTO_INCREMENT,
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

    PRIMARY KEY (`quotation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_name_key`(`name`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `invoice` (
    `invoice_id` INTEGER NOT NULL AUTO_INCREMENT,
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

    PRIMARY KEY (`invoice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice_item` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meetingcus` (
    `meeting_cus` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `cus_company_name` VARCHAR(191) NOT NULL,
    `contact_name` VARCHAR(191) NOT NULL,
    `cus_postition` VARCHAR(191) NOT NULL,
    `cus_address` VARCHAR(191) NOT NULL,
    `cus_phone` VARCHAR(191) NOT NULL,
    `cus_tax_id` VARCHAR(191) NOT NULL,
    `cus_bankname` VARCHAR(191) NOT NULL,
    `cus_banknumber` VARCHAR(191) NOT NULL,
    `startdate` VARCHAR(191) NOT NULL,
    `enddate` VARCHAR(191) NOT NULL,
    `timestart` VARCHAR(191) NOT NULL,
    `timeend` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (`meeting_cus`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Income` (
    `income_id` INTEGER NOT NULL AUTO_INCREMENT,
    `desc` VARCHAR(191) NOT NULL,
    `money` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `date` DATE NOT NULL,
    `income_startdate` DATE NOT NULL,
    `income_enddate` DATE NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `invoice_id` INTEGER NULL,
    `receipt_id` INTEGER NULL,

    PRIMARY KEY (`income_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `desc` VARCHAR(191) NOT NULL,
    `money` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `date` DATE NOT NULL,
    `payment_startdate` DATE NOT NULL,
    `payment_enddate` DATE NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `salary_id` INTEGER NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attend` ADD CONSTRAINT `attend_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveRequest` ADD CONSTRAINT `LeaveRequest_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meetingroom` ADD CONSTRAINT `Meetingroom_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rentcar` ADD CONSTRAINT `Rentcar_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salary` ADD CONSTRAINT `Salary_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendhistory` ADD CONSTRAINT `attendhistory_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation` ADD CONSTRAINT `quotation_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation_item` ADD CONSTRAINT `quotation_item_quotation_id_fkey` FOREIGN KEY (`quotation_id`) REFERENCES `quotation`(`quotation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation_item` ADD CONSTRAINT `quotation_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt` ADD CONSTRAINT `receipt_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_item` ADD CONSTRAINT `receipt_item_receipt_id_fkey` FOREIGN KEY (`receipt_id`) REFERENCES `receipt`(`receipt_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_item` ADD CONSTRAINT `receipt_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice` ADD CONSTRAINT `invoice_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_item` ADD CONSTRAINT `invoice_item_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoice`(`invoice_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_item` ADD CONSTRAINT `invoice_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetingcus` ADD CONSTRAINT `meetingcus_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoice`(`invoice_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_receipt_id_fkey` FOREIGN KEY (`receipt_id`) REFERENCES `receipt`(`receipt_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_salary_id_fkey` FOREIGN KEY (`salary_id`) REFERENCES `Salary`(`salary_id`) ON DELETE SET NULL ON UPDATE CASCADE;
