import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CardLayout = ({ className, children }) => {
  return (
    <Card
      className={cn(
        "py-2.5 gap-0 rounded-3xl border border-white/5 bg-card shadow-2xl relative overflow-hidden",
        className,
      )}
    >
      {children}
    </Card>
  );
};

export default CardLayout;
