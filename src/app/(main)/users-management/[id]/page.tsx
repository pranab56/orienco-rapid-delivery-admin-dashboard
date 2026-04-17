import UsersManagementDetails from "@/components/users-management/UsersManagementDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="w-full h-full">
      <UsersManagementDetails id={id} />
    </div>
  );
}