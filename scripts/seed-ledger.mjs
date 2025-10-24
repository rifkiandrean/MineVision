
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.js';

// --- DATA TO SEED ---
const ledgerEntries = [
  { date: '2024-08-01T10:00:00Z', account: 'Kas', description: 'Penerimaan modal awal', debit: 500000000, credit: 0 },
  { date: '2024-08-01T10:00:00Z', account: 'Modal Disetor', description: 'Penerimaan modal awal', debit: 0, credit: 500000000 },
  { date: '2024-08-02T11:30:00Z', account: 'Biaya Sewa Alat', description: 'Pembayaran sewa Excavator EX-06', debit: 25000000, credit: 0 },
  { date: '2024-08-02T11:30:00Z', account: 'Kas', description: 'Pembayaran sewa Excavator EX-06', debit: 0, credit: 25000000 },
  { date: '2024-08-03T14:00:00Z', account: 'Piutang Usaha', description: 'Penjualan batubara ke PT. Energi Prima', debit: 85000000, credit: 0 },
  { date: '2024-08-03T14:00:00Z', account: 'Pendapatan Penjualan', description: 'Penjualan batubara ke PT. Energi Prima', debit: 0, credit: 85000000 },
  { date: '2024-08-05T09:00:00Z', account: 'Biaya Gaji', description: 'Pembayaran gaji karyawan Juli', debit: 150000000, credit: 0 },
  { date: '2024-08-05T09:00:00Z', account: 'Kas', description: 'Pembayaran gaji karyawan Juli', debit: 0, credit: 150000000 },
  { date: '2024-08-08T16:20:00Z', account: 'Aset Tetap - Kendaraan', description: 'Pembelian 1 unit Dump Truck', debit: 1200000000, credit: 0 },
  { date: '2024-08-08T16:20:00Z', account: 'Hutang Usaha', description: 'Pembelian 1 unit Dump Truck dari PT. Otomotif', debit: 0, credit: 1200000000 },
  { date: '2024-08-10T13:00:00Z', account: 'Kas', description: 'Penerimaan pembayaran dari PT. Energi Prima', debit: 85000000, credit: 0 },
  { date: '2024-08-10T13:00:00Z', account: 'Piutang Usaha', description: 'Pelunasan faktur INV-001', debit: 0, credit: 85000000 },
  { date: '2024-08-12T10:15:00Z', account: 'Biaya Bahan Bakar', description: 'Pembelian solar untuk operasional', debit: 75000000, credit: 0 },
  { date: '2024-08-12T10:15:00Z', account: 'Kas', description: 'Pembelian solar dari Pertamina', debit: 0, credit: 75000000 },
];
// --- END OF DATA ---


async function seedDatabase() {
  console.log('--- Seeding General Ledger Entries ---');
  let app;
  try {
    app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const batch = writeBatch(db);
    const ledgerCollection = collection(db, 'generalLedger');

    let count = 0;
    for (const entry of ledgerEntries) {
      const docRef = collection(db, 'generalLedger').doc(); // Auto-generate ID
      batch.set(docRef, entry);
      count++;
    }

    await batch.commit();
    console.log(`✅ Success! Seeded ${count} general ledger entries.`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // In Node.js environment, you might not need to terminate the app explicitly
    // if the script is meant to run and exit.
    // await app.delete(); // This would be for client-side cleanup
    process.exit(0);
  }
}

seedDatabase();
