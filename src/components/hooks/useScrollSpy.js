import { useEffect, useState } from "react"

export function useScrollSpy(sectionIds, offset = 0.5) {
  const [active, setActive] = useState("")

  useEffect(() => {
    const observers= []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id)
          }
        },
        {
          root: null,
          threshold: offset, // 👈 controls when section becomes active
        }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sectionIds, offset])

  return active
}