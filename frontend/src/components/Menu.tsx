import { authClient } from '../lib/auth-client'
import '../styles/components/menu.css'
import { NavLink } from 'react-router'

export const Menu = () => {
  const {data: session} = authClient.useSession();
  const username = session?.user.username ?? session?.user.name
  return (
    <menu className="menu">
      <ul>
        <li>
          <NavLink to="/" end>Ohje</NavLink>
        </li>
        { !session && (<>
          <li>
            <NavLink to="/login" className="text-gray-600 hover:text-gray-900">Kirjaudu</NavLink>
          </li>
        </>
        )}
        {session && (
          <li>
            <NavLink to="/asiakkaat" className="text-gray-600 hover:text-gray-900">Asiakkaat</NavLink>
          </li>
        )}
        {session && username === "admin" && (
          <>
            <li>
              <NavLink to="/kayttajat" className="text-gray-600 hover:text-gray-900">Käyttäjät</NavLink>
            </li>
            <li>
              <NavLink to="/luo-kayttaja" className="text-gray-600 hover:text-gray-900">Luo käyttäjä</NavLink>
            </li>
          </>
        )}
      </ul>
    </menu>
  )
}
