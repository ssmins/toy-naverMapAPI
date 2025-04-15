'use client'

import useHoverAreaStore from "@/store/hoverArea"

export default function Dashboard () {
  const { hoverArea } = useHoverAreaStore() 

  return (
    <div>
      지금 선택한 구는 : {hoverArea} 입니다. 
    </div>

  )
}