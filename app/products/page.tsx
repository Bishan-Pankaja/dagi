import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Filter, Grid, List } from "lucide-react"

interface SearchParams {
  search?: string
  category?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Apply search filter
  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }

  // Apply category filter
  if (params.category) {
    query = query.eq("category_id", params.category)
  }

  const { data: products, error } = await query

  // Get categories for sidebar
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            {params.search ? `Search Results` : "Our Products"}
          </h1>
          {params.search && (
            <p className="text-xl text-muted-foreground mb-4">
              Showing results for "{params.search}"
            </p>
          )}
          <p className="text-muted-foreground">
            {products?.length || 0} products found
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <Card className="glass-effect border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    asChild 
                    variant={!params.category ? "default" : "ghost"} 
                    className="w-full justify-start rounded-full"
                  >
                    <Link href="/products">All Products</Link>
                  </Button>
                  {categories?.map((category) => (
                    <Button
                      key={category.id}
                      asChild
                      variant={params.category === category.id ? "default" : "ghost"}
                      className="w-full justify-start rounded-full"
                    >
                      <Link href={`/products?category=${category.id}`}>
                        {category.name}
                      </Link>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Filters Card */}
              <Card className="glass-effect border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Price Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start rounded-full">
                      Under $25
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-full">
                      $25 - $50
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-full">
                      $50 - $100
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-full">
                      Over $100
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Mobile filters */}
            <div className="lg:hidden mb-6">
              <Card className="glass-effect border-0">
                <CardContent className="p-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Badge 
                      variant={!params.category ? "default" : "secondary"}
                      className="whitespace-nowrap"
                    >
                      <Link href="/products">All</Link>
                    </Badge>
                    {categories?.map((category) => (
                      <Badge
                        key={category.id}
                        variant={params.category === category.id ? "default" : "secondary"}
                        className="whitespace-nowrap"
                      >
                        <Link href={`/products?category=${category.id}`}>
                          {category.name}
                        </Link>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            {products && products.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {products.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="glass-effect border-0 shadow-lg">
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                    <Grid className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">No products found</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {params.search || params.category
                      ? "Try adjusting your search criteria or browse all products"
                      : "No products are currently available"}
                  </p>
                  {(params.search || params.category) && (
                    <Button asChild className="rounded-full">
                      <Link href="/products">View All Products</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}