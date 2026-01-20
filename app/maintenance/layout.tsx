export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Maintenance page has its own full-page layout without navbar/sidebar
  return (
    <div className="fixed inset-0 z-50">
      {children}
    </div>
  );
}
