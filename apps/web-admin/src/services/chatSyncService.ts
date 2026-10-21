import { ChatSession, ChatMessage, CustomerUser, AdvisorStaff, PRESET_STAFF_ACCOUNTS } from '../types/chat';

const CUSTOMER_SESSION_KEY = 'PROGEAR_CUSTOMER_SESSION';
const ACTIVE_STAFF_KEY = 'PROGEAR_ACTIVE_STAFF';
let cache: ChatSession[] = [];
const listeners = new Set<(sessions: ChatSession[]) => void>();

const authHeaders = (json = false) => {
  return json ? { 'Content-Type': 'application/json' } : {};
};
const dateTime = (value: string) => new Date(value).toLocaleString('vi-VN');
const time = (value: string) => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const staffFromApi = (user: any): AdvisorStaff | null => {
  if (!user) return null;
  return PRESET_STAFF_ACCOUNTS.find((staff) => staff.name === user.fullName) || {
    id: user.id, name: user.fullName, email: '', role: 'Tư Vấn Viên', avatar: '', specialty: 'Tư vấn Pro Gear', status: 'ONLINE',
  };
};
const mapMessage = (message: any, session: any): ChatMessage => ({
  id: message.id, sessionId: session.id, sender: message.sender,
  senderName: message.sender === 'CUSTOMER' ? session.customer.displayName : message.senderUser?.fullName || 'Tư vấn viên Pro Gear',
  text: message.content, timestamp: time(message.createdAt),
});
const mapSession = (session: any): ChatSession => ({
  id: session.id,
  customer: { id: session.customer.id, name: session.customer.displayName, email: session.customer.email || '', phone: session.customer.phone || undefined, authProvider: 'EMAIL' },
  status: session.status === 'ACTIVE' ? 'IN_PROGRESS' : session.status === 'CLOSED' ? 'RESOLVED' : 'WAITING',
  assignedStaff: staffFromApi(session.assignedUser), createdAt: dateTime(session.createdAt), updatedAt: dateTime(session.updatedAt),
  messages: (session.messages || []).map((message: any) => mapMessage(message, session)), unreadCustomerCount: 0,
  unreadStaffCount: session.status === 'WAITING' ? 1 : 0, currentProductViewing: session.subject || undefined,
});
const emit = () => listeners.forEach((listener) => listener([...cache]));

async function refreshAdminSessions() {
  if (sessionStorage.getItem('PROGEAR_ADMIN_LOGGED_IN') !== 'true') return;
  const response = await fetch('/api/chat/admin/sessions?limit=50', { headers: authHeaders(), credentials: 'include' });
  if (!response.ok) return;
  const sessions = await response.json();
  cache = await Promise.all(sessions.map(async (session: any) => {
    const detail = await fetch(`/api/chat/admin/sessions/${session.id}?limit=50`, { headers: authHeaders(), credentials: 'include' });
    return mapSession(detail.ok ? await detail.json() : session);
  }));
  emit();
}

export const chatSyncService = {
  getSessions: () => [...cache],
  getSessionById: (id: string) => cache.find((session) => session.id === id) || null,
  async claimSession(sessionId: string, _staff: AdvisorStaff) {
    const response = await fetch(`/api/chat/admin/sessions/${sessionId}/claim`, { method: 'POST', headers: authHeaders(true), credentials: 'include', body: '{}' });
    if (!response.ok) throw new Error(response.status === 409 ? 'Phiên chat đã được nhân viên khác tiếp nhận' : 'Không thể tiếp nhận phiên chat');
    await refreshAdminSessions();
    return mapSession(await response.json());
  },
  async sendMessage(sessionId: string, _sender: string, _senderName: string, text: string) {
    const session = cache.find((item) => item.id === sessionId);
    if (session && !session.assignedStaff) await this.claimSession(sessionId, this.getActiveStaff());
    const response = await fetch(`/api/chat/admin/sessions/${sessionId}/messages`, {
      method: 'POST', headers: authHeaders(true), credentials: 'include', body: JSON.stringify({ content: text }),
    });
    if (!response.ok) throw new Error('Không thể gửi phản hồi');
    const message = await response.json();
    await refreshAdminSessions();
    return message;
  },
  async resolveSession(sessionId: string) {
    const response = await fetch(`/api/chat/admin/sessions/${sessionId}/resolve`, { method: 'POST', headers: authHeaders(true), credentials: 'include', body: '{}' });
    if (!response.ok) throw new Error('Không thể hoàn tất phiên chat');
    await refreshAdminSessions();
    return mapSession(await response.json());
  },
  getCustomerSession(): CustomerUser | null {
    try { const raw = localStorage.getItem(CUSTOMER_SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  saveCustomerSession(user: CustomerUser) { localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(user)); },
  clearCustomerSession() { localStorage.removeItem(CUSTOMER_SESSION_KEY); },
  getActiveStaff(): AdvisorStaff {
    try { const raw = localStorage.getItem(ACTIVE_STAFF_KEY); return raw ? JSON.parse(raw) : PRESET_STAFF_ACCOUNTS[0]; } catch { return PRESET_STAFF_ACCOUNTS[0]; }
  },
  setActiveStaff(staff: AdvisorStaff) {
    localStorage.setItem(ACTIVE_STAFF_KEY, JSON.stringify(staff));
    window.dispatchEvent(new CustomEvent('PROGEAR_STAFF_CHANGED', { detail: staff }));
  },
  subscribe(callback: (sessions: ChatSession[]) => void) {
    listeners.add(callback);
    refreshAdminSessions().catch(() => undefined);
    const interval = window.setInterval(() => refreshAdminSessions().catch(() => undefined), 3000);
    return () => { listeners.delete(callback); window.clearInterval(interval); };
  },
};
