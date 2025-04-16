
import NaverMap from "@/components/naverMap"
import styles from "./main.module.css"
import Dashboard from "@/components/dashboard"
import YangsanMap from "@/components/yangsanmap"
// import NaverMap2 from "@/components/map"

export default function Map () { 

  return (
    <div className={styles.container}>
      <div className={styles.map}>
        <NaverMap />
      </div>
      <div className={styles.map}>
        <YangsanMap />
      </div>
      {/* <div className={styles.map}>
        <NaverMap2 />
      </div> */}
      <div className={styles.dashboard}>
        <Dashboard />
      </div>
    </div>
  )
}