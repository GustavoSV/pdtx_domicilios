/*
  Warnings:

  - You are about to drop the `dom_domicilios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `dom_solicitudes` DROP FOREIGN KEY `dom_solicitudes_dsoCodUsuario_fkey`;

-- DropIndex
DROP INDEX `dom_solicitudes_dsoCodUsuario_fkey` ON `dom_solicitudes`;

-- DropTable
DROP TABLE `dom_domicilios`;
