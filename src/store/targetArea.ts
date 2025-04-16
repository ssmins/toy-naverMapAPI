import { create } from "zustand";

interface AreaState {
  targetAreaCode : number // kn_districts.json에서 가져올 지역 
  setTargetArea : (areaCode: number) => void 
}

const useTargetAreaStore = create<AreaState>((set) => ({
  targetAreaCode: 48330, // 양산시 code. (3204부터 존재) 
  setTargetArea: (areaCode) => set({ targetAreaCode : areaCode })
}))

export default useTargetAreaStore 