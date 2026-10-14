import PlatformHeader from "@/components/PlatformHeader";
import PlatformFooter from "@/components/PlatformFooter";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PlatformHeader />
      <div className="flex-1">{children}</div>
      <PlatformFooter />
    </div>
  );
}
