/*
  Warnings:

  - Made the column `domDestinatario` on table `dom_domicilios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `dom_domicilios` MODIFY `domDestinatario` VARCHAR(50) NOT NULL;
