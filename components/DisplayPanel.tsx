interface DisplayPanelProps {
  variables: Record<string, any>
}

export function DisplayPanel({ variables }: DisplayPanelProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(variables).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-semibold">{key}:</span>
            <span>
              {key.startsWith("'color'") 
                ? `${Math.round(value as number)}°`
                : typeof value === "boolean"
                  ? (value ? "'On'" : "'Off'")
                  : value.toString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

