-- DropForeignKey
ALTER TABLE `dom_gestion` DROP FOREIGN KEY `dom_gestion_dgoCodSolicitud_fkey`;

-- DropIndex
DROP INDEX `dom_gestion_dgoCodSolicitud_fkey` ON `dom_gestion`;

-- AddForeignKey
ALTER TABLE `dom_gestion` ADD CONSTRAINT `dom_gestion_dgoCodSolicitud_fkey` FOREIGN KEY (`dgoCodSolicitud`) REFERENCES `dom_solicitudes`(`dsoId`) ON DELETE CASCADE ON UPDATE CASCADE;
