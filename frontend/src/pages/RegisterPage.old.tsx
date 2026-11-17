import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../styles/components/auth.css'
import { authClient } from '../lib/auth-client'

export type RegisterFormData = {
  username: string
  password: string
}

function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const username = String(formData.get('username') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    try {
      const { error } = await authClient.signUp.email({
        email: `${username.toLowerCase()}@accounts.invalid`,
        name: username,
        password,
        username,
      })
      if (error) {
        throw new Error(error.message)
      }

      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register')
    }
  }

  return (
    <section className="auth-page" aria-labelledby="register-title">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="auth-eyebrow">Sampo</span>
          <h1 id="register-title">Rekisteröidy</h1>
          <p className="auth-description">Luo tunnus asiakasrekisterin harjoitteluympäristöön.</p>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="username">Käyttäjänimi</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Käyttäjänimi"
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Salasana</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Salasana"
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-submit">
            Rekisteröidy
          </button>
        </form>

        <p className="auth-switch">
          Onko sinulla jo tili? <Link to="/login" className="auth-link">Kirjaudu sisään</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
