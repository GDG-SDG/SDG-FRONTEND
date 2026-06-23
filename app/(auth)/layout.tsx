export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="page-bg relative flex flex-col items-center justify-center overflow-y-auto"
      style={{
        height: "100dvh",
        paddingTop: "max(env(safe-area-inset-top), 32px)",
        paddingBottom: "32px",
      }}
    >
      <div className="w-full px-6" style={{ maxWidth: "440px" }}>
        {children}
      </div>
    </div>
  );
}
