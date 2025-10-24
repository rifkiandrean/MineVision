
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.js';

// --- DATA TO SEED ---
const bills = [
    { billId: 'VND-TKN-08-001', vendorName: 'PT. Trakindo Utama', amount: 250000000, billDate: '2024-08-02', dueDate: '2024-09-01', status: 'Unpaid' },
    { billId: 'VND-PRT-08-005', vendorName: 'PT. Pertamina Patra Niaga', amount: 450000000, billDate: '2024-08-05', dueDate: '2024-08-20', status: 'Unpaid' },
    { billId: 'VND-SLM-07-112', vendorName: 'PT. Selamat Sempurna', amount: 85000000, billDate: '2024-07-18', dueDate: '2024-08-17', status: 'Unpaid' },
    { billId: 'VND-PRT-07-301', vendorName: 'PT. Pertamina Patra Niaga', amount: 480000000, billDate: '2024-07-20', dueDate: '2024-08-05', status: 'Paid' },
    { billId: 'VND-BKT-07-050', vendorName: 'PT. Bukit Makmur Mandiri Utama', amount: 1200000000, billDate: '2024-07-10', dueDate: '2024-08-09', status: 'Overdue' },
    { billId: 'VND-TKN-07-098', vendorName: 'PT. Trakindo Utama', amount: 310000000, billDate: '2024-07-25', dueDate: '2024-08-24', status: 'Paid' },
];
// --- END OF DATA ---


async function seedDatabase() {
  console.log('--- Seeding Bills (AP) ---');
  let app;
  try {
    app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const batch = writeBatch(db);
    
    let count = 0;
    for (const bill of bills) {
      const docRef = collection(db, 'bills').doc(); // Auto-generate ID
      batch.set(docRef, bill);
      count++;
    }

    await batch.commit();
    console.log(`✅ Success! Seeded ${count} bills.`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
