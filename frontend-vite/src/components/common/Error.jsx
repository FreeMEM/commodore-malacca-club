export default function Error({ message = 'Ha ocurrido un error' }) {
  return (
    <div className="error">
      <p>{message}</p>
    </div>
  )
}
