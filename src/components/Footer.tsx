export default function Footer() {
  return (
    <footer className="border-t border-stone-200/30 bg-stone-50/30 backdrop-blur-sm py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center text-xs tracking-wider text-marble-500/60">
        <p>&copy; {new Date().getFullYear()} wnycs · <a href="/rss.xml" className="hover:text-roman-red-700 transition-colors">RSS</a></p>
      </div>
    </footer>
  );
}