'use client'

import type { ComponentProps, ReactElement } from 'react'
import { Children, cloneElement, useEffect, useMemo, useState } from 'react'
import { Collapse } from '../components'

export function Details({
  children,
  open,
  ...props
}: ComponentProps<'details'>): ReactElement {
  const [openState, setOpen] = useState(!!open)
  // To animate the close animation we have to delay the DOM node state here.
  const [delayedOpenState, setDelayedOpenState] = useState(openState)

  useEffect(() => {
    if (!openState) {
      const timeout = setTimeout(() => setDelayedOpenState(openState), 500)
      return () => clearTimeout(timeout)
    }
    setDelayedOpenState(true)
  }, [openState])

  const [summary, restChildren] = useMemo(() => {
    let summary: ReactElement | undefined
    const restChildren = Children.map(children, child => {
      const isSummary =
        child &&
        typeof child === 'object' &&
        'type' in child &&
        child.type === 'summary'

      if (!isSummary) return child

      summary ||= cloneElement(child, {
        onClick(event: MouseEvent) {
          event.preventDefault()
          setOpen(v => !v)
        }
      })
    })
    return [summary, restChildren]
  }, [children])

  return (
    <details
      className="_my-4 _rounded _border _border-gray-200 _bg-white _p-2 _shadow-sm first:_mt-0 dark:_border-neutral-800 dark:_bg-neutral-900"
      {...props}
      open={delayedOpenState}
      data-expanded={openState ? '' : undefined}
    >
      {summary}
      <Collapse isOpen={openState}>{restChildren}</Collapse>
    </details>
  )
}