export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-white/60 px-5 py-6 backdrop-blur-sm sm:px-8">
      <div className="mx-auto max-w-6xl text-center text-sm text-slate-600">
        © {currentYear} whitepaper. All rights reserved.
      </div>
    </footer>
  );
}
