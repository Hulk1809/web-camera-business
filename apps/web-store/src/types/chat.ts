export interface AdvisorStaff {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  specialty: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  authProvider: 'EMAIL' | 'FACEBOOK';
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'CUSTOMER' | 'STAFF' | 'SYSTEM';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  productRef?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    imageUrl?: string;
  };
}

export interface ChatSession {
  id: string; // e.g. CHAT-20261018-8812
  customer: CustomerUser;
  status: 'WAITING' | 'IN_PROGRESS' | 'RESOLVED';
  assignedStaff: AdvisorStaff | null;
  assignedAt?: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  unreadCustomerCount: number;
  unreadStaffCount: number;
  currentProductViewing?: string;
}

export const PRESET_STAFF_ACCOUNTS: AdvisorStaff[] = [
  {
    id: 'staff_1',
    name: 'Hoàng Nam',
    role: 'Tư Vấn Viên 1',
    email: 'tuvan1@progear.vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialty: 'Chuyên Máy Ảnh Mirrorless Sony, Canon & Lens',
    status: 'ONLINE',
  },
  {
    id: 'staff_2',
    name: 'Minh Thư',
    role: 'Tư Vấn Viên 2',
    email: 'tuvan2@progear.vn',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    specialty: 'Chuyên Flycam & Gimbal DJI Flagship',
    status: 'ONLINE',
  },
  {
    id: 'staff_3',
    name: 'Quốc Anh',
    role: 'Tư Vấn Viên 3',
    email: 'tuvan3@progear.vn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Chuyên Máy Quay Điện Ảnh Blackmagic & Âm Thanh',
    status: 'ONLINE',
  },
  {
    id: 'admin_root',
    name: 'Admin Quản Trị',
    role: 'Quản Lý Trưởng',
    email: 'admin@progear.vn',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    specialty: 'Điều Phối Chung & Quản Trị Hệ Thống',
    status: 'ONLINE',
  },
];
