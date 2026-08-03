export interface Borrow {
  id: number;
  bookId: number;
  borrowerName: string;
  bookTitle: string;
  borrowDate: string;
  returnDate: string | null;
  returned?: boolean;
  pricePaid?: number;
}

export interface BorrowRequest {
  bookId: number;
  borrowerName: string;
}
