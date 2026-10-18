export type ToastTone = "success" | "error" | "info";
export type ToastItem = { id: number; tone: ToastTone; message: string };

const EMPTY: ToastItem[] = [];
let toasts: ToastItem[] = EMPTY;
let nextId = 1;
let lastKey = "";
let lastAt = 0;
const subscribers = new Set<() => void>();

// หน้าที่: แจ้งผู้ติดตามเมื่อ Toast เปลี่ยน
function emit() {
  subscribers.forEach((notify) => notify());
}

// หน้าที่: สมัครรับการเปลี่ยนแปลง Toast
export const subscribeToasts = (notify: () => void) => {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
};
// หน้าที่: อ่านรายการ Toast ปัจจุบัน
export const getToasts = () => toasts;
// หน้าที่: คืนรายการ Toast ว่างบนเซิร์ฟเวอร์
export const getServerToasts = () => EMPTY;

// หน้าที่: นำ Toast ที่ระบุออก
export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

// หน้าที่: เพิ่ม Toast และตั้งเวลาปิดอัตโนมัติ
export function pushToast(tone: ToastTone, message: string, ttl = 5000) {
  // กันแจ้งซ้ำภายในเสี้ยววินาที (เช่น React Strict Mode ใน dev)
  const key = `${tone}:${message}`;
  const now = Date.now();
  if (key === lastKey && now - lastAt < 400) return;
  lastKey = key;
  lastAt = now;

  const id = nextId++;
  toasts = [...toasts, { id, tone, message }];
  emit();
  window.setTimeout(() => dismissToast(id), ttl);
}
