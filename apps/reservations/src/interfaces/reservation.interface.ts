export interface Reservation {
  timestamp: Date;
  startDate: Date;
  endDate: Date;
  userId: string;
  charge: Charge;
}

export interface Charge {
  invoiceId: string;
  card: Card;
  amount: number;
}

export interface Card {
  cvc: string;
  exp_month: number;
  exp_year: number;
  number: string;
}
