-- CreateTable
CREATE TABLE `dom_domicilios` (
    `domId` INTEGER NOT NULL AUTO_INCREMENT,
    `domCodUsuario` VARCHAR(50) NOT NULL,
    `domCodActividad` CHAR(3) NOT NULL,
    `domCodCentroC` CHAR(3) NOT NULL,
    `domCodMensajero` BIGINT NOT NULL,
    `domCodDestinatario` INTEGER NULL,
    `domDestinatario` VARCHAR(50) NOT NULL,
    `domDireccion` VARCHAR(80) NOT NULL,
    `domCodBarrio` CHAR(5) NOT NULL,
    `domTelefono` VARCHAR(80) NULL,
    `domInstrucciones` VARCHAR(500) NULL,
    `domValor` DECIMAL(10, 2) NULL,
    `domVrAdicional` DECIMAL(10, 2) NULL,
    `domFchSolicitud` DATETIME(3) NOT NULL,
    `domFchEntrega` DATETIME(3) NULL,
    `domCodEstado` CHAR(3) NOT NULL,

    PRIMARY KEY (`domId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
