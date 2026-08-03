export interface Book {
  id: number;
  title: string;
  authorName: string;
  categories: string[];
  availableCopies: number;
  imageUrl?: string;
  content?: string;
  price?: number;
  ownerId?: number;
  ownerName?: string;
  ownerUpiId?: string;
  ownerQrImageUrl?: string;
}

export interface BookRequest {
  title: string;
  authorId: number;
  categoryIds: number[];
  availableCopies: number;
  imageUrl?: string;
  content?: string;
  price?: number;
}
