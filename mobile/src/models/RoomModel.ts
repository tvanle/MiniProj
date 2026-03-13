
import { Room, RoomStatus } from '../types';


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
class RoomModel {
    private rooms: Room[];

    constructor() {
        this.rooms = [...initialRooms];
    }

    getAllRooms(): Room[] {
        return [...this.rooms];
    }

    getRoomById(roomId: string): Room | undefined {
        return this.rooms.find((room) => room.roomId === roomId);
    }

    /**
     * Thêm phòng mới
     */
    addRoom(room: Room): void {
        this.rooms.push({ ...room });
    }

 
    updateRoom(roomId: string, updatedRoom: Partial<Room>): boolean {
        const index = this.rooms.findIndex((room) => room.roomId === roomId);
        if (index === -1) return false;

        this.rooms[index] = { ...this.rooms[index], ...updatedRoom };
        return true;
    }

 
    deleteRoom(roomId: string): boolean {
        const index = this.rooms.findIndex((room) => room.roomId === roomId);
        if (index === -1) return false;

        this.rooms.splice(index, 1);
        return true;
    }

  
    searchRooms(keyword: string): Room[] {
        const lowerKeyword = keyword.toLowerCase();
        return this.rooms.filter(
            (room) =>
                room.roomName.toLowerCase().includes(lowerKeyword) ||
                room.tenantName.toLowerCase().includes(lowerKeyword)
        );
    }

  
    filterByStatus(status: RoomStatus): Room[] {
        return this.rooms.filter((room) => room.status === status);
    }


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
