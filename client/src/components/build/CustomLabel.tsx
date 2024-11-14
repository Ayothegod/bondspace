/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CustomLabel({ children }: any) {
  return <p className="flex items-center gap-2 text-xs text-foreground font-medium">{children}</p>;
}
