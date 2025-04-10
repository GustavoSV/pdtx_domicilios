/*
  Warnings:

  - You are about to alter the column `msjTelefono` on the `dom_mensajeros` table. The data in that column could be lost. The data in that column will be cast from `VarChar(80)` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE `dom_mensajeros` ADD COLUMN `msjDireccion` VARCHAR(80) NULL,
    ADD COLUMN `msjEmail` VARCHAR(100) NULL,
    MODIFY `msjTelefono` VARCHAR(30) NULL;
