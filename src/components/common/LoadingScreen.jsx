import { Spinner } from "@/components/ui/spinner";

const LoadingScreen = ({ className, children }) => {
  return (
    <div className="min-h-screen flex justify-center items-center gap-4">
      <Spinner className="size-8" />
    </div>
  );
};

export default LoadingScreen;
