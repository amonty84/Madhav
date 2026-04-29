import type { ReactNode } from "react";
import { ForceDarkMode } from "@/components/auth/ForceDarkMode";

/**
 * Scopes dark mode to /clients/[id]/consume only — build, dashboard, admin keep
 * the user's next-themes preference. See EXEC_BRIEF_UI_R1_BRAND_SPINE_v1_0.md §2.
 *
 * The static `dark` class on the wrapper ensures `.dark .consume-shell` CSS rules
 * and Tailwind dark: variants apply immediately on SSR, without waiting for
 * next-themes' inline script (which React 19 does not execute on the client).
 * ForceDarkMode is kept to sync next-themes state so the theme restores correctly
 * when the user navigates away.
 */
export default function ConsumeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark" style={{ display: "contents" }}>
      <ForceDarkMode />
      {children}
    </div>
  );
}
