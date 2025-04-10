/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `gen_barrios` (
    `gbrId` INTEGER NOT NULL AUTO_INCREMENT,
    `gbrCodigo` CHAR(5) NOT NULL,
    `gbrCodCiudad` CHAR(6) NOT NULL,
    `gbrNombre` VARCHAR(50) NOT NULL,
    `gbrCodComuna` CHAR(3) NOT NULL,
    `gbrCodPostal` CHAR(7) NOT NULL,
    `gbrValor` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `gen_barrios_gbrCodigo_key`(`gbrCodigo`),
    PRIMARY KEY (`gbrId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gen_ciudades` (
    `ciuId` INTEGER NOT NULL AUTO_INCREMENT,
    `ciuCodigo` CHAR(6) NOT NULL,
    `ciuNombre` VARCHAR(30) NOT NULL,
    `ciuCodDepartamento` CHAR(6) NOT NULL,
    `ciuCodPais` CHAR(2) NOT NULL,

    UNIQUE INDEX `gen_ciudades_ciuCodigo_key`(`ciuCodigo`),
    PRIMARY KEY (`ciuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gen_departamentos` (
    `depId` INTEGER NOT NULL AUTO_INCREMENT,
    `depCodigo` CHAR(6) NOT NULL,
    `depNombre` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `gen_departamentos_depCodigo_key`(`depCodigo`),
    PRIMARY KEY (`depId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gen_pais` (
    `paiId` INTEGER NOT NULL AUTO_INCREMENT,
    `paiCodigoISO` CHAR(2) NOT NULL,
    `paiNombre` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `gen_pais_paiCodigoISO_key`(`paiCodigoISO`),
    PRIMARY KEY (`paiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gen_barrios` ADD CONSTRAINT `gen_barrios_gbrCodCiudad_fkey` FOREIGN KEY (`gbrCodCiudad`) REFERENCES `gen_ciudades`(`ciuCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gen_ciudades` ADD CONSTRAINT `gen_ciudades_ciuCodDepartamento_fkey` FOREIGN KEY (`ciuCodDepartamento`) REFERENCES `gen_departamentos`(`depCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gen_ciudades` ADD CONSTRAINT `gen_ciudades_ciuCodPais_fkey` FOREIGN KEY (`ciuCodPais`) REFERENCES `gen_pais`(`paiCodigoISO`) ON DELETE RESTRICT ON UPDATE CASCADE;
