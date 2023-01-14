-- AlterTable
ALTER TABLE `employee` ADD COLUMN `userType` ENUM('Admin', 'Management', 'Staff') NOT NULL DEFAULT 'Staff',
    MODIFY `gender` ENUM('Male', 'Female') NOT NULL DEFAULT 'Male';
