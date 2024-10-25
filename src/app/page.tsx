import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-foreground">
          Welcome to Eventify
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Event Management Made Simple
        </p>
        <Button size="lg">
          Get Started
        </Button>
      </section>
    </div>
  )
}
