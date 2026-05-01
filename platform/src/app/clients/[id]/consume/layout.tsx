import type { ReactNode } from "react";
import { ZoneRoot } from "@/components/shared/ZoneRoot";

/**
 * Scopes the ink zone to /clients/[id]/consume only.
 * The static `dark` class is applied by ZoneRoot zone="ink".
 * Display:contents keeps this wrapper transparent to flex/grid layouts.
 */
export default function ConsumeLayout({ children }: { children: ReactNode }) {
  return (
    <ZoneRoot zone="ink" style={{ display: "contents" }}>
      {children}
    </ZoneRoot>
  );
}
