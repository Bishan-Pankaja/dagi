"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ShoppingCart, Search, User, Menu, X, Heart, Bell } from "lucide-react"

export function StoreHeader() {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Get current user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Get cart count
        const { count } = await supabase
          .from("cart_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
        setCartCount(count || 0)

        const { data: adminData } = await supabase.from("admin_users").select("id").eq("id", user.id).single()
        setIsAdmin(!!adminData)
      }
    }

    getUser()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="glass-effect border-b sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">
              eCommerce
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="Search for products, brands, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 rounded-full border-2 focus:border-primary/50 bg-background/50"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Button asChild variant="ghost" className="rounded-full hover:bg-primary/10">
              <Link href="/products">Products</Link>
            </Button>

            {user ? (
              <>
                <Button asChild variant="ghost" className="relative rounded-full hover:bg-primary/10">
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-primary to-purple-600 border-0">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                
                <Button asChild variant="ghost" className="rounded-full hover:bg-primary/10">
                  <Link href="/orders">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="rounded-full hover:bg-primary/10">
                  <Link href="/dashboard">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>

                {isAdmin && (
                  <Button asChild className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Link href="/admin/dashboard">Admin</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="rounded-full hover:bg-primary/10">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-xl">
            <div className="py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-full"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <div className="px-4 space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start rounded-full">
                  <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                    Products
                  </Link>
                </Button>

                {user ? (
                  <>
                    <Button asChild variant="ghost" className="w-full justify-start rounded-full">
                      <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Cart {cartCount > 0 && `(${cartCount})`}
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start rounded-full">
                      <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                        Orders
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start rounded-full">
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button asChild className="w-full justify-start rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                        <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="w-full justify-start rounded-full">
                      <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start rounded-full bg-gradient-to-r from-primary to-purple-600">
                      <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}