type TitlePageProps = {
  title: string;
  subtitle?: string;
};

export function TitlePage(props: TitlePageProps) {
  return (
    <div className="flex w-full cursor-default flex-col gap-1 border-b border-gray-300 pb-6">
      <h1 className="text-2xl font-semibold uppercase text-gray-700 md:text-[28px]">{props.title}</h1>
      {props.subtitle && <span className="text-xs font-semibold uppercase text-gray-600 md:text-base">{props.subtitle}</span>}
    </div>
  );
}

