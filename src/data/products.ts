// Dummy product data for Shree Gopal Agency stationery store
import notebookImg from '@/assets/notebook.jpg';
import pensImg from '@/assets/pens.jpg';
import pencilsImg from '@/assets/pencils.jpg';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
  brand: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Spiral Notebook A4",
    description: "High-quality 200-page spiral notebook with ruled paper, perfect for students and professionals.",
    price: 150,
    originalPrice: 200,
    image: notebookImg,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    category: "Notebooks",
    brand: "ClassMate",
    stock: 45
  },
  {
    id: 2,
    name: "Blue Ballpoint Pen Set (Pack of 10)",
    description: "Smooth writing blue ballpoint pens with comfortable grip. Perfect for daily use.",
    price: 80,
    originalPrice: 100,
    image: pensImg,
    rating: 4.2,
    reviews: 89,
    inStock: true,
    category: "Pens",
    brand: "Reynolds",
    stock: 120
  },
  {
    id: 3,
    name: "HB Pencils with Eraser (Pack of 12)",
    description: "Premium quality HB pencils with attached erasers. Ideal for drawing and writing.",
    price: 60,
    image: pencilsImg,
    rating: 4.3,
    reviews: 156,
    inStock: true,
    category: "Pencils",
    brand: "Apsara",
    stock: 85
  },
  {
    id: 4,
    name: "A4 Ruled Notebook 300 Pages",
    description: "Extra thick notebook with 300 ruled pages. Perfect for extensive note-taking.",
    price: 220,
    originalPrice: 280,
    image: notebookImg,
    rating: 4.6,
    reviews: 67,
    inStock: true,
    category: "Notebooks",
    brand: "Navneet",
    stock: 30
  },
  {
    id: 5,
    name: "Gel Pen Set Multi-Color (Pack of 8)",
    description: "Vibrant gel pens in 8 different colors. Smooth flow and quick-dry ink.",
    price: 120,
    image: pensImg,
    rating: 4.4,
    reviews: 201,
    inStock: true,
    category: "Pens",
    brand: "Flair",
    stock: 75
  },
  {
    id: 6,
    name: "Mechanical Pencils 0.7mm (Pack of 5)",
    description: "Precision mechanical pencils with 0.7mm lead. Includes extra lead refills.",
    price: 95,
    originalPrice: 120,
    image: pencilsImg,
    rating: 4.1,
    reviews: 94,
    inStock: false,
    category: "Pencils",
    brand: "Pilot",
    stock: 0
  },
  {
    id: 7,
    name: "Executive Leather Bound Notebook",
    description: "Premium leather-bound notebook with dotted pages. Perfect for professionals.",
    price: 450,
    originalPrice: 600,
    image: notebookImg,
    rating: 4.8,
    reviews: 43,
    inStock: true,
    category: "Notebooks",
    brand: "Parker",
    stock: 15
  },
  {
    id: 8,
    name: "Fountain Pen with Ink Cartridges",
    description: "Classic fountain pen with 6 ink cartridges. Elegant writing experience.",
    price: 180,
    image: pensImg,
    rating: 4.3,
    reviews: 78,
    inStock: true,
    category: "Pens",
    brand: "Camlin",
    stock: 25
  }
];

export const categories = [
  "All",
  "Notebooks",
  "Pens", 
  "Pencils",
  "Erasers",
  "Rulers",
  "Markers",
  "Files"
];

export const brands = [
  "All",
  "ClassMate",
  "Reynolds",
  "Apsara",
  "Navneet",
  "Flair",
  "Pilot",
  "Parker",
  "Camlin"
];