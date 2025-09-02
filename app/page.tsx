import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { StoreHeader } from "@/components/store/store-header"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/product-card"
import { ArrowRight, Star, Shield, Truck, CreditCard, Users, TrendingUp } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  // Get featured products (latest 8 products)
  const { data: featuredProducts } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <StoreHeader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10" />
          <div className="container mx-auto px-4 py-24 relative">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
                Discover Amazing Products
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Premium quality products at unbeatable prices. Experience shopping like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-primary text-lg px-8 py-6 rounded-full">
                  <Link href="/products">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full bg-transparent">
                  <Link href="/products">Browse Categories</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center animate-slide-up">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-muted-foreground">Products</div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">4.9</div>
                <div className="text-muted-foreground">Rating</div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-muted-foreground">Secure</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Products</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Handpicked items that our customers love most
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-slide-up" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent">
                  <Link href="/products">
                    View All Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Us?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're committed to providing the best shopping experience
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="hover-lift glass-effect border-0">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Premium Quality</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    We source only the highest quality products from trusted brands and manufacturers worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-effect border-0">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Fast Delivery</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    Lightning-fast shipping with real-time tracking. Get your orders delivered in 1-3 business days.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-effect border-0">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Secure Payments</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    Shop with confidence using our bank-level security and multiple payment options.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="glass-effect border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20" />
              <CardContent className="relative py-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Shopping?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of satisfied customers and discover your next favorite product today.
                </p>
                <Button asChild size="lg" className="btn-primary text-lg px-12 py-6 rounded-full">
                  <Link href="/products">
                    Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-2xl font-bold mb-4">eCommerce Store</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your trusted partner for premium products and exceptional shopping experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/products" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </Link>
                <Link href="/cart" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
                <Link href="/orders" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Orders
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <div className="space-y-2">
                <Link href="/auth/login" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Sign Up
                </Link>
                <Link href="/profile" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <span className="block text-muted-foreground">24/7 Customer Support</span>
                <span className="block text-muted-foreground">Free Returns</span>
                <span className="block text-muted-foreground">Secure Shopping</span>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 eCommerce Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}