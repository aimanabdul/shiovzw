interface TagProps {
  label: string;
  variant?: "default" | "outline";
}

export default function Tag({ label, variant = "default" }: TagProps) {
  if (variant === "outline") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-600 text-green-700">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      {label}
    </span>
  );
}
