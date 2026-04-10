import { Alert, Platform } from 'react-native';

export const showAlert = (title: string, message?: string) => {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
};

export const showConfirm = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  if (Platform.OS === 'web') {
    if (window.confirm(message)) {
      onConfirm();
    } else {
      onCancel?.();
    }
  } else {
    Alert.alert('Xác nhận', message, [
      { text: 'Hủy', style: 'cancel', onPress: onCancel },
      { text: 'Đồng ý', onPress: onConfirm },
    ]);
  }
};
