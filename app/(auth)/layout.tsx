export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="page-bg relative flex flex-col items-center overflow-y-auto"
      style={{ minHeight: "100dvh" }}
    >
      <div
        className="flex w-full flex-1 flex-col items-center justify-center px-6"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 32px)",
          paddingBottom: "32px",
          maxWidth: "440px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
