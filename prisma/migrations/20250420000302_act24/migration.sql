-- AddForeignKey
ALTER TABLE `dom_solicitudes` ADD CONSTRAINT `dom_solicitudes_dsoCodUsuario_fkey` FOREIGN KEY (`dsoCodUsuario`) REFERENCES `gen_usuarios`(`usuUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
