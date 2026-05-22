export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          🌿 AgriGuard
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          AI 농업 플랫폼
        </h1>
        <p className="text-muted-foreground text-lg">
          스마트폰 하나로 작물 질병을 진단하고<br />방제 시점을 예측하는 저비용 AI 농업 플랫폼
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <a
            href="/dashboard"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            시작하기
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border px-6 py-2.5 rounded-md font-medium hover:bg-muted transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
