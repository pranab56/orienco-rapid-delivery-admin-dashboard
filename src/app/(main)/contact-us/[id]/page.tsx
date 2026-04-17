import ContactUsDetails from "@/components/contact-us/ContactUsDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="w-full h-full">
      <ContactUsDetails id={id} />
    </div>
  );
}