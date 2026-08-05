type AvatarProps = {
  user?: { nome?: string; email?: string } | null;
  size?: number;
  className?: string;
};

export default function Avatar({ user, size = 36, className = "" }: AvatarProps) {
  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getHslColor = (name?: string) => {
    if (!name) return "hsl(0, 0%, 50%)";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 65%, 55%)`;
  };

  const initials = getInitials(user?.nome || user?.email);
  const bgColor = getHslColor(user?.nome || user?.email);

  return (
    <div
      className={`flex items-center justify-center font-medium text-white rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        backgroundColor: bgColor,
      }}
      title={user?.nome || user?.email || "Usuário"}
    >
      {initials}
    </div>
  );
}
