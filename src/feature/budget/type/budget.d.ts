export interface BudgetItem{
  id?:string
  meetingId: string;
  name: string;
  amount: number;
  category:string
}

export interface PostBudgetItem {
  meetingId: string;
  name: string;
  amount: number;
  category: string;
}

export interface Chart {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface Leader{
  meetingId: string;
  userId: string;
  bank: string;
  acount: string;
}