export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl text-center text-sm text-slate-500">
        © {currentYear} whitepaper. All rights reserved.
      </div>
    </footer>
  );
}
