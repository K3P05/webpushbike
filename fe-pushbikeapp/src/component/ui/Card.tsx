import * as React from "react"

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[#00ADB5]/40 bg-[#00ADB5]/20 shadow-md transition-all duration-300 ${className}`}
      {...props}
    />
  )
}

export function CardHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-4 border-b border-[#00ADB5]/30 ${className}`}
      {...props}
    />
  )
}

export function CardContent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-4 ${className}`}
      {...props}
    />
  )
}
