// ==========================================
// VIEW: Màn hình danh sách phòng trọ
// Tương đương MainActivity trong Android
// Sử dụng FlatList (= RecyclerView)
// ==========================================

import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Room, RoomStatus, RootStackParamList } from '../../types';
import { roomController } from '../../controllers/RoomController';
import { AlertUtils } from '../../utils/AlertUtils';
import RoomCard from '../components/RoomCard';
import StatisticsBar from '../components/StatisticsBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoomList'>;

/**
 * RoomListScreen - Màn hình chính hiển thị danh sách phòng
 * View trong mô hình MVC - chỉ xử lý hiển thị
 * Logic nghiệp vụ được xử lý bởi Controller
 */
const RoomListScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    // State cho View
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState<RoomStatus | 'ALL'>('ALL');
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        occupied: 0,
        totalRevenue: 0,
    });

    /**
     * Refresh dữ liệu từ Controller
     * Memoized với useCallback để tránh re-render không cần thiết
     */
    const refreshData = useCallback(() => {
        let data: Room[];

        // Tìm kiếm hoặc lọc theo filter
        if (searchText.trim()) {
            data = roomController.searchRooms(searchText);
        } else if (filterStatus !== 'ALL') {
            data = roomController.filterByStatus(filterStatus);
        } else {
            data = roomController.getAllRooms();
        }

        setRooms(data);
        setStats(roomController.getStatistics());
    }, [searchText, filterStatus]);

    /**
     * Load lại dữ liệu mỗi khi màn hình được focus
     */
    useFocusEffect(
        useCallback(() => {
            refreshData();
        }, [refreshData])
    );

    /**
     * Xử lý click vào phòng → mở sửa
     */
    const handlePress = useCallback((room: Room) => {
        navigation.navigate('AddEditRoom', { room, mode: 'edit' });
    }, [navigation]);

    /**
     * Xử lý sửa phòng
     */
    const handleEdit = useCallback((room: Room) => {
        navigation.navigate('AddEditRoom', { room, mode: 'edit' });
    }, [navigation]);

    /**
     * Xử lý xóa phòng - AlertDialog xác nhận
     */
    const handleDelete = useCallback((room: Room) => {
        AlertUtils.alert(
            '⚠️ Xác nhận xóa',
            `Bạn có chắc muốn xóa "${room.roomName}" không?\n\nThao tác này không thể hoàn tác!`,
            () => {
                const result = roomController.deleteRoom(room.roomId);
                if (result.success) {
                    AlertUtils.alert('✅ Thành công', result.message || 'Đã xóa phòng thành công!');
                    refreshData();
                } else {
                    AlertUtils.alert('❌ Lỗi', result.message || 'Xóa phòng thất bại!');
                }
            },
            () => { },
            'Xóa',
            'Hủy'
        );
    }, [refreshData]);

    /**
     * Xử lý long press → xóa phòng
     */
    const handleLongPress = useCallback((room: Room) => {
        handleDelete(room);
    }, [handleDelete]);

    /**
     * Xử lý thay đổi filter
     */
    const handleFilterChange = useCallback((status: RoomStatus | 'ALL') => {
        setFilterStatus(status);
        setSearchText('');
    }, []);

    /**
     * Xử lý thay đổi search text
     */
    const handleSearchChange = useCallback((text: string) => {
        setSearchText(text);
        setFilterStatus('ALL');
    }, []);

    /**
     * Điều hướng thêm phòng mới
     */
    const handleAddRoom = useCallback(() => {
        navigation.navigate('AddEditRoom', { mode: 'add' });
    }, [navigation]);

    /**
     * Render item trong FlatList (= RecyclerView)
     */
    const renderItem = useCallback(({ item }: { item: Room }) => (
        <RoomCard
            room={item}
            onPress={handlePress}
            onLongPress={handleLongPress}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    ), [handlePress, handleLongPress, handleEdit, handleDelete]);

    /**
     * Key extractor cho FlatList
     */
    const keyExtractor = useCallback((item: Room) => item.roomId, []);

    /**
     * Empty component khi không có phòng
     */
    const ListEmptyComponent = useMemo(() => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏚️</Text>
            <Text style={styles.emptyText}>Không có phòng nào</Text>
            <Text style={styles.emptySubtext}>
                Nhấn nút "+" để thêm phòng mới
            </Text>
        </View>
    ), []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🏠 Quản Lý Nhà Trọ</Text>
                <Text style={styles.headerSubtitle}>Room Rental Management</Text>
            </View>

            {/* Thanh tìm kiếm (nâng cao) */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍 Tìm kiếm phòng, người thuê..."
                    value={searchText}
                    onChangeText={handleSearchChange}
                    placeholderTextColor="#9ca3af"
                />
            </View>

            {/* Filter buttons (nâng cao) */}
            <View style={styles.filterRow}>
                {(['ALL', RoomStatus.AVAILABLE, RoomStatus.OCCUPIED] as const).map(
                    (status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterBtn,
                                filterStatus === status && styles.filterBtnActive,
                            ]}
                            onPress={() => handleFilterChange(status)}
                        >
                            <Text
                                style={[
                                    styles.filterBtnText,
                                    filterStatus === status && styles.filterBtnTextActive,
                                ]}
                            >
                                {status === 'ALL'
                                    ? 'Tất cả'
                                    : status === RoomStatus.AVAILABLE
                                        ? '🟢 Trống'
                                        : '🔴 Đã thuê'}
                            </Text>
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* Thống kê (nâng cao) */}
            <StatisticsBar {...stats} />

            {/* Danh sách phòng - FlatList (= RecyclerView) */}
            <FlatList
                data={rooms}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={ListEmptyComponent}
            />

            {/* Nút thêm phòng (FAB) */}
            <TouchableOpacity
                style={styles.fab}
                onPress={handleAddRoom}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#6C63FF',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#c7d2fe',
        marginTop: 2,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        color: '#1f2937',
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 10,
        gap: 8,
    },
    filterBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    filterBtnActive: {
        backgroundColor: '#6C63FF',
        borderColor: '#6C63FF',
    },
    filterBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6b7280',
    },
    filterBtnTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingBottom: 80,
        paddingTop: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyIcon: {
        fontSize: 48,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6b7280',
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    fabText: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RoomListScreen;
