import { create } from "zustand";

interface HoverAreaState {
  hoverArea : string // 현재 hover 중인 구역 이름 
  setHoverArea : (area: string) => void // 구역 이름 설정 함수  
}

const useHoverAreaStore = create<HoverAreaState>((set) => ({
  hoverArea: "", 
  setHoverArea: (area) => set({ hoverArea: area }), 
}))

export default useHoverAreaStore 