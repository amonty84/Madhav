import type { ReactNode } from "react";
import { ForceDarkMode } from "@/components/auth/ForceDarkMode";

/**
 * Scopes dark mode to /clients/[id]/consume only — build, dashboard, admin keep
 * the user's next-themes preference. See EXEC_BRIEF_UI_R1_BRAND_SPINE_v1_0.md §2.
 */
export default function ConsumeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ForceDarkMode />
      {children}
    </>
  );
}
