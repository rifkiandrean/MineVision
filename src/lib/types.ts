
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
  userEmail: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  location: string;
}

export type PurchaseRequestSC = {
    id: string;
    prId: string;
    item: string;
    quantity: number;
    department: string;
    requestDate: string;
    status: 'Pending' | 'Approved' | 'Ordered' | 'Received';
}

export type Shipment = {
    id: string;
    shipmentId: string;
    vesselName: string;
    cargoType: string;
    quantity: number;
    destinationPort: string;
    status: 'Scheduled' | 'Loading' | 'In Transit' | 'Discharged';
}
