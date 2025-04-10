/*
  Warnings:

  - You are about to drop the column `ddtCodigo` on the `dom_destinatarios` table. All the data in the column will be lost.
  - You are about to drop the column `domCodDestinatario` on the `dom_domicilios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ddtNombre]` on the table `dom_destinatarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `dom_domicilios` DROP FOREIGN KEY `dom_domicilios_domCodDestinatario_fkey`;

-- DropIndex
DROP INDEX `dom_destinatarios_ddtCodigo_key` ON `dom_destinatarios`;

-- DropIndex
DROP INDEX `dom_domicilios_domCodDestinatario_fkey` ON `dom_domicilios`;

-- AlterTable
ALTER TABLE `dom_destinatarios` DROP COLUMN `ddtCodigo`;

-- AlterTable
ALTER TABLE `dom_domicilios` DROP COLUMN `domCodDestinatario`;

-- CreateIndex
CREATE UNIQUE INDEX `dom_destinatarios_ddtNombre_key` ON `dom_destinatarios`(`ddtNombre`);

-- AddForeignKey
ALTER TABLE `dom_destinatarios` ADD CONSTRAINT `dom_destinatarios_ddtCodBarrio_fkey` FOREIGN KEY (`ddtCodBarrio`) REFERENCES `gen_barrios`(`gbrCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
