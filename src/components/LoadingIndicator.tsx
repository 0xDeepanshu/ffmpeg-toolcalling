interface LoadingIndicatorProps {
  label?: string;
}

export function LoadingIndicator({
  label = "Processing",
}: LoadingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-700" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" />
      </div>
      <span className="text-sm text-zinc-400 font-mono">{label}...</span>
    </div>
  );
}
