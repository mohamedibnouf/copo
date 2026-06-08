import type { User } from "@/types";
import { cn } from "@/lib/utils";

export function UserAvatar({
  user,
  size = "md",
}: {
  user: User;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm" ? "h-6 w-6 text-[10px]" : size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        dim
      )}
      style={{ backgroundColor: user.avatarColor }}
      title={user.name}
    >
      {user.initials}
    </span>
  );
}
