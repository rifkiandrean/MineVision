


export type User = {
    id: string;
    uid: string;
    email: string;
    department: string;
};

export type AppConfig = {
  websiteName: string;
  menuItems: { id: number; name: string; path: string }[];
  logoUrl?: string;
};

export type PaymentRequest = {
  id: string;
  requestor: string;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type Budget = {
  id:string;
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
  createdAt: string;
};

export type ITAsset = {
    id: string;
    assetId: string;
    type: string;
    user: string;
    status: 'In Use' | 'Standby' | 'Maintenance';
}

export type NetworkService = {
    id: string;
    name: string;
    status: 'Operational' | 'Degraded Performance' | 'Outage';
    uptime: number;
}

export type InventoryItem = {
  id: string;
  name: string;
  category: "Bahan Peledak" | "Suku Cadang" | "Bahan Bakar" | "Lainnya";
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

export type Asset = {
    id: string;
    assetId: string;
    name: string;
    type: string;
    location: string;
    status: 'Operasional' | 'Perawatan' | 'Siaga' | 'Rusak';
    purchaseDate: string;
    initialCost: number;
}

export type GeneralLedgerEntry = {
    id: string;
    date: string; // ISO 8601 format
    account: string;
    description: string;
    debit: number;
    credit: number;
};

export type Invoice = {
    id: string;
    invoiceId: string;
    customerName: string;
    amount: number;
    issueDate: string; // YYYY-MM-DD
    dueDate: string; // YYYY-MM-DD
    status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
};

export type Bill = {
    id: string;
    billId: string;
    vendorName: string;
    amount: number;
    billDate: string; // YYYY-MM-DD
    dueDate: string; // YYYY-MM-DD
    status: 'Unpaid' | 'Paid' | 'Overdue';
};

export type BankAccount = {
    id: string;
    accountName: string;
    bankName: string;
    accountNumber: string;
    balance: number;
};

export type Incident = {
    id: string;
    incidentId: string;
    type: 'Near Miss' | 'Hazard Report' | 'Property Damage' | 'First Aid' | 'Lost Time Injury';
    date: string;
    location: string;
    description: string;
    status: 'Open' | 'Investigasi' | 'Ditutup';
};

export type EquipmentStatus = {
  id: string;
  type: string;
  status: 'Operasional' | 'Perawatan' | 'Siaga' | 'Rusak';
  location: string;
  fuel: number;
  productivity: number;
};

export type MaintenanceTask = {
    id: string;
    taskId: string;
    assetId: string;
    type: 'Preventive' | 'Corrective';
    description: string;
    status: 'Terjadwal' | 'Dalam Pengerjaan' | 'Selesai' | 'Ditunda';
    scheduledDate?: string;
    completionDate?: string;
    downtimeHours?: number;
};

export type PayrollRun = {
    id: string;
    runId: string;
    period: string;
    payDate: string;
    totalGross: number;
    totalNet: number;
    status: 'Draft' | 'Processed' | 'Paid';
}

export type Payslip = {
    id: string;
    runId: string;
    userId: string;
    employeeName: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netPay: number;
}
    
export type EmployeeObjective = {
    id: string;
    description: string;
    target: string;
    progress: number; // 0-100
    status: 'On Track' | 'At Risk' | 'Off Track';
}

export type PerformanceReview = {
    id: string;
    reviewId: string;
    period: string;
    userId: string;
    employeeName: string;
    status: 'Not Started' | 'Self-Assessment' | 'Manager Review' | 'Completed';
    overallRating: number; // 1-5
    objectives?: EmployeeObjective[];
}

export type AttendanceRecord = {
    id: string;
    userId: string;
    date: string; // YYYY-MM-DD
    status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Cuti' | 'Libur';
    checkIn?: string | null; // ISO 8601
    checkOut?: string | null; // ISO 8601
    shift: string; // e.g., 'S1', 'S2', 'S3'
}

    