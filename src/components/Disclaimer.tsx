export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-[10px] leading-relaxed text-zinc-500 ${className}`}
      role="note"
    >
      BoofMap is based on community-submitted reports. Always inspect products
      yourself and contact the licensed retailer or regulator for serious safety
      concerns.
    </p>
  );
}
