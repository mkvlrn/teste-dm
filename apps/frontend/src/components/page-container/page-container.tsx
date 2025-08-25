type PageContainerProps = {
  title: string;
  children: React.ReactNode;
};

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="w-[95%] lg:w-[80%] mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">{title}</h1>
      {children}
    </div>
  );
}
