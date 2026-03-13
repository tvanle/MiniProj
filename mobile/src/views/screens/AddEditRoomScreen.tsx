// ==========================================
// VIEW: Màn hình Thêm / Sửa phòng trọ
// Tương đương AddEditRoomActivity trong Android
// ==========================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Switch,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    TextInputProps,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RoomStatus } from '../../types';
import { roomController } from '../../controllers/RoomController';
import { ValidationError } from '../../utils/Validator';
import { AlertUtils } from '../../utils/AlertUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddEditRoom'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'AddEditRoom'>;

/**
 * Props cho FormField component
 */
interface FormFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    placeholder?: string;
    editable?: boolean;
    keyboardType?: TextInputProps['keyboardType'];
    maxLength?: number;
}

/**
 * FormField - Component tái sử dụng cho các trường nhập liệu
 * DRY: Trích xuất pattern lặp lại trong form
 */
const FormField: React.FC<FormFieldProps> = ({
    label,
    value,
    onChangeText,
    error,
    placeholder,
    editable = true,
    keyboardType = 'default',
    maxLength,
}) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, error && styles.inputError]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            editable={editable}
            keyboardType={keyboardType}
            maxLength={maxLength}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

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
    const getFieldError = useCallback((field: string): string | undefined => {
        return errors.find((e) => e.field === field)?.message;
    }, [errors]);

    /**
     * Xóa error của field khi user nhập liệu
     */
    const clearFieldError = useCallback((field: string) => {
        setErrors((prev) => prev.filter((e) => e.field !== field));
    }, []);

    /**
     * Handlers cho các trường nhập liệu
     */
    const handleRoomIdChange = useCallback((text: string) => {
        setRoomId(text);
        clearFieldError('roomId');
    }, [clearFieldError]);

    const handleRoomNameChange = useCallback((text: string) => {
        setRoomName(text);
        clearFieldError('roomName');
    }, [clearFieldError]);

    const handlePriceChange = useCallback((text: string) => {
        setPrice(text);
        clearFieldError('price');
    }, [clearFieldError]);

    const handleTenantNameChange = useCallback((text: string) => {
        setTenantName(text);
        clearFieldError('tenantName');
    }, [clearFieldError]);

    const handleTenantPhoneChange = useCallback((text: string) => {
        setTenantPhone(text);
        clearFieldError('tenantPhone');
    }, [clearFieldError]);

    /**
     * Xử lý thay đổi tình trạng phòng
     */
    const handleOccupiedChange = useCallback((value: boolean) => {
        setIsOccupied(value);
        if (!value) {
            setTenantName('');
            setTenantPhone('');
            setErrors((prev) =>
                prev.filter((e) => e.field !== 'tenantName' && e.field !== 'tenantPhone')
            );
        }
    }, []);

    /**
     * Xử lý quay lại
     */
    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    /**
     * Xử lý lưu phòng (Thêm / Cập nhật)
     */
    const handleSave = useCallback(() => {
        const formData = {
            roomId: roomId.trim(),
            roomName: roomName.trim(),
            price: price.trim(),
            tenantName: tenantName.trim(),
            tenantPhone: tenantPhone.trim(),
            isOccupied,
        };

        const result = isEditing && room
            ? roomController.updateRoom(room.roomId, formData)
            : roomController.addRoom(formData);

        if (result.success) {
            AlertUtils.alert('✅ Thành công', result.message || 'Lưu thành công', handleGoBack);
        } else if (result.errors) {
            setErrors(result.errors);
            AlertUtils.alert('❌ Lỗi nhập liệu', result.errors[0].message);
        } else {
            AlertUtils.alert('❌ Lỗi', result.message || 'Đã xảy ra lỗi!');
        }
    }, [roomId, roomName, price, tenantName, tenantPhone, isOccupied, isEditing, room, handleGoBack]);

    /**
     * Header title (memoized)
     */
    const headerTitle = useMemo(() =>
        isEditing ? '✏️ Sửa phòng' : '➕ Thêm phòng mới'
    , [isEditing]);

    /**
     * Save button text (memoized)
     */
    const saveButtonText = useMemo(() =>
        isEditing ? '💾 Cập nhật' : '➕ Thêm phòng'
    , [isEditing]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
                        <Text style={styles.backBtnText}>← Quay lại</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{headerTitle}</Text>
                </View>

                <ScrollView
                    style={styles.form}
                    contentContainerStyle={styles.formContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Mã phòng */}
                    <FormField
                        label="Mã phòng *"
                        value={roomId}
                        onChangeText={handleRoomIdChange}
                        error={getFieldError('roomId')}
                        placeholder="VD: P001"
                        editable={!isEditing}
                    />

                    {/* Tên phòng */}
                    <FormField
                        label="Tên phòng *"
                        value={roomName}
                        onChangeText={handleRoomNameChange}
                        error={getFieldError('roomName')}
                        placeholder="VD: Phòng 101"
                    />

                    {/* Giá thuê */}
                    <FormField
                        label="Giá thuê (VNĐ) *"
                        value={price}
                        onChangeText={handlePriceChange}
                        error={getFieldError('price')}
                        placeholder="VD: 2500000"
                        keyboardType="numeric"
                    />

                    {/* Tình trạng phòng */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Tình trạng phòng</Text>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>
                                {isOccupied ? '🔴 Đã thuê' : '🟢 Còn trống'}
                            </Text>
                            <Switch
                                value={isOccupied}
                                onValueChange={handleOccupiedChange}
                                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                                thumbColor={isOccupied ? '#ef4444' : '#22c55e'}
                            />
                        </View>
                    </View>

                    {/* Thông tin người thuê (chỉ hiện khi đã thuê) */}
                    {isOccupied && (
                        <View style={styles.tenantSection}>
                            <Text style={styles.sectionTitle}>👤 Thông tin người thuê</Text>

                            <FormField
                                label="Tên người thuê *"
                                value={tenantName}
                                onChangeText={handleTenantNameChange}
                                error={getFieldError('tenantName')}
                                placeholder="VD: Nguyễn Văn A"
                            />

                            <FormField
                                label="Số điện thoại *"
                                value={tenantPhone}
                                onChangeText={handleTenantPhoneChange}
                                error={getFieldError('tenantPhone')}
                                placeholder="VD: 0901234567"
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                    )}

                    {/* Nút hành động */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn]}
                            onPress={handleGoBack}
                        >
                            <Text style={styles.cancelBtnText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.saveBtn]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveBtnText}>{saveButtonText}</Text>
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
        backgroundColor: '#F9FAFB',
    },
    flex: {
        flex: 1,
    },
    header: {
        backgroundColor: '#6C63FF',
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
        borderColor: '#FF7675',
        borderWidth: 2,
    },
    errorText: {
        color: '#FF7675',
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
        backgroundColor: '#F0F4FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#D9E2FF',
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
        backgroundColor: '#6C63FF',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default AddEditRoomScreen;
