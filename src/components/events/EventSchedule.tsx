import { EventDay } from '@/types/events'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

interface EventScheduleProps {
  schedule: EventDay[]
}

export function EventSchedule({ schedule }: EventScheduleProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
      <Accordion type="single" collapsible>
        {schedule.map((day, index) => (
          <AccordionItem key={index} value={`day-${index}`}>
            <AccordionTrigger>
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-4">
                {day.items.map(item => (
                  <li key={item.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
