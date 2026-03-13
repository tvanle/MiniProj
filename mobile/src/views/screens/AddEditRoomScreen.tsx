// ==========================================
// VIEW: Màn hình Thêm / Sửa phòng trọ
// Tương đương AddEditRoomActivity trong Android
// ==========================================

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StyleSheet,
    Switch,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RoomStatus } from '../../types';
import { roomController } from '../../controllers/RoomController';
import { ValidationError } from '../../utils/Validator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddEditRoom'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'AddEditRoom'>;

/**
 * AddEditRoomScreen - Màn hình thêm/sửa phòng
 * View trong mô hình MVC
 */
const AddEditRoomScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ScreenRouteProp>();

    const { mode, room } = route.params;
    const isEditing = mode === 'edit';

    // Form state
    const [roomId, setRoomId] = useState('');
    const [roomName, setRoomName] = useState('');
    const [price, setPrice] = useState('');
    const [isOccupied, setIsOccupied] = useState(false);
    const [tenantName, setTenantName] = useState('');
    const [tenantPhone, setTenantPhone] = useState('');
    const [errors, setErrors] = useState<ValidationError[]>([]);

    /**
     * Load dữ liệu phòng khi sửa
     */
    useEffect(() => {
        if (isEditing && room) {
            setRoomId(room.roomId);
            setRoomName(room.roomName);
            setPrice(room.price.toString());
            setIsOccupied(room.status === RoomStatus.OCCUPIED);
            setTenantName(room.tenantName);
            setTenantPhone(room.tenantPhone);
        }
    }, [isEditing, room]);

    /**
     * Lấy error message cho một field
     */
    const getFieldError = (field: string): string | undefined => {
        return errors.find((e) => e.field === field)?.message;
    };

    /**
     * Xử lý lưu phòng (Thêm / Cập nhật)
     * Gửi dữ liệu tới Controller để xử lý
     */
    const handleSave = () => {
        const formData = {
            roomId: roomId.trim(),
            roomName: roomName.trim(),
            price: price.trim(),
            tenantName: tenantName.trim(),
            tenantPhone: tenantPhone.trim(),
            isOccupied,
        };

        let result;
        if (isEditing && room) {
            // UPDATE - Cập nhật qua Controller
            result = roomController.updateRoom(room.roomId, formData);
        } else {
            // CREATE - Thêm mới qua Controller
            result = roomController.addRoom(formData);
        }

        if (result.success) {
            Alert.alert('✅ Thành công', result.message, [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } else if (result.errors) {
            setErrors(result.errors);
            // Hiển thị lỗi đầu tiên
            Alert.alert('❌ Lỗi nhập liệu', result.errors[0].message);
        } else {
            Alert.alert('❌ Lỗi', result.message || 'Đã xảy ra lỗi!');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                    >
                        <Text style={styles.backBtnText}>← Quay lại</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {isEditing ? '✏️ Sửa phòng' : '➕ Thêm phòng mới'}
                    </Text>
                </View>

                <ScrollView
                    style={styles.form}
                    contentContainerStyle={styles.formContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Mã phòng */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Mã phòng *</Text>
                        <TextInput
                            style={[styles.input, getFieldError('roomId') && styles.inputError]}
                            value={roomId}
                            onChangeText={(text) => {
                                setRoomId(text);
                                setErrors(errors.filter((e) => e.field !== 'roomId'));
                            }}
                            placeholder="VD: P001"
                            placeholderTextColor="#9ca3af"
                            editable={!isEditing}
                        />
                        {getFieldError('roomId') && (
                            <Text style={styles.errorText}>{getFieldError('roomId')}</Text>
                        )}
                    </View>

                    {/* Tên phòng */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Tên phòng *</Text>
                        <TextInput
                            style={[styles.input, getFieldError('roomName') && styles.inputError]}
                            value={roomName}
                            onChangeText={(text) => {
                                setRoomName(text);
                                setErrors(errors.filter((e) => e.field !== 'roomName'));
                            }}
                            placeholder="VD: Phòng 101"
                            placeholderTextColor="#9ca3af"
                        />
                        {getFieldError('roomName') && (
                            <Text style={styles.errorText}>{getFieldError('roomName')}</Text>
                        )}
                    </View>

                    {/* Giá thuê */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Giá thuê (VNĐ) *</Text>
                        <TextInput
                            style={[styles.input, getFieldError('price') && styles.inputError]}
                            value={price}
                            onChangeText={(text) => {
                                setPrice(text);
                                setErrors(errors.filter((e) => e.field !== 'price'));
                            }}
                            placeholder="VD: 2500000"
                            placeholderTextColor="#9ca3af"
                            keyboardType="numeric"
                        />
                        {getFieldError('price') && (
                            <Text style={styles.errorText}>{getFieldError('price')}</Text>
                        )}
                    </View>

                    {/* Tình trạng phòng */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Tình trạng phòng</Text>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>
                                {isOccupied ? '🔴 Đã thuê' : '🟢 Còn trống'}
                            </Text>
                            <Switch
                                value={isOccupied}
                                onValueChange={(value) => {
                                    setIsOccupied(value);
                                    if (!value) {
                                        setTenantName('');
                                        setTenantPhone('');
                                        setErrors(
                                            errors.filter(
                                                (e) =>
                                                    e.field !== 'tenantName' && e.field !== 'tenantPhone'
                                            )
                                        );
                                    }
                                }}
                                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                                thumbColor={isOccupied ? '#ef4444' : '#22c55e'}
                            />
                        </View>
                    </View>

                    {/* Thông tin người thuê (chỉ hiện khi đã thuê) */}
                    {isOccupied && (
                        <View style={styles.tenantSection}>
                            <Text style={styles.sectionTitle}>👤 Thông tin người thuê</Text>

                            {/* Tên người thuê */}
                            <View style={styles.field}>
                                <Text style={styles.label}>Tên người thuê *</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        getFieldError('tenantName') && styles.inputError,
                                    ]}
                                    value={tenantName}
                                    onChangeText={(text) => {
                                        setTenantName(text);
                                        setErrors(errors.filter((e) => e.field !== 'tenantName'));
                                    }}
                                    placeholder="VD: Nguyễn Văn A"
                                    placeholderTextColor="#9ca3af"
                                />
                                {getFieldError('tenantName') && (
                                    <Text style={styles.errorText}>
                                        {getFieldError('tenantName')}
                                    </Text>
                                )}
                            </View>

                            {/* Số điện thoại */}
                            <View style={styles.field}>
                                <Text style={styles.label}>Số điện thoại *</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        getFieldError('tenantPhone') && styles.inputError,
                                    ]}
                                    value={tenantPhone}
                                    onChangeText={(text) => {
                                        setTenantPhone(text);
                                        setErrors(errors.filter((e) => e.field !== 'tenantPhone'));
                                    }}
                                    placeholder="VD: 0901234567"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                                {getFieldError('tenantPhone') && (
                                    <Text style={styles.errorText}>
                                        {getFieldError('tenantPhone')}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Nút hành động */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelBtnText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.saveBtn]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveBtnText}>
                                {isEditing ? '💾 Cập nhật' : '➕ Thêm phòng'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    flex: {
        flex: 1,
    },
    header: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    backBtn: {
        marginBottom: 8,
    },
    backBtnText: {
        color: '#c7d2fe',
        fontSize: 14,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    form: {
        flex: 1,
    },
    formContent: {
        padding: 16,
        paddingBottom: 40,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        color: '#1f2937',
    },
    inputError: {
        borderColor: '#ef4444',
        borderWidth: 2,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    switchLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    tenantSection: {
        backgroundColor: '#fff7ed',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#fed7aa',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    btn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#e5e7eb',
    },
    cancelBtnText: {
        color: '#4b5563',
        fontWeight: '600',
        fontSize: 15,
    },
    saveBtn: {
        backgroundColor: '#4f46e5',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default AddEditRoomScreen;
