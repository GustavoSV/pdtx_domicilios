/*
  Warnings:

  - You are about to drop the `dom_estados` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `dom_domicilios` DROP FOREIGN KEY `dom_domicilios_domCodEstado_fkey`;

-- DropIndex
DROP INDEX `dom_domicilios_domCodEstado_fkey` ON `dom_domicilios`;

-- DropTable
DROP TABLE `dom_estados`;

-- CreateTable
CREATE TABLE `enum_estados` (
    `eneId` INTEGER NOT NULL AUTO_INCREMENT,
    `eneCodigo` CHAR(2) NOT NULL,
    `eneEstado` VARCHAR(15) NOT NULL,
    `eneOP` CHAR(1) NOT NULL,
    `eneDESP` CHAR(1) NOT NULL,
    `eneOS` CHAR(1) NOT NULL,
    `enePED` CHAR(1) NOT NULL,
    `eneTRAB` CHAR(1) NOT NULL,
    `eneICB` CHAR(1) NOT NULL,
    `eneDOM` CHAR(1) NOT NULL,
    `eneEMBG` CHAR(1) NOT NULL,

    UNIQUE INDEX `enum_estados_eneCodigo_key`(`eneCodigo`),
    PRIMARY KEY (`eneId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dom_domicilios` ADD CONSTRAINT `dom_domicilios_domCodEstado_fkey` FOREIGN KEY (`domCodEstado`) REFERENCES `enum_estados`(`eneCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
