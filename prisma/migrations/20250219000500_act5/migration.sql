/*
  Warnings:

  - Added the required column `domCodUsuario` to the `dom_domicilios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dom_domicilios` ADD COLUMN `domCodUsuario` VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE `gen_usuarios` (
    `usuId` INTEGER NOT NULL AUTO_INCREMENT,
    `usuUsuario` VARCHAR(50) NOT NULL,
    `usuClave` VARCHAR(50) NOT NULL,
    `usuNombre` VARCHAR(50) NOT NULL,
    `usuEmail` VARCHAR(100) NOT NULL,
    `usuTipoUsuario` CHAR(1) NOT NULL,
    `usuFchUltIngreso` DATETIME(3) NOT NULL,
    `usuEstado` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `gen_usuarios_usuUsuario_key`(`usuUsuario`),
    PRIMARY KEY (`usuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dom_domicilios` ADD CONSTRAINT `dom_domicilios_domCodUsuario_fkey` FOREIGN KEY (`domCodUsuario`) REFERENCES `gen_usuarios`(`usuUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
