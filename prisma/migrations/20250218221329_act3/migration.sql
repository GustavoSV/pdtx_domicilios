/*
  Warnings:

  - The primary key for the `gen_departamentos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `depCodigo` on the `gen_departamentos` table. All the data in the column will be lost.
  - You are about to drop the column `depId` on the `gen_departamentos` table. All the data in the column will be lost.
  - You are about to drop the column `depNombre` on the `gen_departamentos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dptCodigo]` on the table `gen_departamentos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domCodCentroC` to the `dom_domicilios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dptCodigo` to the `gen_departamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dptId` to the `gen_departamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dptNombre` to the `gen_departamentos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `gen_ciudades` DROP FOREIGN KEY `gen_ciudades_ciuCodDepartamento_fkey`;

-- DropIndex
DROP INDEX `gen_ciudades_ciuCodDepartamento_fkey` ON `gen_ciudades`;

-- DropIndex
DROP INDEX `gen_departamentos_depCodigo_key` ON `gen_departamentos`;

-- AlterTable
ALTER TABLE `dom_domicilios` ADD COLUMN `domCodCentroC` CHAR(3) NOT NULL;

-- AlterTable
ALTER TABLE `gen_departamentos` DROP PRIMARY KEY,
    DROP COLUMN `depCodigo`,
    DROP COLUMN `depId`,
    DROP COLUMN `depNombre`,
    ADD COLUMN `dptCodigo` CHAR(6) NOT NULL,
    ADD COLUMN `dptId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `dptNombre` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`dptId`);

-- CreateTable
CREATE TABLE `con_centroscosto` (
    `cctId` INTEGER NOT NULL AUTO_INCREMENT,
    `cctCodigo` CHAR(3) NOT NULL,
    `cctCodUEN` CHAR(5) NOT NULL,
    `cctNombreCC` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `con_centroscosto_cctCodigo_key`(`cctCodigo`),
    PRIMARY KEY (`cctId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gen_uen` (
    `uenId` INTEGER NOT NULL AUTO_INCREMENT,
    `uenCodigo` CHAR(5) NOT NULL,
    `uenNombre` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `gen_uen_uenCodigo_key`(`uenCodigo`),
    PRIMARY KEY (`uenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `gen_departamentos_dptCodigo_key` ON `gen_departamentos`(`dptCodigo`);

-- AddForeignKey
ALTER TABLE `con_centroscosto` ADD CONSTRAINT `con_centroscosto_cctCodUEN_fkey` FOREIGN KEY (`cctCodUEN`) REFERENCES `gen_uen`(`uenCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dom_domicilios` ADD CONSTRAINT `dom_domicilios_domCodCentroC_fkey` FOREIGN KEY (`domCodCentroC`) REFERENCES `con_centroscosto`(`cctCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gen_ciudades` ADD CONSTRAINT `gen_ciudades_ciuCodDepartamento_fkey` FOREIGN KEY (`ciuCodDepartamento`) REFERENCES `gen_departamentos`(`dptCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
