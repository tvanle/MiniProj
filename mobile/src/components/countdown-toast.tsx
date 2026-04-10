import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

type Props = {
  movieTitle: string;
  showDateTime: string;
  visible: boolean;
  onCountdownEnd: () => void;
};

const formatCountdown = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export default function CountdownToast({ movieTitle, showDateTime, visible, onCountdownEnd }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      setCollapsed(false);
      return;
    }

    const showDate = new Date(showDateTime).getTime();
    const diff = Math.max(0, Math.floor((showDate - Date.now()) / 1000));
    setSecondsLeft(diff);

    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onCountdownEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, showDateTime]);

  if (!visible) return null;

  // Collapsed: small floating badge
  if (collapsed) {
    return (
      <Animated.View style={[styles.collapsedContainer, { opacity }]}>
        <TouchableOpacity style={styles.collapsedBadge} onPress={() => setCollapsed(false)}>
          <Text style={styles.collapsedText}>🎬 {formatCountdown(secondsLeft)}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Expanded: full toast
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.toast}>
        <Text style={styles.icon}>🎬</Text>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{movieTitle}</Text>
          <Text style={styles.countdown}>Còn {formatCountdown(secondsLeft)} nữa là chiếu!</Text>
        </View>
        <TouchableOpacity style={styles.collapseBtn} onPress={() => setCollapsed(true)}>
          <Text style={styles.collapseBtnText}>▲</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  icon: { fontSize: 28, marginRight: 12 },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  countdown: { fontSize: 13, color: '#ffccd5', marginTop: 2 },
  collapseBtn: {
    marginLeft: 8,
    padding: 6,
  },
  collapseBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  collapsedContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 999,
  },
  collapsedBadge: {
    backgroundColor: '#e94560',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  collapsedText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
