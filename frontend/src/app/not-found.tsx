export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">404</h1>
        <p className="text-gray-500 mt-2">Page not found</p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Go home
        </a>
      </div>
    </div>
  );
}
