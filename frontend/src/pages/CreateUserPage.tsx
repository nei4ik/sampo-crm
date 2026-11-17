import {useState} from 'react'
import { authClient } from '../lib/auth-client'
export const CreateUserPage = () => {
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
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to register')
        }
    }
    return (
        <section className="auth-page" aria-labelledby="register-title">
        <div className="auth-card">
            <div className="auth-heading">
            <h1 id="register-title">Luo käyttäjä</h1>
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
        </div>
        </section>
    )
}