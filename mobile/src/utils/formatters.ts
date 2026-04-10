export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + 'đ';
};

export const formatDateTime = (dt: string): string => {
  const d = new Date(dt);
  return (
    d.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }) +
    ' ' +
    dt.split('T')[1].substring(0, 5)
  );
};

export const formatTime = (dateTime: string): string => {
  return dateTime.split('T')[1].substring(0, 5);
};

export const formatDateLabel = (dateStr: string): string => {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Hôm nay';
  if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Ngày mai';
  return d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
};
