import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { AccentSwitcher } from './AccentSwitcher'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 xl:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShoppingBag size={20} />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              Stack Shop App
            </span>
          </div>

          <nav className="hidden items-center gap-3 text-sm font-medium text-muted-foreground sm:flex">
            <Link
              to="/"
              className="rounded-lg px-3 py-1 transition hover:bg-muted hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="rounded-lg px-3 py-1 transition hover:bg-muted hover:text-foreground"
            >
              Products
            </Link>
            <Link to="/create-product">Create Product</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <AccentSwitcher />
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted hover:shadow-md"
          >
            <span>Cart</span>
            <span
              className="flex h-6 max-w-6 items-center justify-center rounded-full bg-primary px-2 
                text-[11px] font-bold text-primary-foreground"
            >
              0
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:inline">
              $10
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
