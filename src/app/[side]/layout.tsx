import Header from "@/components/header/header";
import { StoreProvider } from "@/stores/store";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const generateStaticParams = () => [
  { side: "groom" },
  { side: "bride" },
];

export const instant = false;

export default async function SideLayout({
  children,
  params,
}: LayoutProps<"/[side]">) {
  const { side } = await params;
  if (!["groom", "bride"].includes(side)) notFound();

  return (
    <Suspense fallback={null}>
      <StoreProvider side={side}>
        <Header />
        {children}
      </StoreProvider>
    </Suspense>
  );
}
