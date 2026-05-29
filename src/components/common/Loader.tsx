type LoaderProps = {
  className?: string;
  spinnerClassName?: string;
};

function Loader({
  className = "flex items-center justify-center h-full overflow-hidden py-40",
  spinnerClassName = "w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin",
}: LoaderProps) {
  return (
    <div className={className}>
      <div className={spinnerClassName} />
    </div>
  );
}

export default Loader;
