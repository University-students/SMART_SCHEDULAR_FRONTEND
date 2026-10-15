import { useEffect, useState } from 'react'
import { lectureService } from '../services/lectureService'
import CalendarView from '../components/timetable/CalendarView'

const TimetablePage = () => {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await lectureService.getAllLectures()
        setLectures(data)
      } catch (err) {
        // Dummy data
        setLectures([
          {
            _id: '1',
            subjectName: 'Data Structures',
            startTime: '08:00',
            endTime: '10:00',
            hallNo: 'A301',
            status: 'Scheduled',
            day: 'Monday',
          },
          {
            _id: '2',
            subjectName: 'Database Systems',
            startTime: '10:30',
            endTime: '12:30',
            hallNo: 'B202',
            status: 'Rescheduled',
            day: 'Monday',
          },
          {
            _id: '3',
            subjectName: 'Operating Systems',
            startTime: '08:00',
            endTime: '10:00',
            hallNo: 'C101',
            status: 'Scheduled',
            day: 'Tuesday',
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <div>Loading timetable...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Timetable</h2>
      <CalendarView lectures={lectures} />
    </div>
  )
}

export default TimetablePage
