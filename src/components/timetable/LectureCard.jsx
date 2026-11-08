const LectureCard = ({ lecture }) => {
  const statusColor = {
    Cancelled: 'bg-red-200 text-red-800',
    Rescheduled: 'bg-yellow-200 text-yellow-800',
    Scheduled: 'bg-green-200 text-green-800',
  }

  return (
    <div className="border p-3 rounded-lg shadow-sm bg-white">
      <h4 className="font-semibold text-blue-700">{lecture.subjectName}</h4>
      <p className="text-sm text-gray-600">
        {lecture.startTime} - {lecture.endTime}
      </p>
      <p className="text-sm text-gray-600">Hall: {lecture.hallNo}</p>
      <span
        className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
          statusColor[lecture.status] || 'bg-gray-200'
        }`}
      >
        {lecture.status || 'Scheduled'}
      </span>
    </div>
  )
}

export default LectureCard
