/*
  Warnings:

  - You are about to alter the column `status` on the `rentcar` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `rentcar` MODIFY `status` ENUM('Pending', 'Allowed', 'Rejected') NOT NULL DEFAULT 'Pending';
