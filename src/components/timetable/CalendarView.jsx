import LectureCard from './LectureCard'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const CalendarView = ({ lectures = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {days.map((day) => (
        <div key={day} className="bg-white rounded-xl shadow p-3">
          <h3 className="font-bold text-center mb-3">{day}</h3>
          <div className="space-y-2">
            {lectures
              .filter((lec) => lec.day === day)
              .map((lec) => (
                <LectureCard key={lec._id} lecture={lec} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CalendarView
