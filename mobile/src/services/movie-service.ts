import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Movie, Theater, Showtime } from '../models/types';

// Seed data for movies
const SEED_MOVIES: Movie[] = [
  {
    id: 'movie-1',
    title: 'Avengers: Endgame',
    genre: 'Action / Sci-Fi',
    duration: 181,
    rating: 8.4,
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9SlTR1hp7e.jpg',
    description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos actions and restore balance to the universe.',
  },
  {
    id: 'movie-2',
    title: 'Spider-Man: No Way Home',
    genre: 'Action / Adventure',
    duration: 148,
    rating: 8.2,
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    description: 'With Spider-Man identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
  },
  {
    id: 'movie-3',
    title: 'The Batman',
    genre: 'Action / Crime',
    duration: 176,
    rating: 7.8,
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city hidden corruption.',
  },
  {
    id: 'movie-4',
    title: 'Dune: Part Two',
    genre: 'Sci-Fi / Adventure',
    duration: 166,
    rating: 8.5,
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
  },
  {
    id: 'movie-5',
    title: 'Oppenheimer',
    genre: 'Drama / History',
    duration: 180,
    rating: 8.3,
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
  },
];

const SEED_THEATERS: Theater[] = [
  { id: 'theater-1', name: 'CGV Vincom Center', location: 'Q.1, TP.HCM', totalSeats: 120 },
  { id: 'theater-2', name: 'Lotte Cinema Nowzone', location: 'Q.5, TP.HCM', totalSeats: 100 },
  { id: 'theater-3', name: 'Galaxy Nguyễn Du', location: 'Q.1, TP.HCM', totalSeats: 80 },
];

// Generate showtimes for next 3 days
const generateShowtimes = (): Showtime[] => {
  const showtimes: Showtime[] = [];
  const times = ['10:00', '13:30', '16:00', '19:00', '21:30'];
  let id = 1;

  for (const movie of SEED_MOVIES) {
    for (const theater of SEED_THEATERS) {
      for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0];

        // Pick 2-3 random times per theater per day
        const selectedTimes = times.slice(0, 2 + Math.floor(Math.random() * 2));
        for (const time of selectedTimes) {
          showtimes.push({
            id: `showtime-${id++}`,
            movieId: movie.id,
            theaterId: theater.id,
            dateTime: `${dateStr}T${time}:00`,
            price: 75000 + Math.floor(Math.random() * 4) * 10000,
            availableSeats: 30 + Math.floor(Math.random() * 70),
          });
        }
      }
    }
  }
  return showtimes;
};

// Seed Firestore with initial data
export const seedDatabase = async (): Promise<void> => {
  // Check if already seeded
  const moviesSnap = await getDocs(collection(db, 'movies'));
  if (!moviesSnap.empty) return;

  const batch: Promise<void>[] = [];

  for (const movie of SEED_MOVIES) {
    batch.push(setDoc(doc(db, 'movies', movie.id), movie));
  }
  for (const theater of SEED_THEATERS) {
    batch.push(setDoc(doc(db, 'theaters', theater.id), theater));
  }
  for (const showtime of generateShowtimes()) {
    batch.push(setDoc(doc(db, 'showtimes', showtime.id), showtime));
  }

  await Promise.all(batch);
};

export const getMovies = async (): Promise<Movie[]> => {
  const snap = await getDocs(collection(db, 'movies'));
  return snap.docs.map((d) => d.data() as Movie);
};

export const getTheaters = async (): Promise<Theater[]> => {
  const snap = await getDocs(collection(db, 'theaters'));
  return snap.docs.map((d) => d.data() as Theater);
};

export const getShowtimesForMovie = async (movieId: string): Promise<Showtime[]> => {
  const q = query(
    collection(db, 'showtimes'),
    where('movieId', '==', movieId),
    orderBy('dateTime', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Showtime);
};

export const getTheaterById = async (theaterId: string): Promise<Theater | null> => {
  const snap = await getDoc(doc(db, 'theaters', theaterId));
  return snap.exists() ? (snap.data() as Theater) : null;
};
