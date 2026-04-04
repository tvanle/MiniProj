import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Pressable,
  ScrollView, Animated, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './star-rating';
import styles from './booking-styles';

const TICKET_TYPES = [
  { id: 'first',    label: 'Hạng nhất',  sublabel: 'First Class', price: 1500000, icon: 'diamond'   as const },
  { id: 'business', label: 'Thương gia', sublabel: 'Business',    price: 1300000, icon: 'briefcase' as const },
  { id: 'economy',  label: 'Phổ thông',  sublabel: 'Economy',     price: 1000000, icon: 'airplane'  as const },
];

const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' đ';

const computeTotal = (price: number, qty: number, disc: number, stars: number) => {
  const base = price * qty;
  let total = base - base * (disc / 100);
  if (stars === 5) total -= total * 0.05;
  return Math.round(total);
};

export default function BookingScreen() {
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [ticket, setTicket]     = useState(TICKET_TYPES[2]);
  const [quantity, setQuantity] = useState('');
  const [discount, setDiscount] = useState('');
  const [rating, setRating]     = useState(0);
  const [booked, setBooked]     = useState(false);
  const [total, setTotal]       = useState(0);
  const [error, setError]       = useState('');

  // Entrance animations
  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const cardFade    = useRef(new Animated.Value(0)).current;
  const cardSlide   = useRef(new Animated.Value(50)).current;

  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const btnScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(headerSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(cardSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleBook = () => {
    if (!name.trim())     { setError('Vui lòng nhập họ và tên.'); return; }
    if (!phone.trim())    { setError('Vui lòng nhập số điện thoại.'); return; }
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) { setError('Số lượng vé phải lớn hơn 0.'); return; }
    setError('');

    const disc = Math.min(100, Math.max(0, parseFloat(discount) || 0));
    setTotal(computeTotal(ticket.price, qty, disc, 0));
    setRating(0);
    setBooked(true);
    slideAnim.setValue(60);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const handleRatingChange = (r: number) => {
    setRating(r);
    const qty = parseInt(quantity, 10) || 0;
    const disc = Math.min(100, Math.max(0, parseFloat(discount) || 0));
    setTotal(computeTotal(ticket.price, qty, disc, r));
  };

  const pressIn  = () => Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(btnScale, { toValue: 1,    duration: 80, useNativeDriver: true }).start();

  // Remove browser default outline on web
  const inputStyle = [styles.input, Platform.OS === 'web' && { outlineStyle: 'none' }] as any;

  return (
    <LinearGradient colors={['#0F172A', '#1E3A5F', '#0F172A']} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.headerIcon}>
              <Ionicons name="airplane" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.headerTitle}>Đặt Vé Máy Bay</Text>
            <Text style={styles.headerSub}>Book your flight ticket</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View style={[styles.card, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}>
            <Text style={styles.sectionTitle}>Thông tin hành khách</Text>

            <View style={styles.inputGroup}>
              <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput style={inputStyle} placeholder="Họ và tên" placeholderTextColor="#94A3B8"
                value={name} onChangeText={setName} />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="call-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput style={inputStyle} placeholder="Số điện thoại" placeholderTextColor="#94A3B8"
                keyboardType="numeric" value={phone} onChangeText={(v) => setPhone(v.replace(/[^0-9]/g, ''))} />
            </View>

            <Text style={styles.sectionTitle}>Loại vé</Text>
            {TICKET_TYPES.map((t) => (
              <TouchableOpacity key={t.id} activeOpacity={0.8}
                style={[styles.radioRow, ticket.id === t.id && styles.radioRowActive]}
                onPress={() => setTicket(t)}>
                <View style={[styles.radioDot, ticket.id === t.id && styles.radioDotActive]}>
                  {ticket.id === t.id && <View style={styles.radioDotInner} />}
                </View>
                <Ionicons name={t.icon} size={18} color={ticket.id === t.id ? '#3B82F6' : '#64748B'} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.radioLabel, ticket.id === t.id && styles.radioLabelActive]}>{t.label}</Text>
                  <Text style={styles.radioSub}>{t.sublabel}</Text>
                </View>
                <Text style={[styles.radioPrice, ticket.id === t.id && styles.radioPriceActive]}>{formatVND(t.price)}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Ionicons name="ticket-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput style={inputStyle} placeholder="Số lượng vé" placeholderTextColor="#94A3B8"
                  keyboardType="numeric" value={quantity} onChangeText={(v) => setQuantity(v.replace(/[^0-9]/g, ''))} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Ionicons name="pricetag-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput style={inputStyle} placeholder="Ưu đãi %" placeholderTextColor="#94A3B8"
                  keyboardType="numeric" value={discount} onChangeText={(v) => setDiscount(v.replace(/[^0-9.]/g, ''))} />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={handleBook}>
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.bookBtn}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.bookBtnText}>Đặt Vé</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* Result Card */}
          {booked && (
            <Animated.View style={[styles.resultCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <LinearGradient colors={['#1E3A5F', '#0F2744']} style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                <Text style={styles.resultTitle}>Đặt Vé Thành Công!</Text>
              </LinearGradient>
              <View style={styles.resultBody}>
                <View style={styles.resultRow}>
                  <Ionicons name="person" size={16} color="#3B82F6" />
                  <Text style={styles.resultLabel}>Họ và tên</Text>
                  <Text style={styles.resultValue}>{name}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.resultRow}>
                  <Ionicons name="call" size={16} color="#3B82F6" />
                  <Text style={styles.resultLabel}>Điện thoại</Text>
                  <Text style={styles.resultValue}>{phone}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.resultRow}>
                  <Ionicons name="card" size={16} color="#F59E0B" />
                  <Text style={styles.resultLabel}>Tổng tiền</Text>
                  <Text style={[styles.resultValue, styles.totalText]}>{formatVND(total)}</Text>
                </View>
                <StarRating rating={rating} onRatingChange={handleRatingChange} />
              </View>
            </Animated.View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
