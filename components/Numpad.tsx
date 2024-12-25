'use client'

import { Button } from "@/components/ui/button"

interface NumpadProps {
  value: string
  onChange: (value: string) => void
}

export function Numpad({ value, onChange }: NumpadProps) {
  const buttons = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    "0", ".", "C"
  ]

  const handleClick = (key: string) => {
    if (key === "C") {
      onChange("")
    } else if (value.length < 3 || key === ".") { // Allow only up to 3 digits or a decimal point
      onChange(value + key)
    }
  }

  return (
    <div className="w-full max-w-xs">
      <div className="bg-gray-100 p-2 rounded-lg mb-2">
        <input
          type="text"
          value={value}
          readOnly
          className="w-full text-right text-lg font-mono p-2 rounded"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {buttons.map((button) => (
          <Button
            key={button}
            onClick={() => handleClick(button)}
            variant={button === "C" ? "destructive" : "secondary"}
            className="w-full h-12 text-lg font-semibold"
          >
            {button}
          </Button>
        ))}
      </div>
    </div>
  )
}