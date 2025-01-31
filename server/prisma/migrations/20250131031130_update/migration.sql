/*
  Warnings:

  - You are about to alter the column `status` on the `meetingroom` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `meetingroom` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Pending';
