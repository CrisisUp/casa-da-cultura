import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutClient>
      {children}
      <Footer />
    </DashboardLayoutClient>
  );
}
