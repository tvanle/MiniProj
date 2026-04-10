import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { auth } from '../../config/firebase-config';
import { getUserTickets } from '../../services/ticket-service';
import { Ticket } from '../../models/types';
import { formatDateTime, formatPrice } from '../../utils/formatters';

const isUpcoming = (dt: string) => new Date(dt) > new Date();

export default function MyTicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTickets = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const data = await getUserTickets(user.uid);
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  const renderTicket = ({ item }: { item: Ticket }) => {
    const upcoming = isUpcoming(item.showDateTime);
    return (
      <View style={[styles.ticket, upcoming && styles.ticketUpcoming]}>
        <View style={styles.ticketHeader}>
          <Text style={styles.movieTitle}>{item.movieTitle}</Text>
          <View style={[styles.badge, upcoming ? styles.badgeUpcoming : styles.badgePast]}>
            <Text style={styles.badgeText}>{upcoming ? 'Sắp chiếu' : 'Đã chiếu'}</Text>
          </View>
        </View>
        <Text style={styles.ticketDetail}>🏢 {item.theaterName}</Text>
        <Text style={styles.ticketDetail}>🕐 {formatDateTime(item.showDateTime)}</Text>
        <View style={styles.ticketFooter}>
          <Text style={styles.ticketDetail}>🎟 {item.seatCount} vé</Text>
          <Text style={styles.ticketPrice}>{formatPrice(item.totalPrice)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>🎟</Text>
            <Text style={styles.emptyText}>Chưa có vé nào</Text>
            <Text style={styles.emptySubtext}>Hãy đặt vé xem phim ngay!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e', paddingTop: 80 },
  list: { padding: 16, gap: 12 },
  ticket: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#555',
  },
  ticketUpcoming: { borderLeftColor: '#e94560' },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  movieTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1, marginRight: 8 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeUpcoming: { backgroundColor: '#e94560' },
  badgePast: { backgroundColor: '#555' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  ticketDetail: { fontSize: 14, color: '#aaa', marginBottom: 4 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  ticketPrice: { fontSize: 16, fontWeight: 'bold', color: '#e94560' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, color: '#fff', fontWeight: '600' },
  emptySubtext: { fontSize: 14, color: '#aaa', marginTop: 4 },
});
