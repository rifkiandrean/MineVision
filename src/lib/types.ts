
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

export type LeaveRequest = {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type HelpdeskTicket = {
  id: string;
  ticketId: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed';
  userId: string;
  userEmail: string;
  createdAt: string;
};
