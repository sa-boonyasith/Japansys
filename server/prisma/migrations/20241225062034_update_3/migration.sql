/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `Salary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Salary_employee_id_key` ON `Salary`(`employee_id`);
