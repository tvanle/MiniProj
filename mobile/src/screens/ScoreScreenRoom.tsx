/**
 * ScoreScreenRoom - Man hinh xem diem (Room Database pattern)
 * Tuong duong voi ScoreActivity trong Android dung Room
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppDB } from '../dal/AppDB';
import { storageHelper } from '../dal/StorageHelper';
import { showAlert } from '../utils/alert';
import { ScoreView } from '../entities/ScoreView';
import type { RootStackParamList } from '../navigation/AppNavigator';

type ScoreNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Score'>;

export default function ScoreScreenRoom() {
  const navigation = useNavigation<ScoreNavigationProp>();
  const [scores, setScores] = useState<ScoreView[]>([]);
  const [username, setUsername] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      // Lay username tu SharedPreferences
      const user = await storageHelper.getUsername();
      setUsername(user);

      // Lay danh sach diem tu Room Database
      const db = await AppDB.getInstance();
      // Goi dao().getScores() - tuong duong db.dao().getScores() trong Android
      const scoreList = await db.dao().getScores();
      setScores(scoreList);
    } catch (error) {
      console.error('Load data error:', error);
      showAlert('Loi', 'Khong the tai du lieu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    showAlert('Xac nhan', 'Ban co muon dang xuat?', [
      { text: 'Huy', style: 'cancel' },
      {
        text: 'Dang xuat',
        style: 'destructive',
        onPress: async () => {
          await storageHelper.clearLoginState();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const renderScoreItem = ({ item, index }: { item: ScoreView; index: number }) => (
    <View style={[styles.scoreItem, index % 2 === 0 && styles.scoreItemEven]}>
      <View style={styles.scoreInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
      </View>
      <View style={[styles.scoreBadge, getScoreStyle(item.score)]}>
        <Text style={styles.scoreText}>{item.score}</Text>
      </View>
    </View>
  );

  const getScoreStyle = (score: number) => {
    if (score >= 8) return styles.scoreHigh;
    if (score >= 5) return styles.scoreMedium;
    return styles.scoreLow;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Dang tai...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bang diem (Room)</Text>
          <Text style={styles.headerSubtitle}>Xin chao, {username}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Dang xuat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={scores}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderScoreItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Chua co du lieu diem</Text>
          </View>
        }
        ListHeaderComponent={
          scores.length > 0 ? (
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Sinh vien / Mon hoc</Text>
              <Text style={styles.tableHeaderText}>Diem</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#5856D6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '500',
  },
  listContent: {
    padding: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#666',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreItemEven: {
    backgroundColor: '#fafafa',
  },
  scoreInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subject: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scoreBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreHigh: {
    backgroundColor: '#4CAF50',
  },
  scoreMedium: {
    backgroundColor: '#FF9800',
  },
  scoreLow: {
    backgroundColor: '#F44336',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});
