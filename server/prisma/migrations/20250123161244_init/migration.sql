-- AlterTable
ALTER TABLE `salary` ADD COLUMN `providentfund` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `socialsecurity` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `tax` DOUBLE NOT NULL DEFAULT 0;
