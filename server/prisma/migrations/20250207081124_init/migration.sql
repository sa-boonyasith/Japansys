/*
  Warnings:

  - The values [manager] on the enum `Employee_role` will be removed. If these variants are still used in the database, this will fail.
  - The values [manager] on the enum `Employee_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `employee` MODIFY `role` ENUM('employee', 'user', 'admin', 'recruit') NOT NULL DEFAULT 'employee';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('employee', 'user', 'admin', 'recruit') NOT NULL DEFAULT 'recruit';
