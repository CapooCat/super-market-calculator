import Dexie, { Table } from 'dexie';

// Define the database schema
export interface IKeyValue<T = any> {
  key: string;
  value: T;
}

export class SuperMarketDB extends Dexie {
  keyValueStore!: Table<IKeyValue>;

  constructor() {
    super('supermarket-calculator-db');

    this.version(1).stores({
      keyValueStore: 'key' // Primary key
    });
  }
}

// Export singleton instance
export const db = new SuperMarketDB();
