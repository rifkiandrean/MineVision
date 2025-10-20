// This script is used to seed the initial budget data into Firestore.
// To run this script, use the following command from your project root:
// node --loader ts-node/esm scripts/seed-budgets.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.js';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const budgetData = [
  { category: 'Bahan Bakar', budgeted: 500000000, actual: 450000000 },
  { category: 'Suku Cadang', budgeted: 300000000, actual: 320000000 },
  { category: 'Gaji Karyawan', budgeted: 750000000, actual: 750000000 },
  { category: 'Sewa Alat', budgeted: 200000000, actual: 180000000 },
  { category: 'Operasional', budgeted: 400000000, actual: 410000000 },
];

async function seedBudgets() {
  const budgetsCollection = collection(db, 'budgets');

  // Check if data already exists
  const q = query(budgetsCollection);
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    console.log('Budget data already exists. Skipping seeding.');
    return;
  }

  console.log('Seeding budget data...');
  for (const data of budgetData) {
    try {
      await addDoc(budgetsCollection, data);
      console.log(`Added budget for ${data.category}`);
    } catch (error) {
      console.error(`Error adding budget for ${data.category}: `, error);
    }
  }
  console.log('Seeding complete.');
}

seedBudgets().then(() => {
    // Manually exit to prevent script from hanging if Firestore connection is open.
    // This is a common requirement for Node.js scripts using Firebase client SDK.
    process.exit(0);
}).catch(error => {
    console.error("Seeding failed:", error);
    process.exit(1);
});

    