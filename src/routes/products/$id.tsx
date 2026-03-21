import { getProductByID } from '#/data/products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await getProductByID(params.id)
  },
})

function RouteComponent() {
  const product = Route.useLoaderData()

  return (
    <div>
      Hello "/products/{product?.id}"! "{product?.name}"
    </div>
  )
}
