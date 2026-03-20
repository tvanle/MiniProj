/**
 * Cross-platform Alert utility
 * - Web: window.alert / window.confirm
 * - Native: Alert.alert
 */

import { Alert, Platform } from 'react-native';

type AlertButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

export const showAlert = (title: string, message: string, buttons?: AlertButton[]) => {
  if (Platform.OS === 'web') {
    if (!buttons || buttons.length <= 1) {
      // Simple alert
      window.alert(`${title}\n${message}`);
      buttons?.[0]?.onPress?.();
    } else {
      // Confirm dialog
      const confirmBtn = buttons.find(b => b.style !== 'cancel');
      const result = window.confirm(`${title}\n${message}`);
      if (result) {
        confirmBtn?.onPress?.();
      } else {
        buttons.find(b => b.style === 'cancel')?.onPress?.();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};
