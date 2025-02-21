/*
  Warnings:

  - You are about to drop the column `enddate` on the `meetingcus` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `meetingcus` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `meetingcus` table. All the data in the column will be lost.
  - You are about to drop the column `startdate` on the `meetingcus` table. All the data in the column will be lost.
  - You are about to drop the column `timeend` on the `meetingcus` table. All the data in the column will be lost.
  - You are about to drop the column `timestart` on the `meetingcus` table. All the data in the column will be lost.
  - Added the required column `contact_name` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cus_address` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cus_bankname` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cus_banknumber` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cus_company_name` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cus_phone` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cus_postition` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cus_tax_id` to the `meetingcus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meetingcus` DROP COLUMN `enddate`,
    DROP COLUMN `firstname`,
    DROP COLUMN `lastname`,
    DROP COLUMN `startdate`,
    DROP COLUMN `timeend`,
    DROP COLUMN `timestart`,
    ADD COLUMN `contact_name` VARCHAR(100) NOT NULL,
    ADD COLUMN `cus_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `cus_bankname` VARCHAR(191) NOT NULL,
    ADD COLUMN `cus_banknumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `cus_company_name` VARCHAR(100) NOT NULL,
    ADD COLUMN `cus_phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `cus_postition` VARCHAR(191) NOT NULL,
    ADD COLUMN `cus_tax_id` VARCHAR(191) NOT NULL;
