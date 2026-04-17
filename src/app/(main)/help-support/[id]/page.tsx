import HelpSupportDetails from "@/components/help-support/HelpSupportDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="w-full h-full">
      <HelpSupportDetails id={id} />
    </div>
  );
}