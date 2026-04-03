import React, { useState, useEffect, useRef } from 'react';
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
  const [date, setDate] = useState(new Date(Date.now() + 60000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  // Fake notification: dùng global timer để bắn Alert khi đến giờ (không bị clear khi unmount)
  const [fakeNotification, setFakeNotification] = useState<{ title: string; time: string } | null>(null);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  async function registerForPushNotifications() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Lỗi', 'Không thể lấy quyền thông báo!');
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

    let notificationId = '';
    try {
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nhắc nhở',
          body: title,
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: date,
          channelId: 'schedule',
        },
      });
    } catch {
      notificationId = `local-${Date.now()}`;
    }

    // Fake notification: dùng global setTimeout + Alert (hoạt động trên web/emulator, không bị clear khi unmount)
    const delay = date.getTime() - Date.now();
    if (delay > 0) {
      const savedTitle = title;
      const savedTime = formatDateTime(date);
      // Dùng global setTimeout - không gắn vào component lifecycle
      (globalThis as any).__scheduleTimer = setTimeout(() => {
        Alert.alert('Nhắc nhở', `${savedTitle}\n\nThời gian: ${savedTime}`);
      }, delay);
    }

    const savedDate = new Date(date);
    const newSchedule: ScheduleItem = {
      id: Date.now().toString(),
      title,
      date: savedDate,
      notificationId,
    };

    setSchedules((prev) => [...prev, newSchedule]);
    Alert.alert('Thành công', `Đã đặt lịch nhắc nhở lúc ${formatDateTime(savedDate)}`);
    setTitle('');
    setDate(new Date(Date.now() + 60000));
    setModalVisible(false);
  }

  async function deleteSchedule(item: ScheduleItem) {
    if (!item.notificationId.startsWith('local-')) {
      await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    }
    setSchedules((prev) => prev.filter((s) => s.id !== item.id));
  }

  function formatDateTime(d: Date) {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newDate);
    }
  };

  const onTimeChange = (_event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const pickerDisplay = Platform.OS === 'ios' ? 'spinner' : 'default';

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
        onPress={() => {
          setDate(new Date(Date.now() + 60000));
          setModalVisible(true);
        }}
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
            {Platform.OS === 'web' ? (
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={`${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`}
                onChangeText={(text) => {
                  // Parse DD/MM/YYYY
                  const parts = text.split('/');
                  if (parts.length === 3) {
                    const d = parseInt(parts[0]), m = parseInt(parts[1]) - 1, y = parseInt(parts[2]);
                    if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y > 2000) {
                      const newDate = new Date(date);
                      newDate.setFullYear(y, m, d);
                      setDate(newDate);
                    }
                  }
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => { setShowTimePicker(false); setShowDatePicker(true); }}
                >
                  <Ionicons name="calendar-outline" size={20} color="#3498db" />
                  <Text style={styles.dateBtnText}>
                    {`${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && Platform.OS === 'ios' && (
                  <DateTimePicker value={date} mode="date" display={pickerDisplay} onChange={onDateChange} minimumDate={new Date()} />
                )}
              </>
            )}

            <Text style={styles.label}>Giờ</Text>
            {Platform.OS === 'web' ? (
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`}
                onChangeText={(text) => {
                  // Parse HH:MM
                  const parts = text.split(':');
                  if (parts.length === 2) {
                    const h = parseInt(parts[0]), m = parseInt(parts[1]);
                    if (!isNaN(h) && !isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60) {
                      const newDate = new Date(date);
                      newDate.setHours(h, m);
                      setDate(newDate);
                    }
                  }
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => { setShowDatePicker(false); setShowTimePicker(true); }}
                >
                  <Ionicons name="time-outline" size={20} color="#3498db" />
                  <Text style={styles.dateBtnText}>
                    {`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && Platform.OS === 'ios' && (
                  <DateTimePicker value={date} mode="time" display={pickerDisplay} onChange={onTimeChange} />
                )}
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setModalVisible(false);
                  setTitle('');
                  setShowDatePicker(false);
                  setShowTimePicker(false);
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

      {/* Android: DateTimePicker nằm ngoài Modal để tránh conflict */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      {/* Fake Notification Banner - hiện khi đến giờ */}
      {fakeNotification && (
        <TouchableOpacity
          style={styles.notiBanner}
          onPress={() => setFakeNotification(null)}
          activeOpacity={0.9}
        >
          <Ionicons name="notifications" size={24} color="#fff" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.notiTitle}>Nhắc nhở</Text>
            <Text style={styles.notiBody}>{fakeNotification.title}</Text>
            <Text style={styles.notiTime}>{fakeNotification.time}</Text>
          </View>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      )}
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
  // Fake notification banner
  notiBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2c3e50',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  notiTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  notiBody: { color: '#eee', fontSize: 14, marginTop: 2 },
  notiTime: { color: '#aaa', fontSize: 11, marginTop: 2 },
});
