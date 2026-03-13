// ==========================================
// MODEL: Quản lý dữ liệu phòng trọ
// Dữ liệu lưu tạm thời bằng Array (không dùng database)
// ==========================================

import { Room, RoomStatus } from '../types';

/**
 * Dữ liệu mẫu ban đầu
 */
const initialRooms: Room[] = [
    {
        roomId: 'P001',
        roomName: 'Phòng 101',
        price: 2500000,
        status: RoomStatus.AVAILABLE,
        tenantName: '',
        tenantPhone: '',
    },
    {
        roomId: 'P002',
        roomName: 'Phòng 102',
        price: 3000000,
        status: RoomStatus.OCCUPIED,
        tenantName: 'Nguyễn Văn A',
        tenantPhone: '0901234567',
    },
    {
        roomId: 'P003',
        roomName: 'Phòng 201',
        price: 2800000,
        status: RoomStatus.AVAILABLE,
        tenantName: '',
        tenantPhone: '',
    },
    {
        roomId: 'P004',
        roomName: 'Phòng 202',
        price: 3500000,
        status: RoomStatus.OCCUPIED,
        tenantName: 'Trần Thị B',
        tenantPhone: '0912345678',
    },
    {
        roomId: 'P005',
        roomName: 'Phòng 301',
        price: 2000000,
        status: RoomStatus.AVAILABLE,
        tenantName: '',
        tenantPhone: '',
    },
    {
        roomId: 'P006',
        roomName: 'Phòng 302',
        price: 4000000,
        status: RoomStatus.OCCUPIED,
        tenantName: 'Lê Văn C',
        tenantPhone: '0923456789',
    },
];

/**
 * RoomModel - Quản lý danh sách phòng trọ (Array)
 * Đây là Model trong mô hình MVC
 */
class RoomModel {
    private rooms: Room[];

    constructor() {
        // Khởi tạo với dữ liệu mẫu
        this.rooms = [...initialRooms];
    }

    /**
     * Lấy toàn bộ danh sách phòng
     */
    getAllRooms(): Room[] {
        return [...this.rooms];
    }

    /**
     * Tìm phòng theo mã phòng
     */
    getRoomById(roomId: string): Room | undefined {
        return this.rooms.find((room) => room.roomId === roomId);
    }

    /**
     * Thêm phòng mới
     */
    addRoom(room: Room): void {
        this.rooms.push({ ...room });
    }

    /**
     * Cập nhật thông tin phòng
     */
    updateRoom(roomId: string, updatedRoom: Partial<Room>): boolean {
        const index = this.rooms.findIndex((room) => room.roomId === roomId);
        if (index === -1) return false;

        this.rooms[index] = { ...this.rooms[index], ...updatedRoom };
        return true;
    }

    /**
     * Xóa phòng
     */
    deleteRoom(roomId: string): boolean {
        const index = this.rooms.findIndex((room) => room.roomId === roomId);
        if (index === -1) return false;

        this.rooms.splice(index, 1);
        return true;
    }

    /**
     * Tìm kiếm phòng theo tên (nâng cao)
     */
    searchRooms(keyword: string): Room[] {
        const lowerKeyword = keyword.toLowerCase();
        return this.rooms.filter(
            (room) =>
                room.roomName.toLowerCase().includes(lowerKeyword) ||
                room.tenantName.toLowerCase().includes(lowerKeyword)
        );
    }

    /**
     * Lọc phòng theo tình trạng (nâng cao)
     */
    filterByStatus(status: RoomStatus): Room[] {
        return this.rooms.filter((room) => room.status === status);
    }

    /**
     * Thống kê (nâng cao)
     */
    getStatistics() {
        const total = this.rooms.length;
        const available = this.rooms.filter(
            (r) => r.status === RoomStatus.AVAILABLE
        ).length;
        const occupied = this.rooms.filter(
            (r) => r.status === RoomStatus.OCCUPIED
        ).length;
        const totalRevenue = this.rooms
            .filter((r) => r.status === RoomStatus.OCCUPIED)
            .reduce((sum, r) => sum + r.price, 0);

        return { total, available, occupied, totalRevenue };
    }

    /**
     * Kiểm tra mã phòng đã tồn tại chưa
     */
    isRoomIdExists(roomId: string): boolean {
        return this.rooms.some((room) => room.roomId === roomId);
    }
}

// Singleton instance - dùng chung 1 model trong toàn app
export const roomModel = new RoomModel();
export default RoomModel;
