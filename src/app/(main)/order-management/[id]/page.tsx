import OrderDetails from "@/components/order-management/OrderDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="w-full h-full">
      <OrderDetails id={id} />
    </div>
  );
}