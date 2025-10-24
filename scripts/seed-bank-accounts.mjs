
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: The `initializeApp` function does not require any arguments if the
// GOOGLE_APPLICATION_CREDENTIALS environment variable is set. This is the case
// with this project.
initializeApp();

const db = getFirestore();

const bankAccounts = [
  {
    accountName: 'Operasional Utama',
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '888-1234567',
    balance: 15250000000,
  },
  {
    accountName: 'Penerimaan Penjualan',
    bankName: 'Bank Mandiri',
    accountNumber: '123-00-9876543-2',
    balance: 7800000000,
  },
  {
    accountName: 'Pembayaran Gaji',
    bankName: 'Bank Negara Indonesia (BNI)',
    accountNumber: '012-3456-789',
    balance: 1500000000,
  },
  {
    accountName: 'Pembayaran Vendor',
    bankName: 'Bank Rakyat Indonesia (BRI)',
    accountNumber: '0341-01-001234-56-7',
    balance: 550000000,
  },
  {
    accountName: 'Kas Kecil (Petty Cash)',
    bankName: 'Bank CIMB Niaga',
    accountNumber: '70-1234-5678',
    balance: 75000000,
  },
];


async function seedBankAccounts() {
  const collectionRef = db.collection('bankAccounts');
  
  console.log('Seeding bank accounts...');

  for (const account of bankAccounts) {
    try {
      const docRef = collectionRef.doc(); // Auto-generate ID
      await docRef.set(account);
      console.log(`  -> Successfully seeded bank account: ${account.accountName} - ${account.bankName}`);
    } catch (error) {
      console.error(`  -> Error seeding account ${account.accountName}: `, error);
    }
  }

  console.log('Bank account seeding complete.');
}

seedBankAccounts().catch(console.error);

    