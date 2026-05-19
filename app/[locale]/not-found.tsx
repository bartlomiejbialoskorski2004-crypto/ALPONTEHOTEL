import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-6xl text-forest">404</p>
      <p className="mt-4 text-sm uppercase tracking-[0.2em]">Page not found</p>
      <Link
        href="/"
        className="mt-10 text-xs uppercase tracking-[0.2em] text-forest hover:text-forest-soft"
      >
        ← Back home
      </Link>
    </main>
  );
}
