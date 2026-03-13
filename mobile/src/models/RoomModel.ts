// ==========================================
// MODEL: Quản lý dữ liệu phòng trọ (ArrayList)
// Đây là Model trong mô hình MVC
// Lưu trữ in-memory, reset khi khởi động lại app
// ==========================================

import { Room, RoomStatus } from '../types';

/**
 * Dữ liệu phòng mẫu ban đầu
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
 * RoomModel - Quản lý dữ liệu phòng trọ
 * Singleton pattern - dùng chung 1 instance
 */
class RoomModel {
    private rooms: Room[];

    constructor() {
        this.rooms = [...initialRooms];
    }

    /**
     * READ - Lấy tất cả phòng
     */
    getAllRooms(): Room[] {
        return [...this.rooms];
    }

    /**
     * READ - Lấy phòng theo ID
     */
    getRoomById(roomId: string): Room | undefined {
        return this.rooms.find((room) => room.roomId === roomId);
    }

    /**
     * CREATE - Thêm phòng mới
     */
    addRoom(room: Room): void {
        this.rooms.push({ ...room });
    }

    /**
     * UPDATE - Cập nhật thông tin phòng
     */
    updateRoom(roomId: string, updatedRoom: Partial<Room>): boolean {
        const index = this.rooms.findIndex((room) => room.roomId === roomId);
        if (index === -1) return false;

        this.rooms[index] = { ...this.rooms[index], ...updatedRoom };
        return true;
    }

    /**
     * DELETE - Xóa phòng
     */
    deleteRoom(roomId: string): boolean {
        const index = this.rooms.findIndex((room) => room.roomId === roomId);
        if (index === -1) return false;

        this.rooms.splice(index, 1);
        return true;
    }

    /**
     * SEARCH - Tìm kiếm phòng theo keyword
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
     * FILTER - Lọc phòng theo tình trạng
     */
    filterByStatus(status: RoomStatus): Room[] {
        return this.rooms.filter((room) => room.status === status);
    }

    /**
     * STATISTICS - Thống kê phòng trọ
     * Tối ưu: Dùng reduce để chỉ duyệt mảng 1 lần
     */
    getStatistics() {
        return this.rooms.reduce(
            (acc, room) => {
                acc.total++;
                if (room.status === RoomStatus.OCCUPIED) {
                    acc.occupied++;
                    acc.totalRevenue += room.price;
                } else {
                    acc.available++;
                }
                return acc;
            },
            { total: 0, available: 0, occupied: 0, totalRevenue: 0 }
        );
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
