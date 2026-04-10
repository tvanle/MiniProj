import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  runTransaction,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Ticket } from '../models/types';

export const bookTicket = async (
  ticket: Omit<Ticket, 'id' | 'createdAt'>
): Promise<string> => {
  const showtimeRef = doc(db, 'showtimes', ticket.showtimeId);

  // Use transaction to atomically check seats and book
  const ticketId = await runTransaction(db, async (transaction) => {
    const showtimeSnap = await transaction.get(showtimeRef);
    if (!showtimeSnap.exists()) {
      throw new Error('Suất chiếu không tồn tại');
    }

    const availableSeats = showtimeSnap.data().availableSeats;
    if (availableSeats < ticket.seatCount) {
      throw new Error(`Chỉ còn ${availableSeats} ghế trống`);
    }

    // Create ticket
    const ticketData = {
      ...ticket,
      createdAt: new Date().toISOString(),
    };
    const ticketRef = doc(collection(db, 'tickets'));
    transaction.set(ticketRef, ticketData);

    // Decrement available seats atomically
    transaction.update(showtimeRef, {
      availableSeats: increment(-ticket.seatCount),
    });

    return ticketRef.id;
  });

  return ticketId;
};

export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  const q = query(
    collection(db, 'tickets'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    ...(d.data() as Omit<Ticket, 'id'>),
    id: d.id,
  }));
};
