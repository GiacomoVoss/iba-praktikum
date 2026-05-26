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
 * │  2. Importiere sie hier (Schritt A)                                     │
 * │                                                                         │
 * │  3. Füge sie zur entities-Liste hinzu (Schritt B)                       │
 * │                                                                         │
 * │  ➜ Beim nächsten Start wird die Tabelle automatisch erzeugt!            │
 * └─────────────────────────────────────────────────────────────────────────┘
 * =============================================================================
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Eingebaute Entitäten (nicht verändern)
import { User } from './entities/User';

// ── Schritt A: Importiere hier deine eigenen Entitäten ────────────────────────
import { Produkt } from './entities/Produkt';
// import { MeineEntitaet } from './entities/MeineEntitaet';
// ──────────────────────────────────────────────────────────────────────────────

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

    // ── Schritt B: Füge deine eigenen Entitäten hier hinzu ──────────────────
    Produkt,
    // MeineEntitaet,
    // ──────────────────────────────────────────────────────────────────────────
  ],
});
