/*
  Warnings:

  - Added the required column `enddate` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startdate` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeend` to the `meetingcus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestart` to the `meetingcus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meetingcus` ADD COLUMN `enddate` DATE NOT NULL,
    ADD COLUMN `startdate` DATE NOT NULL,
    ADD COLUMN `timeend` TIME NOT NULL,
    ADD COLUMN `timestart` TIME NOT NULL,
    MODIFY `contact_name` VARCHAR(191) NOT NULL,
    MODIFY `cus_company_name` VARCHAR(191) NOT NULL;
