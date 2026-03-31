export interface LibraryBook {
  id?: number;
  title: string;
  author: string;
  isbn?: string;
  url?: string;
}

export interface DocumentLibrary {
  documentId: number;
  bookId: number;
}
