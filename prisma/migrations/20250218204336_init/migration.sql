-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `authorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dom_actividades` (
    `dacId` INTEGER NOT NULL AUTO_INCREMENT,
    `dacCodigo` CHAR(3) NOT NULL,
    `dacDescripcion` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `dom_actividades_dacCodigo_key`(`dacCodigo`),
    PRIMARY KEY (`dacId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dom_destinatarios` (
    `ddtId` INTEGER NOT NULL AUTO_INCREMENT,
    `ddtCodigo` CHAR(5) NOT NULL,
    `ddtNombre` VARCHAR(50) NOT NULL,
    `ddtCodBarrio` CHAR(5) NOT NULL,
    `ddtDireccion` VARCHAR(80) NOT NULL,
    `ddtTelefono` VARCHAR(80) NULL,

    UNIQUE INDEX `dom_destinatarios_ddtCodigo_key`(`ddtCodigo`),
    PRIMARY KEY (`ddtId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dom_estados` (
    `desId` INTEGER NOT NULL AUTO_INCREMENT,
    `desCodigo` CHAR(3) NOT NULL,
    `desDescripcion` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `dom_estados_desCodigo_key`(`desCodigo`),
    PRIMARY KEY (`desId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dom_domicilios` (
    `domId` INTEGER NOT NULL AUTO_INCREMENT,
    `domCodDestinatario` CHAR(5) NOT NULL,
    `domCodActividad` CHAR(3) NOT NULL,
    `domDireccion` VARCHAR(80) NOT NULL,
    `domTelefono` VARCHAR(80) NULL,
    `domInstrucciones` VARCHAR(200) NULL,
    `domValor` DECIMAL(10, 2) NOT NULL,
    `domVrAdicional` DECIMAL(10, 2) NULL,
    `domFechaSolcitud` DATETIME(3) NOT NULL,
    `domFechaEntrega` DATETIME(3) NULL,
    `domCodEstado` CHAR(3) NOT NULL,

    PRIMARY KEY (`domId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_domicilios` ADD CONSTRAINT `dom_domicilios_domCodDestinatario_fkey` FOREIGN KEY (`domCodDestinatario`) REFERENCES `dom_destinatarios`(`ddtCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_domicilios` ADD CONSTRAINT `dom_domicilios_domCodActividad_fkey` FOREIGN KEY (`domCodActividad`) REFERENCES `dom_actividades`(`dacCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_domicilios` ADD CONSTRAINT `dom_domicilios_domCodEstado_fkey` FOREIGN KEY (`domCodEstado`) REFERENCES `dom_estados`(`desCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
