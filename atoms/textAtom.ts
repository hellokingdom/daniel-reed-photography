import { atom } from 'jotai'

interface TextState {
  text: string
  position: string
  isLoaded: boolean
}

// Define and export the Jotai atom
export const textAtom = atom<TextState>({
  text: '',
  position: '',
  isLoaded: false,
})
