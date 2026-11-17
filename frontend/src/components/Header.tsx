import logo from '../assets/pictures/Sampo_tunnus.jpg'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { authClient } from '../lib/auth-client'

export const Header = () => {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const username = session?.user.username ?? session?.user.name

  const handleSignOut = async () => {
    setSignOutError(null)
    try {
      const { error } = await authClient.signOut()
      if (error) {
        setSignOutError(error.message || 'Kirjautuminen ulos epäonnistui.')
        return
      }
      navigate('/')
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Kirjautuminen ulos epäonnistui.')
    }
  }

  return (
    <header
      className="
        grid grid-cols-[240px_minmax(0,1fr)_240px]
        items-center
        bg-white px-4 py-4
        border-b-4 border-(--color-primary)
      "
    >
      <img
        src={logo}
        alt="Saimaan ammattiopisto Sampo"
        className="h-18 w-auto max-w-none justify-self-start"
      />

      <h1 className="text-center text-4xl font-semibold text-(--color-slate)">
        Hallintapaneeli
      </h1>

      	<div className="flex flex-col items-end gap-1">
        	<div className="flex items-center justify-end gap-3">
          	{session ? (
				<>
					<span className="text-sm text-gray-600">Kirjautunut: {username}</span>
					<button
						onClick={() => void handleSignOut()}
						className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
					>
						Kirjaudu ulos
					</button>
				</>
			) : (
				<Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Kirjaudu</Link>
			)}
        </div>
        {signOutError && <p role="alert" className="text-sm text-red-700">{signOutError}</p>}
      </div>
    </header>
  )
}
