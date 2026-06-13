export default function Footer() {
  return (
    <footer className="border-t border-warm-100 bg-white/50 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} 温暖空间 · 用心聆听每一个故事</p>
        <p className="mt-1">
          心理互助，温暖同行
        </p>
      </div>
    </footer>
  );
}