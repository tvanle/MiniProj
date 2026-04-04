import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
}

export default function StarRating({ rating, onRatingChange, maxStars = 5 }: StarRatingProps) {
  const scaleAnims = useRef(Array.from({ length: maxStars }, () => new Animated.Value(1))).current;

  const handlePress = (index: number) => {
    const newRating = index + 1;
    onRatingChange(newRating);

    Animated.sequence([
      Animated.timing(scaleAnims[index], { toValue: 1.5, duration: 120, useNativeDriver: true }),
      Animated.spring(scaleAnims[index], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Đánh giá dịch vụ</Text>
      <View style={styles.stars}>
        {Array.from({ length: maxStars }, (_, i) => (
          <TouchableOpacity key={i} onPress={() => handlePress(i)} activeOpacity={0.7}>
            <Animated.View style={{ transform: [{ scale: scaleAnims[i] }] }}>
              <Ionicons
                name={i < rating ? 'star' : 'star-outline'}
                size={36}
                color={i < rating ? '#FFD700' : '#CBD5E1'}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
      {rating === 5 && (
        <Text style={styles.bonus}>Xuất sắc! Thêm giảm giá 5%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 12 },
  label: { fontSize: 14, color: '#64748B', marginBottom: 8, fontWeight: '500' },
  stars: { flexDirection: 'row', gap: 8 },
  bonus: { marginTop: 8, color: '#10B981', fontWeight: '700', fontSize: 13 },
});
