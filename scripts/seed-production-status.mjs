
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.mjs';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const productionStatusData = [
  { id: 'area-crusher', name: 'Crusher Plant', status: 'Optimal' },
  { id: 'area-hauling', name: 'Hauling Road', status: 'Warning' },
  { id: 'area-stockpile', name: 'Stockpile', status: 'Optimal' },
  { id: 'area-barging', name: 'Barging Conveyor', status: 'Halted' },
];

async function seedProductionStatus() {
  console.log('Seeding production status data...');
  try {
    for (const status of productionStatusData) {
      // Use doc() to reference a document, not collection() with a full path.
      const docRef = doc(firestore, 'productionStatus', status.id);
      await setDoc(docRef, {
        name: status.name,
        status: status.status,
      }, { merge: true });
      console.log(`Successfully seeded: ${status.name}`);
    }
    console.log('Finished seeding production status data.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding production status data:', error);
    process.exit(1);
  }
}

seedProductionStatus();
