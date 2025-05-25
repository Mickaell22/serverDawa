-- CreateTable
CREATE TABLE `Orden` (
    `id_order` INTEGER NOT NULL AUTO_INCREMENT,
    `emitida` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total` DOUBLE NOT NULL,
    `aprobado` BOOLEAN NOT NULL DEFAULT true,
    `cl_nombre` VARCHAR(191) NOT NULL,
    `cl_apellido` VARCHAR(191) NOT NULL,
    `cl_cedula` VARCHAR(191) NOT NULL,
    `cl_telefono` VARCHAR(191) NOT NULL,
    `cl_ubicacion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductoOrden` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordenId` INTEGER NOT NULL,
    `repuestoId` INTEGER NOT NULL,
    `precioUnitario` DOUBLE NOT NULL,
    `nombreProducto` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `montoTotal` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductoOrden` ADD CONSTRAINT `ProductoOrden_ordenId_fkey` FOREIGN KEY (`ordenId`) REFERENCES `Orden`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductoOrden` ADD CONSTRAINT `ProductoOrden_repuestoId_fkey` FOREIGN KEY (`repuestoId`) REFERENCES `Repuesto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
