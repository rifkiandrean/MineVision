export type PaymentRequest = {
  id: string;
  requestor: string;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type Budget = {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
};

    