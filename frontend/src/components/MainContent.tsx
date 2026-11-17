import type { ReactNode, } from "react"



export const MainContent = ({children}: {children: ReactNode}) => {

    
    return (
        <section>
            {children}
        </section>
    )
}