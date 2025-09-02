import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import Link from "next/link"
import Image from "next/image"
import { Star, Eye } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  image_url: string | null
  categories?: {
    name: string
  } | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="product-card group border-0 shadow-lg overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="p-0 relative">
        <div className="aspect-square relative overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="product-image object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground text-lg">No image</span>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button asChild size="sm" className="rounded-full bg-white/90 text-black hover:bg-white">
              <Link href={`/products/${product.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Link>
            </Button>
          </div>

          {/* Stock badge */}
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-500">
              Only {product.stock_quantity} left
            </Badge>
          )}
          
          {product.stock_quantity === 0 && (
            <Badge className="absolute top-3 left-3 bg-destructive hover:bg-destructive">
              Out of Stock
            </Badge>
          )}

          {/* Category badge */}
          {product.categories && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-black">
              {product.categories.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1">
        <div className="space-y-3">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
          
          {/* Rating stars (placeholder) */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              <div className="text-xs text-muted-foreground">
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 space-y-2">
        <AddToCartButton 
          productId={product.id} 
          disabled={product.stock_quantity === 0}
          className="w-full rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 btn-primary"
        />
        <Button asChild variant="outline" size="sm" className="w-full rounded-full bg-transparent">
          <Link href={`/products/${product.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}