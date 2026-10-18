export type Theme = "light" | "dark" | "system";

export const THEME_KEY = "prodexa-theme";

// หน้าที่: แปลงค่าธีมที่บันทึกเป็นค่าที่ใช้ได้
export function parseTheme(value: string | null): Theme {
  return value === "light" || value === "dark" ? value : "system";
}

// หน้าที่: ใช้ธีมสว่าง มืด หรือตามระบบ
/** ตั้งค่าคลาส .dark และ color-scheme ให้ตรงกับธีมที่เลือก */
export function applyTheme(theme: Theme): void {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

/**
 * สคริปต์ที่รันก่อนวาดหน้า (inline ใน <head>) เพื่อไม่ให้เกิด flash ของธีมผิด
 * ต้องคงตรรกะเดียวกับ applyTheme
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;if(d)r.classList.add("dark");r.style.colorScheme=d?"dark":"light"}catch(e){}})();`;
