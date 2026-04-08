import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Panel | Luma JLPT",
  description: "Luma JLPT Management Dashboard",
};

export default function AdminPage() {
  return <AdminClient />;
}
