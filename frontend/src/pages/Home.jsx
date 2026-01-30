import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmMessage } from '../api/sports'

const Home = () => {
  const [inputValue, setInputValue] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setMessage('Please enter a message')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await confirmMessage(inputValue)
      if (response === 'Yes') {
        setMessage('✓ Confirmed!')
        setTimeout(() => {
          navigate('/sports')
        }, 500)
      } else {
        setMessage('Try again')
      }
    } catch (error) {
      setMessage('Error: Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '20px',
      backgroundColor: 'white'
    }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type 'confirm' to proceed"
        style={{
          padding: '12px 20px',
          fontSize: '16px',
          width: '300px',
          border: '2px solid #ccc',
          borderRadius: '8px',
          outline: 'none',
          color:"black"
        }}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '12px 40px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'black',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Checking...' : 'Submit'}
      </button>

      {message && (
        <div style={{
          padding: '12px 24px',
          fontSize: '16px',
          color: message === '✓ Confirmed!' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Home