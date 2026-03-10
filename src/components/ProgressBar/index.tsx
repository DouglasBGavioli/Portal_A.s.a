type ProgressBarProps = {
  percentage: number;
};

export default function ProgressBar(props: ProgressBarProps) {
  return (
    <div className="relative h-[30px] w-full overflow-hidden rounded bg-brand-700">
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-white">{props.percentage}%</p>
      <div className="h-full rounded bg-brand-500 transition-all duration-300" style={{ width: `${props.percentage}%` }} />
    </div>
  );
}

