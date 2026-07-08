import AdminSidebar from "./components/AdminSidebar";

export const metadata = {
  title: "Admin Panel — IdeaVault",
  description: "IdeaVault admin panel",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
