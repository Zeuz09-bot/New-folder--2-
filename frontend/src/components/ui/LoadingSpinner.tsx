export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} rounded-full border-gold/20 border-t-gold animate-spin`}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
      <p className="text-sm text-zinc-500 animate-pulse">Loading...</p>
    </div>
  );
}
