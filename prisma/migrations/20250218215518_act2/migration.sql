/*
  Warnings:

  - You are about to drop the `gen_pais` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `gen_ciudades` DROP FOREIGN KEY `gen_ciudades_ciuCodPais_fkey`;

-- DropIndex
DROP INDEX `gen_ciudades_ciuCodPais_fkey` ON `gen_ciudades`;

-- DropTable
DROP TABLE `gen_pais`;

-- CreateTable
CREATE TABLE `gen_paises` (
    `paiId` INTEGER NOT NULL AUTO_INCREMENT,
    `paiCodigoISO` CHAR(2) NOT NULL,
    `paiNombre` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `gen_paises_paiCodigoISO_key`(`paiCodigoISO`),
    PRIMARY KEY (`paiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gen_ciudades` ADD CONSTRAINT `gen_ciudades_ciuCodPais_fkey` FOREIGN KEY (`ciuCodPais`) REFERENCES `gen_paises`(`paiCodigoISO`) ON DELETE RESTRICT ON UPDATE CASCADE;
