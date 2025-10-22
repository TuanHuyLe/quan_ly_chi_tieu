
export interface Member {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string; // Member ID
  splitForIds: string[]; // Array of Member IDs
  date: string; // ISO string
}

export interface SimplifiedDebt {
  from: Member;
  to: Member;
  amount: number;
}
