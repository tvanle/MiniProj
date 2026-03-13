// ==========================================
// CONTROLLER: Xử lý logic CRUD phòng trọ
// Đây là Controller trong mô hình MVC
// Controller nhận yêu cầu từ View, xử lý qua Model
// ==========================================

import { Room, RoomStatus } from '../types';
import { roomModel } from '../models/RoomModel';
import { validateRoom, ValidationError } from '../utils/Validator';

/**
 * Kết quả trả về từ Controller
 */
export interface ControllerResult<T = void> {
    success: boolean;
    data?: T;
    errors?: ValidationError[];
    message?: string;
}

/**
 * RoomController - Điều khiển logic nghiệp vụ
 */
class RoomController {
    /**
     * READ - Lấy tất cả phòng
     */
    getAllRooms(): Room[] {
        return roomModel.getAllRooms();
    }

    /**
     * READ - Lấy phòng theo ID
     */
    getRoomById(roomId: string): Room | undefined {
        return roomModel.getRoomById(roomId);
    }

    /**
     * CREATE - Thêm phòng mới
     */
    addRoom(data: {
        roomId: string;
        roomName: string;
        price: string;
        tenantName: string;
        tenantPhone: string;
        isOccupied: boolean;
    }): ControllerResult<Room> {
        // Validate dữ liệu
        const existingRooms = roomModel.getAllRooms();
        const errors = validateRoom({
            ...data,
            isEditing: false,
            existingRoomIds: existingRooms.map((r) => r.roomId),
        });

        if (errors.length > 0) {
            return { success: false, errors };
        }

        // Tạo đối tượng Room
        const newRoom: Room = {
            roomId: data.roomId.trim(),
            roomName: data.roomName.trim(),
            price: parseFloat(data.price),
            status: data.isOccupied ? RoomStatus.OCCUPIED : RoomStatus.AVAILABLE,
            tenantName: data.isOccupied ? data.tenantName.trim() : '',
            tenantPhone: data.isOccupied ? data.tenantPhone.trim() : '',
        };

        // Thêm vào Model
        roomModel.addRoom(newRoom);

        return {
            success: true,
            data: newRoom,
            message: `Đã thêm ${newRoom.roomName} thành công!`,
        };
    }

    /**
     * UPDATE - Cập nhật thông tin phòng
     */
    updateRoom(
        roomId: string,
        data: {
            roomId: string;
            roomName: string;
            price: string;
            tenantName: string;
            tenantPhone: string;
            isOccupied: boolean;
        }
    ): ControllerResult<Room> {
        // Validate dữ liệu
        const errors = validateRoom({
            ...data,
            isEditing: true,
        });

        if (errors.length > 0) {
            return { success: false, errors };
        }

        // Cập nhật qua Model
        const updatedData: Partial<Room> = {
            roomName: data.roomName.trim(),
            price: parseFloat(data.price),
            status: data.isOccupied ? RoomStatus.OCCUPIED : RoomStatus.AVAILABLE,
            tenantName: data.isOccupied ? data.tenantName.trim() : '',
            tenantPhone: data.isOccupied ? data.tenantPhone.trim() : '',
        };

        const success = roomModel.updateRoom(roomId, updatedData);

        if (!success) {
            return {
                success: false,
                message: 'Không tìm thấy phòng để cập nhật!',
            };
        }

        const updatedRoom = roomModel.getRoomById(roomId);
        return {
            success: true,
            data: updatedRoom,
            message: `Đã cập nhật ${data.roomName} thành công!`,
        };
    }

    /**
     * DELETE - Xóa phòng
     */
    deleteRoom(roomId: string): ControllerResult {
        const room = roomModel.getRoomById(roomId);
        if (!room) {
            return { success: false, message: 'Không tìm thấy phòng!' };
        }

        const success = roomModel.deleteRoom(roomId);
        return {
            success,
            message: success
                ? `Đã xóa ${room.roomName} thành công!`
                : 'Xóa phòng thất bại!',
        };
    }

    /**
     * SEARCH - Tìm kiếm phòng (nâng cao)
     */
    searchRooms(keyword: string): Room[] {
        if (!keyword.trim()) {
            return roomModel.getAllRooms();
        }
        return roomModel.searchRooms(keyword);
    }

    /**
     * FILTER - Lọc theo tình trạng (nâng cao)
     */
    filterByStatus(status: RoomStatus | 'ALL'): Room[] {
        if (status === 'ALL') {
            return roomModel.getAllRooms();
        }
        return roomModel.filterByStatus(status);
    }

    /**
     * STATISTICS - Thống kê (nâng cao)
     */
    getStatistics() {
        return roomModel.getStatistics();
    }
}

// Singleton instance
export const roomController = new RoomController();
export default RoomController;
