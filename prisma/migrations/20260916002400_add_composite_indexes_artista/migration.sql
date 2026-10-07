-- Add composite indexes for Artista query performance
CREATE INDEX IF NOT EXISTS "artistas_status_generoArtistico_idx" ON "artistas" ("status", "generoArtistico");
CREATE INDEX IF NOT EXISTS "artistas_status_foto_idx" ON "artistas" ("status", "foto");