
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.mjs';

const productionStatusData = [
    { id: 'area-crusher', name: 'Area Crusher Plant', status: 'Optimal' },
    { id: 'area-hauling', name: 'Area Pengangkutan', status: 'Warning' },
    { id: 'area-barging', name: 'Area Pemuatan Tongkang', status: 'Optimal' },
    { id: 'area-stockpile', name: 'Area Stockpile', status: 'Halted' },
];

async function seedProductionStatus() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Get a new write batch
  const batch = writeBatch(db);

  // Set the data
  const statusCollection = collection(db, 'productionStatus');
  productionStatusData.forEach((status) => {
    const docRef = status.id ? collection(db, 'productionStatus', status.id) : collection(db, 'productionStatus');
    // @ts-ignore
    batch.set(docRef, status, { merge: true });
  });

  try {
    // Commit the batch
    await batch.commit();
    console.log('✅ Production status data seeded successfully.');
  } catch (error) {
    console.error('🔥 Error seeding production status data:', error);
  } finally {
    // In a script, you might want to terminate the process
    // For this simple script, we'll let it exit naturally.
    // Note: In a real-world scenario with persistent connections, you might need to explicitly close them.
    process.exit(0);
  }
}

seedProductionStatus();
