import EventCard from './EventCard'

export default function EventList({ eventos }) {
  if (!eventos || eventos.length === 0) {
    return <p>No hay eventos proximos.</p>
  }

  return (
    <div className="card-grid">
      {eventos.map((evento) => (
        <EventCard key={evento.id} evento={evento} />
      ))}
    </div>
  )
}
