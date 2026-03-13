// ==========================================
// UTILS: Validate dữ liệu đầu vào
// ==========================================

export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validate thông tin phòng trọ
 */
export function validateRoom(data: {
    roomId: string;
    roomName: string;
    price: string;
    tenantName: string;
    tenantPhone: string;
    isOccupied: boolean;
    isEditing?: boolean;
    existingRoomIds?: string[];
}): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate mã phòng
    if (!data.roomId.trim()) {
        errors.push({ field: 'roomId', message: 'Mã phòng không được để trống' });
    } else if (!data.isEditing && data.existingRoomIds?.includes(data.roomId.trim())) {
        errors.push({ field: 'roomId', message: 'Mã phòng đã tồn tại' });
    }

    // Validate tên phòng
    if (!data.roomName.trim()) {
        errors.push({ field: 'roomName', message: 'Tên phòng không được để trống' });
    }

    // Validate giá thuê
    const price = parseFloat(data.price);
    if (!data.price.trim()) {
        errors.push({ field: 'price', message: 'Giá thuê không được để trống' });
    } else if (isNaN(price) || price <= 0) {
        errors.push({ field: 'price', message: 'Giá thuê phải là số dương' });
    }

    // Validate thông tin người thuê (nếu đã thuê)
    if (data.isOccupied) {
        if (!data.tenantName.trim()) {
            errors.push({
                field: 'tenantName',
                message: 'Phòng đã thuê phải có tên người thuê',
            });
        }
        if (!data.tenantPhone.trim()) {
            errors.push({
                field: 'tenantPhone',
                message: 'Phòng đã thuê phải có số điện thoại',
            });
        } else if (!/^0\d{9}$/.test(data.tenantPhone.trim())) {
            errors.push({
                field: 'tenantPhone',
                message: 'Số điện thoại phải có 10 chữ số, bắt đầu bằng 0',
            });
        }
    }

    return errors;
}

/**
 * Format giá tiền VND
 */
export function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN') + ' đ';
}
