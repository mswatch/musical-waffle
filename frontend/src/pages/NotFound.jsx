import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div data-testid="not-found" className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-7xl md:text-9xl">404</p>
      <p className="mt-2 text-muted">This page does not exist.</p>
      <Link to="/" className="mt-6 btn-luxe">Return Home</Link>
    </div>
  );
}
