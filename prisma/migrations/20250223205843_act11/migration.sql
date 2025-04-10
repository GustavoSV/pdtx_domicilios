-- CreateTable
CREATE TABLE `gen_aplicaciones` (
    `appId` INTEGER NOT NULL AUTO_INCREMENT,
    `appCodigo` CHAR(5) NOT NULL,
    `appDescripcion` VARCHAR(100) NOT NULL,
    `appTitulo` VARCHAR(50) NOT NULL,
    `appUrl` VARCHAR(100) NULL,
    `appEjecutable` VARCHAR(100) NULL,
    `appIcono` VARCHAR(100) NULL,
    `appEstado` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `gen_aplicaciones_appCodigo_key`(`appCodigo`),
    PRIMARY KEY (`appId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gen_roles` (
    `rolId` INTEGER NOT NULL AUTO_INCREMENT,
    `rolCodigo` CHAR(3) NOT NULL,
    `rolDescripcion` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `gen_roles_rolCodigo_key`(`rolCodigo`),
    PRIMARY KEY (`rolId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gen_rolesapp` (
    `rapId` INTEGER NOT NULL AUTO_INCREMENT,
    `rapCodUsuario` VARCHAR(50) NOT NULL,
    `rapCodApp` CHAR(5) NOT NULL,
    `rapCodRol` CHAR(3) NOT NULL,
    `rapCodUEN` CHAR(5) NOT NULL,

    PRIMARY KEY (`rapId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gen_rolesapp` ADD CONSTRAINT `gen_rolesapp_rapCodUsuario_fkey` FOREIGN KEY (`rapCodUsuario`) REFERENCES `gen_usuarios`(`usuUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gen_rolesapp` ADD CONSTRAINT `gen_rolesapp_rapCodApp_fkey` FOREIGN KEY (`rapCodApp`) REFERENCES `gen_aplicaciones`(`appCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gen_rolesapp` ADD CONSTRAINT `gen_rolesapp_rapCodRol_fkey` FOREIGN KEY (`rapCodRol`) REFERENCES `gen_roles`(`rolCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gen_rolesapp` ADD CONSTRAINT `gen_rolesapp_rapCodUEN_fkey` FOREIGN KEY (`rapCodUEN`) REFERENCES `gen_uen`(`uenCodigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
