export interface EventSpeaker {
    id: number
    name: string
    title: string
    bio: string
    photo: string
  }
  
  export interface EventScheduleItem {
    id: number
    time: string
    title: string
    description: string
    speaker?: EventSpeaker
  }
  
  export interface EventDay {
    date: string
    items: EventScheduleItem[]
  }
  
  export interface EventTicketType {
    id: number
    name: string
    price: number
    description: string
    available: number
  }
  
  export interface Event {
    id: number
    title: string
    date: string
    endDate?: string
    location: string
    description: string
    price: number
    category: string
    image: string
    organizer: {
      name: string
      description: string
      logo?: string
    }
    schedule: EventDay[]
    speakers?: EventSpeaker[]
    ticketTypes: EventTicketType[]
    venue: {
      name: string
      address: string
      city: string
      state: string
      zip: string
      coordinates: {
        lat: number
        lng: number
      }
    }
  }