import type { CustomerData } from "../pages/ClientsPage";

export const ClientsList = ({ customerList, setIsActive }: { customerList: CustomerData[], setIsActive: (active: boolean) => void }) => {
    const deleteClient = async (id: number) => {
        try {
            const response = await fetch(`/api/customers/${id}`, {
                method: 'DELETE',
                body: JSON.stringify({id}),
            });
            if (!response.ok) {
                throw new Error('Failed to delete client');
            }
        } catch (error) {
            console.error('Error deleting client:', error);
        }
        setIsActive(true);
    };
    return (
        <div>
            {customerList.map((client) => (
                <div className="clients-grid clients-row" key={client.id}>
                    <span>{client.id}</span> 
                    <span>{client.companyName}</span>
                    <span>{client.businessId}</span>
                    <span>{client.phone}</span>
                    <span>{client.billingAddress}</span>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-24" onClick={() => deleteClient(client.id)}>Poista</button>
                </div>
            ))}
        </div>
    );
};
