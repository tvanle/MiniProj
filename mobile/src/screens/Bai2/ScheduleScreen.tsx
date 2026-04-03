import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface ScheduleItem {
  id: string;
  title: string;
  date: Date;
  notificationId: string;
}

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  async function registerForPushNotifications() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Lỗi', 'Không thể lấy quyền thông báo!');
      }
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('schedule', {
        name: 'Lịch hẹn',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  }

  async function scheduleNotification() {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề!');
      return;
    }

    if (date <= new Date()) {
      Alert.alert('Lỗi', 'Vui lòng chọn thời gian trong tương lai!');
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Nhắc nhở',
        body: title,
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: date,
        channelId: 'schedule',
      },
    });

    const newSchedule: ScheduleItem = {
      id: Date.now().toString(),
      title,
      date,
      notificationId,
    };

    setSchedules((prev) => [...prev, newSchedule]);
    setTitle('');
    setDate(new Date());
    setModalVisible(false);
    Alert.alert('Thành công', `Đã đặt lịch nhắc nhở lúc ${formatDateTime(date)}`);
  }

  async function deleteSchedule(item: ScheduleItem) {
    await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    setSchedules((prev) => prev.filter((s) => s.id !== item.id));
  }

  function formatDateTime(d: Date) {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newDate);
    }
  };

  const onTimeChange = (_event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đặt lịch nhắc nhở</Text>
        <Ionicons name="calendar" size={24} color="#fff" />
      </View>

      {schedules.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Chưa có lịch hẹn nào</Text>
          <Text style={styles.emptySubText}>Nhấn nút + để thêm lịch mới</Text>
        </View>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleIcon}>
                <Ionicons name="alarm" size={28} color="#3498db" />
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
                <Text style={styles.scheduleTime}>{formatDateTime(item.date)}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteSchedule(item)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* FloatingActionButton */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal thêm lịch */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm lịch hẹn mới</Text>

            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tiêu đề nhắc nhở..."
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Ngày</Text>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#3498db" />
              <Text style={styles.dateBtnText}>
                {`${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Giờ</Text>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#3498db" />
              <Text style={styles.dateBtnText}>
                {`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setModalVisible(false);
                  setTitle('');
                }}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={scheduleNotification}
              >
                <Text style={styles.saveBtnText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, color: '#999', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#bbb', marginTop: 4 },
  list: { padding: 10 },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scheduleIcon: { marginRight: 14 },
  scheduleInfo: { flex: 1 },
  scheduleTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  scheduleTime: { fontSize: 13, color: '#888', marginTop: 4 },
  deleteBtn: { padding: 8 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateBtnText: { marginLeft: 10, fontSize: 15, color: '#333' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
  },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  cancelBtn: { backgroundColor: '#f0f0f0' },
  cancelBtnText: { color: '#666', fontSize: 15, fontWeight: '600' },
  saveBtn: { backgroundColor: '#3498db' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
