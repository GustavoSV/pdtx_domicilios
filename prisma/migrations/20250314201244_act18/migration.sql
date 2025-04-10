-- DropForeignKey
ALTER TABLE `dom_domicilios` DROP FOREIGN KEY `dom_domicilios_domCodActividad_fkey`;

-- DropForeignKey
ALTER TABLE `dom_domicilios` DROP FOREIGN KEY `dom_domicilios_domCodBarrio_fkey`;

-- DropForeignKey
ALTER TABLE `dom_domicilios` DROP FOREIGN KEY `dom_domicilios_domCodCentroC_fkey`;

-- DropForeignKey
ALTER TABLE `dom_domicilios` DROP FOREIGN KEY `dom_domicilios_domCodEstado_fkey`;

-- DropForeignKey
ALTER TABLE `dom_domicilios` DROP FOREIGN KEY `dom_domicilios_domCodMensajero_fkey`;

-- DropForeignKey
ALTER TABLE `dom_domicilios` DROP FOREIGN KEY `dom_domicilios_domCodUsuario_fkey`;

-- DropIndex
DROP INDEX `dom_domicilios_domCodActividad_fkey` ON `dom_domicilios`;

-- DropIndex
DROP INDEX `dom_domicilios_domCodBarrio_fkey` ON `dom_domicilios`;

-- DropIndex
DROP INDEX `dom_domicilios_domCodCentroC_fkey` ON `dom_domicilios`;

-- DropIndex
DROP INDEX `dom_domicilios_domCodEstado_fkey` ON `dom_domicilios`;

-- DropIndex
DROP INDEX `dom_domicilios_domCodMensajero_fkey` ON `dom_domicilios`;

-- DropIndex
DROP INDEX `dom_domicilios_domCodUsuario_fkey` ON `dom_domicilios`;

-- CreateTable
CREATE TABLE `dom_solicitudes` (
    `dsoId` INTEGER NOT NULL AUTO_INCREMENT,
    `dsoCodUsuario` VARCHAR(50) NOT NULL,
    `dsoCodActividad` CHAR(3) NOT NULL,
    `dsoCodDestinatario` INTEGER NOT NULL,
    `dsoCodEstado` CHAR(3) NOT NULL,
    `dsoCodBarrio` CHAR(5) NOT NULL,
    `dsoDireccion` VARCHAR(80) NOT NULL,
    `dsoTelefono` VARCHAR(80) NULL,
    `dsoInstrucciones` VARCHAR(500) NULL,
    `dsoFchSolicitud` DATETIME(3) NOT NULL,

    PRIMARY KEY (`dsoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dom_gestion` (
    `dgoId` INTEGER NOT NULL AUTO_INCREMENT,
    `dgoCodSolicitud` INTEGER NOT NULL,
    `dgoCodCentroC` CHAR(3) NOT NULL,
    `dgoCodMensajero` BIGINT NOT NULL,
    `dgoValor` DECIMAL(10, 2) NULL,
    `dgoVrAdicional` DECIMAL(10, 2) NULL,
    `dgoFchEntrega` DATETIME(3) NULL,

    PRIMARY KEY (`dgoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dom_solicitudes` ADD CONSTRAINT `dom_solicitudes_dsoCodUsuario_fkey` FOREIGN KEY (`dsoCodUsuario`) REFERENCES `gen_usuarios`(`usuUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_solicitudes` ADD CONSTRAINT `dom_solicitudes_dsoCodDestinatario_fkey` FOREIGN KEY (`dsoCodDestinatario`) REFERENCES `dom_destinatarios`(`ddtId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_solicitudes` ADD CONSTRAINT `dom_solicitudes_dsoCodBarrio_fkey` FOREIGN KEY (`dsoCodBarrio`) REFERENCES `gen_barrios`(`gbrCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_solicitudes` ADD CONSTRAINT `dom_solicitudes_dsoCodActividad_fkey` FOREIGN KEY (`dsoCodActividad`) REFERENCES `dom_actividades`(`dacCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_solicitudes` ADD CONSTRAINT `dom_solicitudes_dsoCodEstado_fkey` FOREIGN KEY (`dsoCodEstado`) REFERENCES `enum_estados`(`eneCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_gestion` ADD CONSTRAINT `dom_gestion_dgoCodCentroC_fkey` FOREIGN KEY (`dgoCodCentroC`) REFERENCES `con_centroscosto`(`cctCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_gestion` ADD CONSTRAINT `dom_gestion_dgoCodMensajero_fkey` FOREIGN KEY (`dgoCodMensajero`) REFERENCES `dom_mensajeros`(`msjCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_gestion` ADD CONSTRAINT `dom_gestion_dgoCodSolicitud_fkey` FOREIGN KEY (`dgoCodSolicitud`) REFERENCES `dom_solicitudes`(`dsoId`) ON DELETE RESTRICT ON UPDATE CASCADE;
