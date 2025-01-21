-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('employee', 'manager', 'admin', 'recruit') NOT NULL DEFAULT 'recruit',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `job_position` VARCHAR(150) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `documents` JSON NOT NULL,
    `personal_info` JSON NOT NULL,
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
    `role` ENUM('employee', 'manager', 'admin', 'recruit') NOT NULL DEFAULT 'employee',
    `photo` VARCHAR(191) NOT NULL,
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
    `status` ENUM('new', 'wait', 'pass', 'reject') NOT NULL DEFAULT 'new',
    `photo` TEXT NULL,
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
    `status` ENUM('pending', 'allowed', 'rejected') NOT NULL DEFAULT 'pending',

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
    `status` ENUM('pending', 'allowed', 'rejected') NOT NULL DEFAULT 'pending',

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
    `salary` DOUBLE NOT NULL,
    `overtime` DOUBLE NOT NULL DEFAULT 0,
    `bonus` DOUBLE NOT NULL DEFAULT 0,
    `salary_total` DOUBLE NOT NULL DEFAULT 0,
    `Total_working_day` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Salary_employee_id_key`(`employee_id`),
    PRIMARY KEY (`salary_id`)
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

-- AddForeignKey
ALTER TABLE `attend` ADD CONSTRAINT `attend_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveRequest` ADD CONSTRAINT `LeaveRequest_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meetingroom` ADD CONSTRAINT `Meetingroom_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rentcar` ADD CONSTRAINT `Rentcar_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salary` ADD CONSTRAINT `Salary_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendhistory` ADD CONSTRAINT `attendhistory_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
