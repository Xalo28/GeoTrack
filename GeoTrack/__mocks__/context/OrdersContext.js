export const useOrders = () => ({
  orders: [
    { 
      id: '1', 
      estado: 'Entregado', 
      customer: 'Cliente A',
      date: '2024-01-15T10:00:00Z',
      productos: ['Producto A', 'Producto B'],
      informacionContacto: {
        telefono: '123456789',
        direccion: 'Av. Principal 123, Lima'
      }
    },
    { 
      id: '2', 
      estado: 'Pendiente', 
      customer: 'Cliente B',
      date: '2024-01-15T11:00:00Z',
      productos: ['Producto C'],
      informacionContacto: {
        telefono: '987654321', 
        direccion: 'Calle Secundaria 456, Miraflores'
      }
    },
    { 
      id: '3', 
      estado: 'Entregado', 
      customer: 'Cliente C',
      date: '2024-01-15T12:00:00Z',
      productos: ['Producto D', 'Producto E'],
      informacionContacto: {
        telefono: '555666777',
        direccion: 'Jr. Tertuliano 789, San Isidro'
      }
    }
  ],
  hasOrders: true,
  addOrder: jest.fn(),
  markAsDelivered: jest.fn(),
  clearOrders: jest.fn(),
  setHasOrders: jest.fn()
});

export const OrdersProvider = ({ children }) => children;