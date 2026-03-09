import './Badge.css'

function Badge({ children, variant = 'gray', className = '' }) {
  return (
    <span className={`badge b-${variant} ${className}`}>
      {children}
    </span>
  )
}

export default Badge