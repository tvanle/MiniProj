export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number; // minutes
  rating: number;
  poster: string; // URL
  description: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  totalSeats: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  dateTime: string; // ISO string
  price: number;
  availableSeats: number;
}

export interface Ticket {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  theaterId: string;
  movieTitle: string;
  theaterName: string;
  showDateTime: string;
  seatCount: number;
  totalPrice: number;
  createdAt: string;
}

// Navigation param types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  MovieDetail: { movie: Movie };
  BookTicket: { movie: Movie; showtime: Showtime; theater: Theater };
};

export type MainTabParamList = {
  Movies: undefined;
  MyTickets: undefined;
  Profile: undefined;
};
