// ==========================================
// Types / Interfaces cho ứng dụng Quản Lý Nhà Trọ
// ==========================================

/**
 * Enum tình trạng phòng
 */
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',   // Còn trống
  OCCUPIED = 'OCCUPIED',     // Đã thuê
}

/**
 * Interface phòng trọ
 */
export interface Room {
  roomId: string;           // Mã phòng (VD: "P001")
  roomName: string;         // Tên phòng (VD: "Phòng 101")
  price: number;            // Giá thuê (VD: 2500000)
  status: RoomStatus;       // Tình trạng: Còn trống / Đã thuê
  tenantName: string;       // Tên người thuê
  tenantPhone: string;      // SĐT người thuê
}

/**
 * Navigation param list
 */
export type RootStackParamList = {
  RoomList: undefined;
  AddEditRoom: { room?: Room; mode: 'add' | 'edit' };
  RoomDetail: { roomId: string };
};
