const TypingIndicator = () => {
  return (
    <div className="flex text-gray-400 px-3 py-2 items-end">
      <span className="animate-pulse">Thinking</span>
      <Dot className="[animation-delay: 0.2s]" />
      <Dot className="[animation-delay: 0.4s]" />
      <Dot className="[animation-delay: 0.6s]" />
    </div>
  );
};

type DotProps = {
  className?: string;
};

const Dot = ({ className }: DotProps) => {
  return <div className={`w-1 h-1 rounded-3xl bg-white animate-pulse mb-1 ${className}`} />;
};

export default TypingIndicator;
