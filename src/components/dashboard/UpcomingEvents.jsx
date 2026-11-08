const UpcomingEvents = ({ events = [] }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold text-lg mb-3">📌 Upcoming CA / Events</h3>
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming events</p>
      ) : (
        events.map((event, idx) => (
          <div key={idx} className="border-b py-2 last:border-0">
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">{event.date}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default UpcomingEvents
