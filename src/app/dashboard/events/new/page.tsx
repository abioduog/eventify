'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useFieldArray } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Using the same schema as the frontend for validation
const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  date: z.string(),
  image: z.string().url(),
  venue: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zip: z.string().min(5),
  }),
  ticketTypes: z.array(z.object({
    name: z.string().min(2),
    price: z.number().min(0),
    description: z.string(),
  })).min(1),
})

type EventForm = z.infer<typeof eventSchema>

// Extract unique categories from sample events
const categories = ['Technology', 'Music', 'Business', 'Food & Drink', 'Art', 'Sports']

export default function NewEventPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ticketTypes: [{ name: '', price: 0, description: '', quantity: 100 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ticketTypes',
  })

  async function onSubmit(data: EventForm) {
    try {
      const response = await fetch('/api/dashboard/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const { event } = await response.json()
      router.push(`/dashboard/events/${event.id}`)
    } catch (error) {
      setError('Failed to create event. Please try again.')
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ORGANIZER']}>
      <div className="container max-w-screen-md mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="Enter event title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Describe your event"
                    rows={4}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    {...form.register('date')}
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image URL</Label>
                  <Input
                    id="image"
                    {...form.register('image')}
                    placeholder="Enter image URL"
                  />
                  {form.formState.errors.image && (
                    <p className="text-sm text-destructive">{form.formState.errors.image.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => form.setValue('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...form.register('location')}
                    placeholder="e.g., San Francisco, CA"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Venue Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Venue Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="venue.name">Venue Name</Label>
                    <Input
                      id="venue.name"
                      {...form.register('venue.name')}
                      placeholder="Enter venue name"
                    />
                    {form.formState.errors.venue?.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="venue.address">Address</Label>
                    <Input
                      id="venue.address"
                      {...form.register('venue.address')}
                      placeholder="Enter street address"
                    />
                    {form.formState.errors.venue?.address && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.address.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue.city">City</Label>
                    <Input
                      id="venue.city"
                      {...form.register('venue.city')}
                      placeholder="Enter city"
                    />
                    {form.formState.errors.venue?.city && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue.state">State</Label>
                    <Input
                      id="venue.state"
                      {...form.register('venue.state')}
                      placeholder="Enter state"
                    />
                    {form.formState.errors.venue?.state && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue.zip">ZIP Code</Label>
                    <Input
                      id="venue.zip"
                      {...form.register('venue.zip')}
                      placeholder="Enter ZIP code"
                    />
                    {form.formState.errors.venue?.zip && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.zip.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organizer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Organizer Information</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizer.name">Organizer Name</Label>
                    <Input
                      id="organizer.name"
                      {...form.register('organizer.name')}
                      placeholder="Enter organizer name"
                    />
                    {form.formState.errors.organizer?.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.organizer.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizer.description">Organizer Description</Label>
                    <Textarea
                      id="organizer.description"
                      {...form.register('organizer.description')}
                      placeholder="Brief description of the organizing entity"
                      rows={3}
                    />
                    {form.formState.errors.organizer?.description && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.organizer.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Types */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Ticket Types</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', price: 0, description: '', quantity: 1 })}
                  >
                    Add Ticket Type
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Ticket Type {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          {...form.register(`ticketTypes.${index}.name`)}
                          placeholder="e.g., General Admission"
                        />
                        {form.formState.errors.ticketTypes?.[index]?.name && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...form.register(`ticketTypes.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          placeholder="0.00"
                        />
                        {form.formState.errors.ticketTypes?.[index]?.price && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.price?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          {...form.register(`ticketTypes.${index}.description`)}
                          placeholder="What's included with this ticket type?"
                          rows={2}
                        />
                        {form.formState.errors.ticketTypes?.[index]?.description && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.description?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          step="1"
                          {...form.register(`ticketTypes.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          placeholder="1"
                        />
                        {form.formState.errors.ticketTypes?.[index]?.quantity && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.quantity?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity Available</Label>
                        <Input
                          type="number"
                          {...form.register(`ticketTypes.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          placeholder="100"
                        />
                        {form.formState.errors.ticketTypes?.[index]?.quantity && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.quantity?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/events')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
