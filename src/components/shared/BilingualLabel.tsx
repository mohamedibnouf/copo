export function BilingualLabel({
  en,
  ar,
  required,
  className,
}: {
  en: string;
  ar: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <span className={className}>
      {en} | {ar}
      {required && <span className="text-rose-500"> *</span>}
    </span>
  );
}
