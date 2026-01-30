import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmMessage } from '../api/sports'
import { createLogger } from '../utils/logger'

const logger = createLogger('Home')

const LOGO_URL = "https://www.figma.com/api/mcp/asset/bc982888-6d61-413c-ae91-dec2555ed99a";

const Home = () => {
  const [inputValue, setInputValue] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      logger.warn('Submit attempted with empty input')
      setMessage('Please enter a message')
      return
    }

    logger.info('Submitting confirmation', { input: inputValue })
    setLoading(true)
    setMessage('')

    try {
      const response = await confirmMessage(inputValue)
      if (response === 'Yes') {
        logger.info('Confirmation successful, navigating to sports')
        setMessage('confirmed')
        setTimeout(() => {
          navigate('/sports')
        }, 500)
      } else {
        logger.info('Confirmation rejected', { response })
        setMessage('Try again')
      }
    } catch (error) {
      logger.error('Confirmation request failed', { error: error.message })
      setMessage('Error: Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#020618',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.3,
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          width: '670px',
          height: '468px',
          left: '-335px',
          top: '234px',
          background: 'rgba(43, 127, 255, 0.2)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          width: '670px',
          height: '468px',
          right: '-335px',
          top: '234px',
          background: 'rgba(0, 211, 243, 0.2)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          width: '447px',
          height: '312px',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '312px',
          background: 'rgba(5, 223, 114, 0.1)',
          filter: 'blur(100px)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Decorative dots */}
      {[
        { left: '10%', top: '17%', opacity: 0.49 },
        { left: '22%', top: '44%', opacity: 0.23 },
        { left: '34%', top: '70%', opacity: 0.21 },
        { left: '46%', top: '18%', opacity: 0.34 },
        { left: '58%', top: '42%', opacity: 0.55 },
        { left: '70%', top: '67%', opacity: 0.45 },
        { left: '82%', top: '18%', opacity: 0.31 },
        { left: '94%', top: '44%', opacity: 0.24 },
      ].map((dot, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          left: dot.left,
          top: dot.top,
          backgroundColor: 'rgba(81, 162, 255, 0.4)',
          borderRadius: '50%',
          opacity: dot.opacity,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '90px',
        width: '100%',
        maxWidth: '864px',
      }}>
        {/* Logo */}
        <img
          src={LOGO_URL}
          alt="Think41"
          style={{
            width: '146px',
            height: '32px',
            marginBottom: '112px',
          }}
        />

        {/* Heading */}
        <div style={{
          textAlign: 'center',
          marginBottom: '136px',
        }}>
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '96px',
            lineHeight: '120px',
            color: '#FFFFFF',
            margin: 0,
          }}>
            Elevate Your
          </h1>
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '96px',
            lineHeight: '120px',
            margin: 0,
            background: 'linear-gradient(90deg, #51A2FF 0%, #53EAFD 50%, #05DF72 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Sports Experience
          </h1>
        </div>

        {/* Input section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '448px',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              color: '#62748E',
              letterSpacing: '-0.15px',
              margin: 0,
            }}>
              Type "confirm" to continue
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here..."
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%',
                height: '58px',
                padding: '16px 24px',
                backgroundColor: 'rgba(15, 23, 43, 0.5)',
                border: '1px solid #1D293D',
                borderRadius: '16px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '16px',
                color: '#FFFFFF',
                letterSpacing: '-0.31px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              height: '68px',
              background: 'linear-gradient(90deg, #2B7FFF 0%, #00D3F2 100%)',
              borderRadius: '9999px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '28px',
              color: '#0F172B',
              letterSpacing: '-0.44px',
            }}>
              {loading ? 'Checking...' : 'Get Started'}
            </span>
          </button>
        </div>

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px 24px',
            fontSize: '14px',
            color: message === 'confirmed' ? '#05DF72' : '#ff6b6b',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
          }}>
            {message === 'confirmed' ? '✓ Confirmed!' : message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
