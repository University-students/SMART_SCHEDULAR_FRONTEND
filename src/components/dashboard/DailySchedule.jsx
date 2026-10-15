import LectureCard from '../timetable/LectureCard'

const DailySchedule = ({ lectures = [] }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold text-lg mb-3">📅 Today's Schedule</h3>
      {lectures.length === 0 ? (
        <p className="text-gray-500 text-sm">No lectures today</p>
      ) : (
        <div className="grid gap-3">
          {lectures.map((lec) => (
            <LectureCard key={lec._id} lecture={lec} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DailySchedule
