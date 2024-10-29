import { create } from 'zustand'

const useCoversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    message: [],
    setMessage: (message) => set({ message }),
}))

export default useCoversation