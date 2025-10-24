
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.js';

// --- DATA TO SEED ---
const invoices = [
    { invoiceId: 'INV-2024-08-001', customerName: 'PT. Listrik Negara', amount: 1500000000, issueDate: '2024-08-01', dueDate: '2024-08-31', status: 'Sent' },
    { invoiceId: 'INV-2024-08-002', customerName: 'PT. Semen Indonesia', amount: 850000000, issueDate: '2024-08-05', dueDate: '2024-09-04', status: 'Sent' },
    { invoiceId: 'INV-2024-07-150', customerName: 'PT. Baja Perkasa', amount: 1200000000, issueDate: '2024-07-15', dueDate: '2024-08-14', status: 'Overdue' },
    { invoiceId: 'INV-2024-07-149', customerName: 'PT. Listrik Negara', amount: 1450000000, issueDate: '2024-07-10', dueDate: '2024-08-09', status: 'Paid' },
    { invoiceId: 'INV-2024-08-003', customerName: 'PT. Keramik Jaya', amount: 600000000, issueDate: '2024-08-10', dueDate: '2024-09-09', status: 'Sent' },
    { invoiceId: 'INV-2024-06-210', customerName: 'PT. Semen Indonesia', amount: 900000000, issueDate: '2024-06-25', dueDate: '2024-07-25', status: 'Paid' },
    { invoiceId: 'INV-2024-08-004', customerName: 'PT. Baja Perkasa', amount: 1100000000, issueDate: '2024-08-12', dueDate: '2024-09-11', status: 'Draft' },
];
// --- END OF DATA ---


async function seedDatabase() {
  console.log('--- Seeding Invoices (AR) ---');
  let app;
  try {
    app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const batch = writeBatch(db);
    
    let count = 0;
    for (const invoice of invoices) {
      const docRef = collection(db, 'invoices').doc(); // Auto-generate ID
      batch.set(docRef, invoice);
      count++;
    }

    await batch.commit();
    console.log(`✅ Success! Seeded ${count} invoices.`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
