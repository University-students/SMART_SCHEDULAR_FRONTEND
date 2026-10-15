import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const DEMO_EMAIL = 'admin@gmail.com'
const DEMO_PASSWORD = 'Admin@123'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email, password) => {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error('Invalid email or password')
    }
    const demoUser = { name: 'Admin', email: DEMO_EMAIL }
    localStorage.setItem('user', JSON.stringify(demoUser))
    localStorage.setItem('token', 'local-demo-token')
    setUser(demoUser)
    return { user: demoUser, token: 'local-demo-token' }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
