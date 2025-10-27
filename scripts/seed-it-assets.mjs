
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.ts';

// --- DATA TO SEED ---
const assetsToSeed = [
  { assetId: 'LAP-001', type: 'Laptop', user: 'Rifki Andrean', status: 'In Use' },
  { assetId: 'LAP-002', type: 'Laptop', user: 'Thoriq', status: 'In Use' },
  { assetId: 'PRN-001', type: 'Printer', user: 'Office', status: 'Standby' },
  { assetId: 'SRV-001', type: 'Server', user: 'Data Center', status: 'Maintenance' },
];
// --- END OF DATA ---


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  const assetsCollection = collection(db, 'itAssets');
  const batch = writeBatch(db);

  assetsToSeed.forEach((asset) => {
    // We use assetId as the document ID for easy lookup
    const docRef = collection(db, 'itAssets').doc(asset.assetId);
    batch.set(docRef, asset);
  });

  try {
    await batch.commit();
    console.log(`Successfully seeded ${assetsToSeed.length} IT assets.`);
  } catch (error) {
    console.error('Error seeding IT assets:', error);
  }
}

seedData().then(() => {
  // The process will exit automatically.
});
