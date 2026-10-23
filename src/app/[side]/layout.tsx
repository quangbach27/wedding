import Header from "@/components/header/header";
import { isSide, StoreProvider, stores } from "@/components/stores/store";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const generateStaticParams = () => [
  { side: "groom" },
  { side: "bride" },
];

async function SideStore({
  params,
  children,
}: {
  params: LayoutProps<"/[side]">["params"];
  children: React.ReactNode;
}) {
  const { side } = await params;
  if (!["groom", "bride"].includes(side)) return notFound();

  return (
    <StoreProvider side={side}>
      <Header />
      {children}
    </StoreProvider>
  );
}

export default function SideLayout({
  children,
  params,
}: LayoutProps<"/[side]">) {
  return (
    <Suspense fallback={null}>
      <SideStore params={params}>{children}</SideStore>
    </Suspense>
  );
}
