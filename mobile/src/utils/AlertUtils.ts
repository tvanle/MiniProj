import { Alert, Platform } from 'react-native';

export const AlertUtils = {
    /**
     * Hiển thị thông báo hỗ trợ cả Web và Mobile.
     * @param title Tiêu đề thông báo
     * @param message Nội dung
     * @param onOk Callback khi nhấn OK (hoặc Yes trên confirm)
     * @param onCancel Callback khi nhấn Hủy (hoặc tát hộp thoại confirm)
     * @param okText Chữ trên nút OK
     * @param cancelText Chữ trên nút Cancel
     */
    alert: (
        title: string,
        message: string,
        onOk?: () => void,
        onCancel?: () => void,
        okText: string = 'OK',
        cancelText: string = 'Hủy'
    ) => {
        if (Platform.OS === 'web') {
            if (onCancel) {
                const confirmed = window.confirm(`${title}\n\n${message}`);
                if (confirmed) {
                    onOk?.();
                } else {
                    onCancel?.();
                }
            } else {
                window.alert(`${title}\n\n${message}`);
                onOk?.();
            }
        } else {
            const buttons: any[] = [];

            if (onCancel) {
                buttons.push({
                    text: cancelText,
                    style: 'cancel',
                    onPress: onCancel,
                });
            }

            buttons.push({
                text: okText,
                style: onCancel ? 'destructive' : 'default', // destructive khi có nút Hủy (thường dùng cho Xóa)
                onPress: onOk,
            });

            Alert.alert(title, message, buttons);
        }
    }
};
