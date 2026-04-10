import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../models/types';
import { bookTicket } from '../../services/ticket-service';
import { scheduleShowtimeReminder } from '../../services/notification-service';
import { auth } from '../../config/firebase-config';
import { formatDateTime, formatPrice } from '../../utils/formatters';
import { showAlert, showConfirm } from '../../utils/platform-alert';

type Props = NativeStackScreenProps<RootStackParamList, 'BookTicket'>;

export default function BookTicketScreen({ route, navigation }: Props) {
  const { movie, showtime, theater } = route.params;
  const [seatCount, setSeatCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalPrice = seatCount * showtime.price;

  const doBook = async () => {
    try {
      setLoading(true);
      const ticketId = await bookTicket({
        userId: auth.currentUser!.uid,
        movieId: movie.id,
        showtimeId: showtime.id,
        theaterId: theater.id,
        movieTitle: movie.title,
        theaterName: theater.name,
        showDateTime: showtime.dateTime,
        seatCount,
        totalPrice,
      });

      await scheduleShowtimeReminder(
        movie.title, theater.name, showtime.dateTime, ticketId
      );

      showAlert('Thành công!', 'Đặt vé thành công!');
      navigation.popToTop();
    } catch (error: any) {
      showAlert('Lỗi', error.message || 'Đặt vé thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    if (!auth.currentUser) {
      showAlert('Lỗi', 'Vui lòng đăng nhập');
      return;
    }

    const msg = `${movie.title}\n${theater.name}\n${formatDateTime(showtime.dateTime)}\nSố vé: ${seatCount}\nTổng: ${formatPrice(totalPrice)}`;
    showConfirm(msg, doBook);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Movie Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin phim</Text>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.detail}>{movie.genre} • {movie.duration} phút</Text>
      </View>

      {/* Showtime Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suất chiếu</Text>
        <Text style={styles.detail}>🏢 {theater.name}</Text>
        <Text style={styles.detail}>📍 {theater.location}</Text>
        <Text style={styles.detail}>🕐 {formatDateTime(showtime.dateTime)}</Text>
        <Text style={styles.detail}>💰 {formatPrice(showtime.price)} / vé</Text>
        <Text style={styles.detail}>💺 Còn {showtime.availableSeats} ghế</Text>
      </View>

      {/* Seat Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Số lượng vé</Text>
        <View style={styles.seatSelector}>
          <TouchableOpacity
            style={styles.seatBtn}
            onPress={() => setSeatCount(Math.max(1, seatCount - 1))}
          >
            <Text style={styles.seatBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.seatCount}>{seatCount}</Text>
          <TouchableOpacity
            style={styles.seatBtn}
            onPress={() => setSeatCount(Math.min(showtime.availableSeats, seatCount + 1))}
          >
            <Text style={styles.seatBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
      </View>

      {/* Book Button */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={handleBook}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.bookBtnText}>Đặt Vé Ngay</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 16 },
  section: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#e94560', marginBottom: 10 },
  movieTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  detail: { fontSize: 15, color: '#ccc', marginBottom: 4, lineHeight: 22 },
  seatSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  seatBtn: {
    backgroundColor: '#0f3460',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatBtnText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  seatCount: { fontSize: 32, fontWeight: 'bold', color: '#fff', minWidth: 40, textAlign: 'center' },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  totalLabel: { fontSize: 18, color: '#aaa' },
  totalPrice: { fontSize: 24, fontWeight: 'bold', color: '#e94560' },
  bookBtn: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  bookBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
