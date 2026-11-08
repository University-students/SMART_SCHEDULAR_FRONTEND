import { useEffect, useState } from 'react'
import { lectureService } from '../services/lectureService'
import DailySchedule from '../components/dashboard/DailySchedule'
import AlertWidget from '../components/dashboard/AlertWidget'
import UpcomingEvents from '../components/dashboard/UpcomingEvents'

const Dashboard = () => {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTodayLectures = async () => {
      try {
        const data = await lectureService.getTodayLectures()
        setLectures(data)
      } catch (err) {
        setError('දත්ත ලබා ගැනීමේදී දෝෂයක් ඇති විය!')
        // Dummy data for preview
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
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchTodayLectures()
  }, [])

  if (loading) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailySchedule lectures={lectures} />
        </div>
        <div className="space-y-6">
          <AlertWidget
            alerts={[
              { type: 'cancel', message: 'CS101 lecture cancelled today' },
              { type: 'reschedule', message: 'DBMS moved to 2 PM' },
            ]}
          />
          <UpcomingEvents
            events={[
              { title: 'CA 2 - Data Structures', date: '2026-10-20' },
              { title: 'Tech Talk', date: '2026-10-25' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
