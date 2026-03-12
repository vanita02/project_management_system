/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `assignedById` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `_enum_task_priority` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_enum_task_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_enum_user_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_assignedById_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_assignedToId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `assignedAt`,
    DROP COLUMN `assignedById`,
    DROP COLUMN `assignedToId`,
    MODIFY `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- DropTable
DROP TABLE `_enum_task_priority`;

-- DropTable
DROP TABLE `_enum_task_status`;

-- DropTable
DROP TABLE `_enum_user_role`;

-- DropTable
DROP TABLE `_user`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` ENUM('USER', 'MANAGER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
