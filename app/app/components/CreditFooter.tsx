export default function CreditFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 py-4 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-1">
          <p className="text-center text-sm text-white/80">
            イラスト提供：
            <a
              href="https://www.irasutoya.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-yellow-300 hover:text-yellow-200 underline transition-colors"
            >
              いらすとや
            </a>
          </p>
          <p className="text-center text-sm text-white/80">
            Created by
            <a
              href="https://x.com/amixedcolor"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-yellow-300 hover:text-yellow-200 underline transition-colors"
            >
              amixedcolor
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
