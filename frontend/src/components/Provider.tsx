import {createContext, type ReactNode} from 'react'

const ContextProvider = createContext(null)

export const Provider = ({ children }: {children: ReactNode}) => {
    return (
        <ContextProvider value={null}>
            {children}
        </ContextProvider>
    )
}