import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Store {
  id: string
  name: string
  address: string
  phone: string
  openingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
}

export interface PickupSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
}

export interface OrderData {
  // Informations client
  customerName: string
  customerEmail: string
  customerPhone: string
  
  // Sélection boutique et créneau
  selectedStore: Store | null
  selectedSlot: PickupSlot | null
  
  // Paiement
  paymentMethod: 'card' | 'cash' | null
  
  // Notes
  notes: string
}

export const useOrderStore = defineStore('order', () => {
  const orderData = ref<OrderData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    selectedStore: null,
    selectedSlot: null,
    paymentMethod: null,
    notes: ''
  })

  const currentStep = ref(1)
  const isLoading = ref(false)

  // Mock data pour les boutiques
  const stores = ref<Store[]>([
    {
      id: '1',
      name: 'PanthéOnze République',
      address: '8 place de la République, 75011 Paris',
      phone: '01 48 07 92 34',
      openingHours: {
        monday: '9h00 - 19h00',
        tuesday: '9h00 - 19h00',
        wednesday: '9h00 - 19h00',
        thursday: '9h00 - 19h00',
        friday: '9h00 - 20h00',
        saturday: '8h30 - 20h00',
        sunday: '9h00 - 18h00'
      }
    },
    {
      id: '2',
      name: 'PanthéOnze Bastille',
      address: '15 boulevard Richard Lenoir, 75011 Paris',
      phone: '01 43 55 88 22',
      openingHours: {
        monday: '8h30 - 19h30',
        tuesday: '8h30 - 19h30',
        wednesday: '8h30 - 19h30',
        thursday: '8h30 - 19h30',
        friday: '8h30 - 20h30',
        saturday: '8h00 - 20h30',
        sunday: '9h00 - 17h00'
      }
    },
    {
      id: '3',
      name: 'PanthéOnze Nation',
      address: '22 avenue de la République, 75011 Paris',
      phone: '01 47 00 45 67',
      openingHours: {
        monday: '9h00 - 19h00',
        tuesday: '9h00 - 19h00',
        wednesday: '9h00 - 19h00',
        thursday: '9h00 - 19h00',
        friday: '9h00 - 20h00',
        saturday: '8h30 - 20h00',
        sunday: '9h30 - 18h30'
      }
    }
  ])

  // Mock function pour générer des créneaux de récupération
  const generatePickupSlots = (storeId: string) => {
    const slots: PickupSlot[] = []
    const today = new Date()
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Créneaux du matin (9h-12h)
      for (let hour = 9; hour < 12; hour++) {
        slots.push({
          id: `${storeId}-${date.toISOString().split('T')[0]}-${hour}`,
          date: date.toISOString().split('T')[0],
          startTime: `${hour.toString().padStart(2, '0')}:00`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
          available: Math.random() > 0.3 // 70% de chance d'être disponible
        })
      }
      
      // Créneaux de l'après-midi (14h-18h)
      for (let hour = 14; hour < 18; hour++) {
        slots.push({
          id: `${storeId}-${date.toISOString().split('T')[0]}-${hour}`,
          date: date.toISOString().split('T')[0],
          startTime: `${hour.toString().padStart(2, '0')}:00`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
          available: Math.random() > 0.2 // 80% de chance d'être disponible
        })
      }
    }
    
    return slots
  }

  const availableSlots = computed(() => {
    if (!orderData.value.selectedStore) return []
    return generatePickupSlots(orderData.value.selectedStore.id)
  })

  const canProceedToNextStep = computed(() => {
    switch (currentStep.value) {
      case 1: // Informations client
        return orderData.value.customerName && 
               orderData.value.customerEmail && 
               orderData.value.customerPhone
      case 2: // Sélection boutique et créneau
        return orderData.value.selectedStore && orderData.value.selectedSlot
      case 3: // Paiement
        return orderData.value.paymentMethod
      default:
        return false
    }
  })

  const setCustomerInfo = (info: { name: string; email: string; phone: string }) => {
    orderData.value.customerName = info.name
    orderData.value.customerEmail = info.email
    orderData.value.customerPhone = info.phone
  }

  const setStore = (store: Store) => {
    orderData.value.selectedStore = store
    orderData.value.selectedSlot = null // Reset slot when store changes
  }

  const setSlot = (slot: PickupSlot) => {
    orderData.value.selectedSlot = slot
  }

  const setPaymentMethod = (method: 'card' | 'cash') => {
    orderData.value.paymentMethod = method
  }

  const setNotes = (notes: string) => {
    orderData.value.notes = notes
  }

  const nextStep = () => {
    if (canProceedToNextStep.value) {
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const resetOrder = () => {
    orderData.value = {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      selectedStore: null,
      selectedSlot: null,
      paymentMethod: null,
      notes: ''
    }
    currentStep.value = 1
  }

  return {
    orderData,
    currentStep,
    isLoading,
    stores,
    availableSlots,
    canProceedToNextStep,
    setCustomerInfo,
    setStore,
    setSlot,
    setPaymentMethod,
    setNotes,
    nextStep,
    previousStep,
    resetOrder
  }
}) 