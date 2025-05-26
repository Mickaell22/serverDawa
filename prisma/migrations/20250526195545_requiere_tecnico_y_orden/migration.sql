/*
  Warnings:

  - Made the column `tecnicoId` on table `reparacion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ordenId` on table `reparacion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `reparacion` DROP FOREIGN KEY `Reparacion_ordenId_fkey`;

-- DropForeignKey
ALTER TABLE `reparacion` DROP FOREIGN KEY `Reparacion_tecnicoId_fkey`;

-- DropIndex
DROP INDEX `Reparacion_tecnicoId_fkey` ON `reparacion`;

-- AlterTable
ALTER TABLE `reparacion` MODIFY `tecnicoId` INTEGER NOT NULL,
    MODIFY `ordenId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Reparacion` ADD CONSTRAINT `Reparacion_tecnicoId_fkey` FOREIGN KEY (`tecnicoId`) REFERENCES `Tecnico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reparacion` ADD CONSTRAINT `Reparacion_ordenId_fkey` FOREIGN KEY (`ordenId`) REFERENCES `Orden`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;
