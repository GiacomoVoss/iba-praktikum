/**
 * =============================================================================
 * BEISPIEL-ENTITÄT: Produkt  (src/entities/Produkt.ts)
 * =============================================================================
 *
 * Diese Datei zeigt, wie du eine eigene Entität (= Datenbanktabelle) erstellst.
 * Kopiere diese Datei als Vorlage für deine eigenen Entitäten.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  CHECKLISTE FÜR EINE NEUE ENTITÄT                                       │
 * │                                                                         │
 * │  [ ] 1. Kopiere diese Datei: cp Produkt.ts MeineEntitaet.ts             │
 * │  [ ] 2. Benenne die Klasse um: `export class MeineEntitaet { ... }`     │
 * │  [ ] 3. Passe die Spalten (@Column) an dein Datenmodell an              │
 * │  [ ] 4. Registriere die Entität in src/data-source.ts                   │
 * │  [ ] 5. Erstelle zugehörige Routen in src/routes/                       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * VERFÜGBARE DECORATOR-TYPEN (Auswahl):
 *
 *   @PrimaryGeneratedColumn()          → Auto-Increment ID (Primärschlüssel)
 *   @Column()                          → Pflichtspalte (Text)
 *   @Column({ type: 'text', nullable: true }) → Optionale Textspalte (type immer angeben!)
 *   @Column({ unique: true })          → Eindeutiger Wert (kein Duplikat)
 *   @Column({ default: 'wert' })       → Standardwert
 *   @Column('int')                     → Ganzzahl
 *   @Column('decimal', { precision: 10, scale: 2 })  → Dezimalzahl (z.B. Preis)
 *   @Column('boolean')                 → true / false
 *   @Column('text')                    → Langer Text
 *   @CreateDateColumn()                → Erstellungsdatum (automatisch)
 *   @UpdateDateColumn()                → Änderungsdatum (automatisch)
 *
 *   @ManyToOne(() => AndereEntitaet, ...) → Fremdschlüssel-Beziehung
 *
 * Weitere Infos: https://typeorm.io/entities
 * =============================================================================
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// @Entity() markiert diese Klasse als Datenbanktabelle.
// Der Tabellenname wird automatisch aus dem Klassennamen abgeleitet ("produkt").
@Entity()
export class Produkt {

  // Automatisch generierte, aufsteigende ID – jede Entität braucht genau einen
  // Primärschlüssel.
  @PrimaryGeneratedColumn()
  id!: number;

  // Einfache Textspalte – Pflichtfeld (darf nicht leer sein)
  @Column()
  name!: string;

  // Optionale Textspalte – nullable: true erlaubt NULL-Werte in der Datenbank
  // Hinweis: Bei nullable-Feldern muss type angegeben werden, damit TypeORM den
  // Datentyp korrekt erkennt (der TypeScript-Typ "string | null" reicht nicht aus).
  @Column({ type: 'text', nullable: true })
  beschreibung!: string | null;

  // Dezimalzahl: precision = Gesamtstellen, scale = Nachkommastellen
  @Column('decimal', { precision: 10, scale: 2 })
  preis!: number;

  // Ganzzahl mit Standardwert
  @Column('int', { default: 0 })
  lagerbestand!: number;

  // Boolean-Spalte mit Standardwert
  @Column({ default: true })
  verfuegbar!: boolean;

  // Wird automatisch auf das aktuelle Datum gesetzt, wenn der Datensatz angelegt wird
  @CreateDateColumn()
  erstelltAm!: Date;

  // Wird automatisch aktualisiert, wenn der Datensatz geändert wird
  @UpdateDateColumn()
  geaendertAm!: Date;
}
