export default function Loading({ message = 'Cargando...' }) {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  )
}
