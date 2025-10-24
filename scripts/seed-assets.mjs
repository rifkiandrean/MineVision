import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.ts';

// Sample asset data
const assetsData = [
  {
    assetId: 'EX-01',
    name: 'Excavator Komatsu PC2000',
    type: 'Alat Gali',
    location: 'Pit A',
    status: 'Operasional',
    purchaseDate: '2022-01-15',
    initialCost: 15000000000,
  },
  {
    assetId: 'DT-50',
    name: 'Dump Truck CAT 777',
    type: 'Alat Angkut',
    location: 'Haul Road 2',
    status: 'Operasional',
    purchaseDate: '2021-11-20',
    initialCost: 8500000000,
  },
  {
    assetId: 'DZ-12',
    name: 'Dozer Komatsu D375A',
    type: 'Alat Dorong',
    location: 'Waste Dump C',
    status: 'Perawatan',
    purchaseDate: '2022-03-10',
    initialCost: 9800000000,
  },
  {
    assetId: 'GR-03',
    name: 'Motor Grader CAT 16M',
    type: 'Alat Perata',
    location: 'Workshop',
    status: 'Rusak',
    purchaseDate: '2020-08-01',
    initialCost: 6500000000,
  },
  {
    assetId: 'WL-08',
    name: 'Wheel Loader Komatsu WA600',
    type: 'Alat Muat',
    location: 'Stockpile ROM B',
    status: 'Siaga',
    purchaseDate: '2023-02-28',
    initialCost: 7200000000,
  },
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to seed data
async function seedAssets() {
  const assetsCollection = collection(db, 'assets');
  let count = 0;
  console.log('Seeding assets...');

  for (const asset of assetsData) {
    try {
      await addDoc(assetsCollection, asset);
      count++;
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  console.log(`Seeding complete. ${count} of ${assetsData.length} assets were added.`);
  // The script will exit automatically when all top-level await promises are resolved.
}

seedAssets();
