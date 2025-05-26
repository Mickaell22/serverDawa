-- CreateTable
CREATE TABLE `Tecnico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `cedula` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `especialidad` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reparacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteNombre` VARCHAR(191) NOT NULL,
    `clienteCedula` VARCHAR(191) NOT NULL,
    `clienteTelefono` VARCHAR(191) NOT NULL,
    `equipo` VARCHAR(191) NOT NULL,
    `problemaReportado` VARCHAR(191) NOT NULL,
    `fechaIngreso` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('EN_PROCESO', 'ESPERANDO_REPUESTO', 'TERMINADO', 'ENTREGADO') NOT NULL DEFAULT 'EN_PROCESO',
    `tecnicoId` INTEGER NULL,
    `fechaEntregaEstimada` DATETIME(3) NULL,
    `fechaEntregaReal` DATETIME(3) NULL,
    `ordenId` INTEGER NULL,

    UNIQUE INDEX `Reparacion_ordenId_key`(`ordenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reparacion` ADD CONSTRAINT `Reparacion_tecnicoId_fkey` FOREIGN KEY (`tecnicoId`) REFERENCES `Tecnico`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reparacion` ADD CONSTRAINT `Reparacion_ordenId_fkey` FOREIGN KEY (`ordenId`) REFERENCES `Orden`(`id_order`) ON DELETE SET NULL ON UPDATE CASCADE;
