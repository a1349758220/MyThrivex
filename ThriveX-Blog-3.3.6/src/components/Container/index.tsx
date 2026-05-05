import './index.scss';

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="ContainerComponent">
        <div className="flex flex-wrap justify-between lg:w-[950px] xl:w-[1300px] p-5 mx-auto">{children}</div>
      </div>
    </>
  );
};
