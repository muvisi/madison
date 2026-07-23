export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src="/madison-group-logo.png"
      alt="Madison Group"
      className={compact ? "h-9 w-auto" : "h-auto w-52"}
    />
  );
}
