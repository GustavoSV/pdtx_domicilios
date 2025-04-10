/*
  Warnings:

  - You are about to drop the column `domFechaEntrega` on the `dom_domicilios` table. All the data in the column will be lost.
  - You are about to drop the column `domFechaSolcitud` on the `dom_domicilios` table. All the data in the column will be lost.
  - Added the required column `domCodDestinatario` to the `dom_domicilios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domCodMensajero` to the `dom_domicilios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domFchSolicitud` to the `dom_domicilios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dom_domicilios` DROP COLUMN `domFechaEntrega`,
    DROP COLUMN `domFechaSolcitud`,
    ADD COLUMN `domCodDestinatario` VARCHAR(50) NOT NULL,
    ADD COLUMN `domCodMensajero` BIGINT NOT NULL,
    ADD COLUMN `domFchEntrega` DATETIME(3) NULL,
    ADD COLUMN `domFchSolicitud` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `dom_mensajeros` (
    `msjId` INTEGER NOT NULL AUTO_INCREMENT,
    `msjCodigo` BIGINT NOT NULL,
    `msjNombre` VARCHAR(50) NOT NULL,
    `msjTelefono` VARCHAR(80) NULL,

    UNIQUE INDEX `dom_mensajeros_msjCodigo_key`(`msjCodigo`),
    PRIMARY KEY (`msjId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dom_domicilios` ADD CONSTRAINT `dom_domicilios_domCodMensajero_fkey` FOREIGN KEY (`domCodMensajero`) REFERENCES `dom_mensajeros`(`msjCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
