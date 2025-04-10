/*
  Warnings:

  - Added the required column `domCodBarrio` to the `dom_domicilios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dom_domicilios` ADD COLUMN `domCodBarrio` CHAR(5) NOT NULL;

-- AddForeignKey
ALTER TABLE `dom_domicilios` ADD CONSTRAINT `dom_domicilios_domCodBarrio_fkey` FOREIGN KEY (`domCodBarrio`) REFERENCES `gen_barrios`(`gbrCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
