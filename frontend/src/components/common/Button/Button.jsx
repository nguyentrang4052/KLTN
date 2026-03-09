// import './Button.css'

// function Button({ 
//   children, 
//   variant = 'rust', 
//   size = 'md', 
//   className = '',
//   onClick,
//   type = 'button'
// }) {
//   const variantClass = `btn-${variant}`
//   const sizeClass = size !== 'md' ? `btn-${size}` : ''
  
//   return (
//     <button 
//       type={type}
//       className={`btn ${variantClass} ${sizeClass} ${className}`}
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   )
// }

// export default Button


import './Button.css'

function Button({ 
  children, 
  variant = 'rust', 
  size = 'md', 
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  icon = null,        // ← thêm prop icon
  iconPosition = 'left' // ← vị trí icon: 'left' | 'right'
}) {
  const variantClass = `btn-${variant}`
  const sizeClass = size !== 'md' ? `btn-${size}` : ''
  
  return (
    <button 
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  )
}

export default Button