import { create } from 'zustand'
import { ConfigInterface } from '../../../main/utils/Config'

interface GlovalVariables {
  config?: ConfigInterface
  setConfig: (config?: ConfigInterface) => void
}

const useGlovalVariables = create<GlovalVariables>((set) => ({
  config: undefined,
  setConfig: (config?: ConfigInterface) => set((state) => ({ ...state, config }))
}))

export default useGlovalVariables
