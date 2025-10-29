interface TemperatureProps {
  value?: number;
  className?: string;
}

export default function Temperature({ value = 36.5, className = '' }: TemperatureProps) {
  return (
    <div
      className={`
        inline-flex items-center justify-center
        px-2 py-1 rounded-full
        text-white text-xs font-extrabold
        border border-white
        ${className}
      `}
    >
      {value.toFixed(1)}°C
    </div>
  );
}
