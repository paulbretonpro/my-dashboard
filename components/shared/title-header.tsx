export default function TitleHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <h1 className="text-lg font-medium">{title}</h1>
      {description && <div className="text-gray-400">{description}</div>}
    </div>
  )
}
