/*
  Warnings:

  - You are about to alter the column `dsoCodUsuario` on the `dom_solicitudes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `dom_solicitudes` DROP FOREIGN KEY `dom_solicitudes_dsoCodUsuario_fkey`;

-- DropIndex
DROP INDEX `dom_solicitudes_dsoCodUsuario_fkey` ON `dom_solicitudes`;

-- AlterTable
ALTER TABLE `dom_solicitudes` MODIFY `dsoCodUsuario` INTEGER NOT NULL;
