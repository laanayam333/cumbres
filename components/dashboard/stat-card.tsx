export const StatCard = ({
  label,
  value,
  unit,
}: {
  label: string
  value: number | string
  unit?: string
}) => {
  return (
    <div>
      <div className="flex h-full flex-col justify-center rounded-lg border-2 border-branding-green bg-white px-5 py-2.5">
        <h3 className="text-bold text-sm">{label}</h3>
        <div>
          <span className="font-serif text-2xl font-bold sm:text-3xl">
            {value}
          </span>
          <span className="text-sm">{` ${unit}`}</span>
        </div>
      </div>
    </div>
  )
}
