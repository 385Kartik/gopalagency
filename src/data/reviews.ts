import { Product } from './products';

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
}

export const mockReviews: Review[] = [
  { id: 1, productId: 1, userName: 'Ananya R.', rating: 5, title: 'Excellent quality notebook!', comment: 'The paper quality is superb. No ink bleeding at all. Perfect for daily journaling and note-taking.', date: '2024-01-10', helpful: 12 },
  { id: 2, productId: 1, userName: 'Vikram S.', rating: 4, title: 'Good value for money', comment: 'Sturdy spiral binding and smooth pages. Slightly smaller than expected but overall a great buy.', date: '2024-01-08', helpful: 8 },
  { id: 3, productId: 1, userName: 'Priya M.', rating: 5, title: 'Best notebook I have used', comment: 'I have been using this for my college notes. The ruled lines are perfectly spaced. Highly recommend!', date: '2024-01-05', helpful: 15 },
  { id: 4, productId: 2, userName: 'Rohit K.', rating: 4, title: 'Smooth writing experience', comment: 'These pens write very smoothly. The grip is comfortable for long writing sessions.', date: '2024-01-12', helpful: 6 },
  { id: 5, productId: 2, userName: 'Sneha D.', rating: 5, title: 'Perfect for exams', comment: 'Best pen set at this price. Ink flow is consistent and does not smudge.', date: '2024-01-09', helpful: 10 },
  { id: 6, productId: 3, userName: 'Amit P.', rating: 4, title: 'Great pencils for drawing', comment: 'The HB grade is perfect. Erasers work well too. Good for both writing and sketching.', date: '2024-01-11', helpful: 7 },
  { id: 7, productId: 4, userName: 'Kavya L.', rating: 5, title: 'Thick and sturdy', comment: '300 pages is a lot! Perfect for an entire semester. The cover is durable too.', date: '2024-01-07', helpful: 9 },
  { id: 8, productId: 5, userName: 'Rahul G.', rating: 4, title: 'Vibrant colors', comment: 'All 8 colors are bright and beautiful. Great for color-coding notes and highlighting.', date: '2024-01-06', helpful: 5 },
  { id: 9, productId: 7, userName: 'Meera T.', rating: 5, title: 'Premium feel', comment: 'The leather binding is gorgeous. Makes a great gift for professionals. Paper quality is top-notch.', date: '2024-01-04', helpful: 18 },
  { id: 10, productId: 8, userName: 'Karan J.', rating: 4, title: 'Classic writing instrument', comment: 'Smooth ink flow and elegant design. The included cartridges last a good while.', date: '2024-01-03', helpful: 11 },
];

export const getReviewsForProduct = (productId: number): Review[] =>
  mockReviews.filter(r => r.productId === productId);
