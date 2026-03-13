// ==========================================
// VIEW COMPONENT: StatisticsBar (Nâng cao)
// Hiển thị thống kê tổng quan phòng trọ
// ==========================================

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../../utils/Validator';

interface StatisticsBarProps {
    total: number;
    available: number;
    occupied: number;
    totalRevenue: number;
}

/**
 * StatisticsBar - Component hiển thị thống kê phòng trọ
 * Wrapped với React.memo để tránh re-render không cần thiết
 */
const StatisticsBar: React.FC<StatisticsBarProps> = ({
    total,
    available,
    occupied,
    totalRevenue,
}) => (
    <View style={styles.container}>
        <View style={styles.row}>
            <View style={[styles.statItem, styles.totalBg]}>
                <Text style={styles.statNumber}>{total}</Text>
                <Text style={styles.statLabel}>Tổng phòng</Text>
            </View>
            <View style={[styles.statItem, styles.availableBg]}>
                <Text style={styles.statNumber}>{available}</Text>
                <Text style={styles.statLabel}>Còn trống</Text>
            </View>
            <View style={[styles.statItem, styles.occupiedBg]}>
                <Text style={styles.statNumber}>{occupied}</Text>
                <Text style={styles.statLabel}>Đã thuê</Text>
            </View>
        </View>
        <View style={styles.revenueRow}>
            <Text style={styles.revenueLabel}>💰 Tổng doanh thu/tháng:</Text>
            <Text style={styles.revenueValue}>{formatCurrency(totalRevenue)}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 10,
    },
    totalBg: {
        backgroundColor: '#F0F4FF',
    },
    availableBg: {
        backgroundColor: '#E8F8F5',
    },
    occupiedBg: {
        backgroundColor: '#FFEEEE',
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    statLabel: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 2,
    },
    revenueRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    revenueLabel: {
        fontSize: 13,
        color: '#6b7280',
    },
    revenueValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#00B894',
        marginLeft: 6,
    },
});

// Export với React.memo để tối ưu re-render
export default memo(StatisticsBar);
