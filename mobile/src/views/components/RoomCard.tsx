// ==========================================
// VIEW COMPONENT: RoomCard
// Hiển thị thông tin 1 phòng trọ trong danh sách
// Tương đương item_room.xml trong Android
// ==========================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Room, RoomStatus } from '../../types';
import { formatCurrency } from '../../utils/Validator';

interface RoomCardProps {
    room: Room;
    onPress: (room: Room) => void;
    onLongPress: (room: Room) => void;
    onEdit: (room: Room) => void;
    onDelete: (room: Room) => void;
}

/**
 * RoomCard - Component hiển thị thông tin phòng trọ
 * Tô màu theo tình trạng: Xanh = Còn trống, Đỏ = Đã thuê
 */
const RoomCard: React.FC<RoomCardProps> = ({
    room,
    onPress,
    onLongPress,
    onEdit,
    onDelete,
}) => {
    const isAvailable = room.status === RoomStatus.AVAILABLE;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                isAvailable ? styles.cardAvailable : styles.cardOccupied,
            ]}
            onPress={() => onPress(room)}
            onLongPress={() => onLongPress(room)}
            activeOpacity={0.7}
        >
            {/* Header: Tên phòng + Badge tình trạng */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.roomId}>{room.roomId}</Text>
                    <Text style={styles.roomName}>{room.roomName}</Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        isAvailable ? styles.badgeAvailable : styles.badgeOccupied,
                    ]}
                >
                    <Text style={styles.statusText}>
                        {isAvailable ? '✅ Còn trống' : '🔴 Đã thuê'}
                    </Text>
                </View>
            </View>

            {/* Giá thuê */}
            <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>💰 Giá thuê:</Text>
                <Text style={styles.priceValue}>{formatCurrency(room.price)}</Text>
            </View>

            {/* Thông tin người thuê (nếu đã thuê) */}
            {!isAvailable && (
                <View style={styles.tenantInfo}>
                    <Text style={styles.tenantText}>👤 {room.tenantName}</Text>
                    <Text style={styles.tenantText}>📞 {room.tenantPhone}</Text>
                </View>
            )}

            {/* Nút Sửa / Xóa */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => onEdit(room)}
                >
                    <Text style={styles.actionBtnText}>✏️ Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => onDelete(room)}
                >
                    <Text style={styles.actionBtnText}>🗑️ Xóa</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardAvailable: {
        backgroundColor: '#E8F8F5',
        borderLeftWidth: 4,
        borderLeftColor: '#00B894',
    },
    cardOccupied: {
        backgroundColor: '#FFEEEE',
        borderLeftWidth: 4,
        borderLeftColor: '#FF7675',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLeft: {
        flex: 1,
    },
    roomId: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '600',
    },
    roomName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeAvailable: {
        backgroundColor: '#C8F7DC',
    },
    badgeOccupied: {
        backgroundColor: '#FFD6D6',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    priceLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginLeft: 4,
    },
    tenantInfo: {
        backgroundColor: '#F9FAFB',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    tenantText: {
        fontSize: 13,
        color: '#374151',
        marginVertical: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 4,
    },
    actionBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    editBtn: {
        backgroundColor: '#0984E3',
    },
    deleteBtn: {
        backgroundColor: '#FF7675',
    },
    actionBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
});

export default RoomCard;
