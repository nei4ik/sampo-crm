import "../styles/components/client-form.css"
import "../styles/components/client-list.css"
import { MainContent } from "../components/MainContent.tsx"
import { useEffect, useState } from "react";
import { ClientsList } from "../features/ClientsList.tsx"
import { useNavigate } from "react-router";
import { authenticatedFetch, clearAuth } from "../lib/auth";
import type { SubmitEvent } from 'react'

export type CustomerData = {
    id: number
    companyName: string
    businessId: string
    phone: string
    billingAddress: string
}

function isCustomerData(value: unknown): value is CustomerData {
    if (typeof value !== 'object' || value === null) return false
    const customer = value as Record<string, unknown>
    return typeof customer.id === 'number'
        && typeof customer.companyName === 'string'
        && typeof customer.businessId === 'string'
        && typeof customer.phone === 'string'
        && typeof customer.billingAddress === 'string'
}

function ClientsPage() {
    const navigate = useNavigate()
    const [customerList, setCustomerList] = useState<CustomerData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isActive, setIsActive] = useState(true)
    async function loadCustomers() {
            try {
                const response = await authenticatedFetch('/api/customers')
                if (response.status === 401) {
                    await clearAuth()
                    navigate('/login')
                    return
                }
                if (!response.ok) throw new Error('Asiakkaiden lataaminen epäonnistui.')

                const data: unknown = await response.json()
                if (!Array.isArray(data) || !data.every(isCustomerData)) {
                    throw new Error('Palvelin palautti virheelliset asiakastiedot.')
                }
                if (isActive) setCustomerList(data)
            } catch (err) {
                console.error('Failed to load customers', err)
                if (isActive) {
                    setError(err instanceof Error ? err.message : 'Asiakkaiden lataaminen epäonnistui.')
                }
            } finally {
                if (isActive) setIsLoading(false)
            }
        }
    useEffect(() => {
        void loadCustomers()
        return () => {
            setIsActive(false)
        }
    }, [navigate, isActive])

    const submitForm = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const form = event.currentTarget
        const formData = new FormData(form)
        setError(null)

        const customer = {
            companyName: String(formData.get('companyName') ?? '').trim(),
            businessId: String(formData.get('businessId') ?? '').trim(),
            phone: String(formData.get('phone') ?? '').trim(),
            billingAddress: String(formData.get('billingAddress') ?? '').trim(),
        }

        try {
            setIsSaving(true)
            const res = await authenticatedFetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customer),
            })
            if (res.status === 401) {
                await clearAuth()
                navigate('/login')
                return
            }
            if (!res.ok) throw new Error('Yrityksen lisääminen epäonnistui.')
            const created: unknown = await res.json()
            if (!isCustomerData(created)) {
                throw new Error('Palvelin palautti virheelliset asiakastiedot.')
            }
            setCustomerList((prev) => [...prev, created])
            form.reset()
        } catch (err) {
            console.error('Failed to create customer', err)
            setError(err instanceof Error ? err.message : 'Yrityksen lisääminen epäonnistui.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <MainContent>
            
            <div className="grid grid-cols-[400px_minmax(0,1fr)] gap-x-6 gap-y-2">
                <h2 
            className="text-3xl pb-4"
            >Lisää uusi yritys</h2>
                <h2 
            className="text-3xl pb-4"
            >Yrityslista</h2>
            
                <form 
                    onSubmit={submitForm} 
                    className="form-layout"
                >
                    {error && (
                        <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>
                    )}
                    <label htmlFor="company-name">Yritysnimi</label>
                    <input 
                        required
                        id="company-name"
                        name="companyName"
                        type="text"
                    />
                    <label htmlFor="business-id">Y-tunnus</label>
                    <input
                        required
                        id="business-id"
                        name="businessId"
                        type="text"
                        pattern="[0-9]{7}-[0-9]"
                    />
                    <label htmlFor="phone">Puhelinnumero</label>
                    <input 
                        required
                        id="phone"
                        name="phone"
                        type="tel"
                    />
                    <label htmlFor="billing-address">Laskutusosoite</label>
                    <input 
                        required
                        id="billing-address"
                        name="billingAddress"
                        type="text"
                    />
                    <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-(--color-primary) text-white w-60 py-2 mt-2 rounded-xl hover:opacity-90 transition duration-150 ease-in-out">
                        {isSaving ? 'Tallennetaan...' : 'Lisää'}
                    </button>
                </form>
                <div className="overflow-y-auto h-76 border-4 border-(--color-warning) rounded-xl p-2">
                    <div className="clients-grid clients-head">
                        <span>Id</span>
                        <span>Yritys</span>
                        <span>Y-tunnus</span>
                        <span>Puhelinnumero</span>
                        <span>Laskutusosoite</span>
                    </div>
                    {isLoading && <p role="status">Ladataan asiakkaita...</p>}
                    <ClientsList customerList={customerList} setIsActive={setIsActive} />
                </div>
            </div>
        </MainContent>
    )
}

export default ClientsPage
