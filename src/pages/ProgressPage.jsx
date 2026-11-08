import { useEffect, useState } from 'react'
import { lectureService } from '../services/lectureService'

const ProgressPage = () => {
  const [progress, setProgress] = useState([])

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await lectureService.getProgress()
        setProgress(data)
      } catch (err) {
        setProgress([
          { subject: 'Data Structures', completed: 70 },
          { subject: 'Database Systems', completed: 45 },
          { subject: 'Operating Systems', completed: 60 },
        ])
      }
    }
    fetchProgress()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lecture Progress</h2>
      <div className="grid gap-4">
        {progress.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{item.subject}</span>
              <span>{item.completed}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${item.completed}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressPage
