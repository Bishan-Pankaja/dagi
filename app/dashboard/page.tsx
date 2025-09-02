import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StoreHeader } from "@/components/store/store-header"
import Link from "next/link"
import { Package, User, ShoppingCart, CreditCard, TrendingUp, Clock, Star, Gift } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user statistics
  const [{ count: ordersCount }, { count: cartCount }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", data.user.id),
    supabase.from("cart_items").select("*", { count: "exact", head: true }).eq("user_id", data.user.id),
  ])

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          name
        )
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Welcome back, {profile?.full_name || "Customer"}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account and track your shopping journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="glass-effect border-0 shadow-lg hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ordersCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime orders</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-lg hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cartCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Items in cart</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-lg hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Premium</div>
              <p className="text-xs text-muted-foreground mt-1">Active member</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-lg hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{new Date(data.user.created_at).getFullYear()}</div>
              <p className="text-xs text-muted-foreground mt-1">Year joined</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start h-16 p-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                <Link href="/orders" className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">View Orders</div>
                    <div className="text-sm text-white/80">Track your order history</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-16 p-6 rounded-xl bg-transparent hover:bg-muted/50">
                <Link href="/profile" className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Edit Profile</div>
                    <div className="text-sm text-muted-foreground">Update your information</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-16 p-6 rounded-xl bg-transparent hover:bg-muted/50">
                <Link href="/cart" className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">View Cart</div>
                    <div className="text-sm text-muted-foreground">Review items in cart</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-16 p-6 rounded-xl bg-transparent hover:bg-muted/50">
                <Link href="/products" className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Continue Shopping</div>
                    <div className="text-sm text-muted-foreground">Discover new products</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Recent Orders
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders && recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.order_items.length} items • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${order.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button asChild size="sm" className="rounded-full">
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <div className="mt-12 pt-8 border-t text-center">
          <form action={handleSignOut}>
            <Button variant="outline" type="submit" className="rounded-full px-8 bg-transparent">
              Sign Out
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}