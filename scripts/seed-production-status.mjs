import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.ts';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productionStatusData = [
  { id: 'area-penambangan-1', name: 'Area Penambangan 1', status: 'Optimal' },
  { id: 'crusher-plant-1', name: 'Crusher Plant 1', status: 'Warning' },
  { id: 'area-pengangkutan-1', name: 'Area Pengangkutan 1', status: 'Optimal' },
  { id: 'jetty-loading-1', name: 'Jetty Loading 1', status: 'Halted' },
];

async function seedProductionStatus() {
  const productionStatusRef = collection(db, 'productionStatus');
  const batch = writeBatch(db);

  console.log('Checking for existing production status data...');

  const existingIds = [];
  for (const item of productionStatusData) {
    const q = query(productionStatusRef, where('name', '==', item.name));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      existingIds.push(item.id);
      console.log(`- Data for "${item.name}" already exists. Skipping.`);
    }
  }
  
  let seededCount = 0;
  productionStatusData.forEach(item => {
    if (!existingIds.includes(item.id)) {
      const docRef = productionStatusRef.doc(item.id);
      batch.set(docRef, item);
      console.log(`- Queued seed for: ${item.name}`);
      seededCount++;
    }
  });

  if (seededCount > 0) {
    try {
      await batch.commit();
      console.log(`\nSuccessfully seeded ${seededCount} production status documents.`);
    } catch (error) {
      console.error('Error seeding production status data:', error);
    }
  } else {
    console.log('\nNo new production status data to seed.');
  }

  // Since this is a script, we should explicitly exit the process.
  // However, in the context of being called by npm, it might terminate automatically.
  // For robustness, especially if run standalone:
  process.exit(0);

}

seedProductionStatus().catch(err => {
    console.error("Seeding script failed:", err);
    process.exit(1);
});
