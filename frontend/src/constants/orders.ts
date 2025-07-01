export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED', 
  PREPARING: 'PREPARING',
  READY: 'READY',
  PICKED_UP: 'PICKED_UP',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation', 
  READY: 'Prêt à récupérer',
  PICKED_UP: 'Récupérée',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée'
}

export const ORDER_STATUS_SEVERITY: Record<string, string> = {
  PENDING: 'secondary',
  CONFIRMED: 'info',
  PREPARING: 'warning',
  READY: 'warning',
  PICKED_UP: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'secondary'
} 