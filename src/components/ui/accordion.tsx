import * as React from 'react'

interface AccordionProps {
  children: React.ReactNode
}

export function Accordion({ children }: AccordionProps) {
  return <div className="accordion">{children}</div>
}

interface AccordionItemProps {
  children: React.ReactNode
}

export function AccordionItem({ children }: AccordionItemProps) {
  return <div className="accordion-item">{children}</div>
}

interface AccordionTriggerProps {
  children: React.ReactNode
  onClick: () => void
}

export function AccordionTrigger({ children, onClick }: AccordionTriggerProps) {
  return (
    <button className="accordion-trigger" onClick={onClick}>
      {children}
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
}

export function AccordionContent({ children }: AccordionContentProps) {
  return <div className="accordion-content">{children}</div>
}