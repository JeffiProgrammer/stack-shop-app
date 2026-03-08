import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <p>Here you can find all our products.</p>
      <Link
        to="/products/$id"
        params={{ id: '1' }}
        className="text-blue-500 hover:underline"
      >
        View Product 1
      </Link>
      <Link
        to="/products/$id"
        params={{ id: '2' }}
        className="text-blue-500 hover:underline"
      >
        View Product 2
      </Link>
      <Link
        to="/products/$id"
        params={{ id: '3' }}
        className="text-blue-500 hover:underline"
      >
        View Product 3
      </Link>
    </div>
  )
}
