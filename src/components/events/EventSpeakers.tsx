import { EventSpeaker } from '@/types/events'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface EventSpeakersProps {
  speakers: EventSpeaker[]
}

export function EventSpeakers({ speakers }: EventSpeakersProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Speakers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map(speaker => (
          <Card key={speaker.id} className="flex flex-col items-center text-center">
            <img src={speaker.photo} alt={speaker.name} className="w-24 h-24 rounded-full mb-4" />
            <CardHeader>
              <CardTitle>{speaker.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{speaker.title}</p>
              <p className="text-sm mt-2">{speaker.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}