"use client";

import { useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

// หน้าที่: อ่านค่าจาก localStorage
export function readLocal(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

// หน้าที่: บันทึกค่าลง localStorage และแจ้งผู้ติดตาม
export function writeLocal(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // เบราว์เซอร์ปิดการเก็บข้อมูล — ใช้ค่าเฉพาะใน session นี้ต่อไป
  }
  listeners.get(key)?.forEach((notify) => notify());
}

// หน้าที่: ติดตามค่า localStorage ใน React
/** อ่านค่า localStorage แบบ reactive (SSR ได้ค่า null เสมอ จึงไม่เกิด hydration mismatch) */
export function useLocalValue(key: string): string | null {
  return useSyncExternalStore(
    (notify) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(notify);
      // หน้าที่: อัปเดตเมื่อข้อมูลในแท็บอื่นเปลี่ยน
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) notify();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        set.delete(notify);
        window.removeEventListener("storage", onStorage);
      };
    },
    () => readLocal(key),
    () => null,
  );
}
