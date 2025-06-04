interface TextFieldProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
  multiline?: boolean
  rows?: number
}

export default function TextField({
  placeholder = "Enter text...",
  value,
  onChange,
  className = "",
  multiline = false,
  rows = 4,
}: TextFieldProps) {
  const baseClasses =
    "w-full p-6 border-2 border-indigo-400 rounded-2xl focus:outline-none focus:border-indigo-500 text-gray-700 placeholder-gray-400 bg-white shadow-sm transition-colors"

  if (multiline) {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} resize-none ${className}`}
        rows={rows}
      />
    )
  }

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseClasses} ${className}`}
    />
  )
}
