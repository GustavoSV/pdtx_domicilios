-- DropForeignKey
ALTER TABLE `dom_gestion` DROP FOREIGN KEY `dom_gestion_dgoCodCentroC_fkey`;

-- DropIndex
DROP INDEX `dom_gestion_dgoCodCentroC_fkey` ON `dom_gestion`;
