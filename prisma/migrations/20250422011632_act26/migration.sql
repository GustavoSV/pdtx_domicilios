/*
  Warnings:

  - A unique constraint covering the columns `[dgoCodSolicitud]` on the table `dom_gestion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `dom_gestion_dgoCodSolicitud_key` ON `dom_gestion`(`dgoCodSolicitud`);
