"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

const filterCategories = [
  "All",
  "Conference",
  "Workshop",
  "Seminar",
  "Networking",
  "Concert",
  "Exhibition"
]

export function SearchAndFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    return params.toString()
  }

  const handleSearch = (value: string) => {
    router.push(`${pathname}?${createQueryString('search', value)}`)
  }

  const handleCategoryChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('category', value)}`)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    router.push(`${pathname}?${createQueryString(`${type}Price`, value)}`)
  }

  const handleLocationChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('location', value)}`)
  }

  const clearFilters = () => {
    router.push(pathname)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            defaultValue={searchParams.get('search') ?? ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select 
          defaultValue={searchParams.get('category') ?? 'All'}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {filterCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="number"
          placeholder="Min price"
          className="w-full sm:w-[150px]"
          defaultValue={searchParams.get('minPrice') ?? ''}
          onChange={(e) => handlePriceChange('min', e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max price"
          className="w-full sm:w-[150px]"
          defaultValue={searchParams.get('maxPrice') ?? ''}
          onChange={(e) => handlePriceChange('max', e.target.value)}
        />
        <Input
          placeholder="Location"
          className="flex-grow"
          defaultValue={searchParams.get('location') ?? ''}
          onChange={(e) => handleLocationChange(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="w-full sm:w-auto">
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
