/*
  Warnings:

  - Added the required column `dsoCodCentroC` to the `dom_solicitudes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dom_solicitudes` ADD COLUMN `dsoCodCentroC` CHAR(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `dom_solicitudes` ADD CONSTRAINT `dom_solicitudes_dsoCodCentroC_fkey` FOREIGN KEY (`dsoCodCentroC`) REFERENCES `con_centroscosto`(`cctCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
