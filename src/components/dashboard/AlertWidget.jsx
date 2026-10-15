const AlertWidget = ({ alerts = [] }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold text-lg mb-3">⚠️ Important Alerts</h3>
      {alerts.length === 0 ? (
        <p className="text-gray-500 text-sm">No alerts</p>
      ) : (
        alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`p-2 rounded mb-2 text-sm ${
              alert.type === 'cancel'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {alert.message}
          </div>
        ))
      )}
    </div>
  )
}

export default AlertWidget
