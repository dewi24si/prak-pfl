import Card from "./Card"
import Badge from "./Badge"
import Button from "./Button"

export default function ProductCard({ image, title, category, price, description, onDetail }) {
  return (
    <Card padding="p-0" hover className="overflow-hidden">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-44 object-cover" />
        <div className="absolute top-3 left-3">
          <Badge type="primary">{category}</Badge>
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-base font-bold text-teks mb-1 line-clamp-1">{title}</h2>
        <p className="text-teks-samping text-sm mb-4 line-clamp-2 leading-relaxed">{description}</p>
        <div className="flex items-center justify-between">
          <p className="text-biru font-bold text-lg">{price}</p>
          <Button type="primary" size="sm" onClick={onDetail}>Detail</Button>
        </div>
      </div>
    </Card>
  )
}
