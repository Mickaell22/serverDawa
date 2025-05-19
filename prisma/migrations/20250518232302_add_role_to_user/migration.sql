/*
  Warnings:

  - You are about to alter the column `password` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `rol` VARCHAR(191) NOT NULL DEFAULT 'user',
    MODIFY `nombre` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;
