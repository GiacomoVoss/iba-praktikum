/**
 * =============================================================================
 * DATENBANK-KONFIGURATION  (src/data-source.ts)
 * =============================================================================
 *
 * Hier wird die Verbindung zur SQLite-Datenbank eingerichtet.
 * Die Datenbankdatei "datenbank.sqlite" wird automatisch im Projektordner
 * angelegt, wenn der Server zum ersten Mal startet.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  SO FÜGST DU EINE NEUE ENTITÄT HINZU                                    │
 * │                                                                         │
 * │  1. Erstelle die Datei:  src/entities/MeineEntitaet.ts                  │
 * │     (Orientiere dich an src/entities/Produkt.ts als Vorlage)            │
 * │                                                                         │
 * │  ➜ Beim nächsten Start wird die Tabelle automatisch erzeugt!            │
 * └─────────────────────────────────────────────────────────────────────────┘
 * =============================================================================
 */

import 'reflect-metadata';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { User } from './_intern/entities/User';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',

  // Name der Datenbankdatei im Projektordner
  database: 'datenbank.sqlite',

  // synchronize: true  → TypeORM passt die Tabellen beim Start automatisch an.
  // Perfekt für die Entwicklung! In echten Produktivsystemen würde man stattdessen
  // Migrationen verwenden.
  synchronize: true,

  logging: false,

  entities: [
    // Eingebaute Entitäten (nicht verändern)
    User,

    // Alle Dateien aus src/entities/ werden automatisch eingelesen –
    // einfach eine neue .ts-Datei dort ablegen, fertig.
    path.join(__dirname, 'entities', '*.{ts,js}'),
  ],
});
