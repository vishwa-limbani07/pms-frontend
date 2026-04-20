export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
      {Icon && (
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl flex items-center
          justify-center mb-3 sm:mb-4">
          <Icon size={22} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-xs sm:text-sm text-gray-400 mb-4 max-w-xs">{description}</p>}
      {action && action}
    </div>
  )
}