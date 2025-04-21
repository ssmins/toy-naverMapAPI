
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
      <div className={styles.map}>
        <iframe src="https://bigdata.sbiz.or.kr/#/openApi/hpReport?certKey=27e9f71f406a5979f384ae3861be81b26d9d306e34aab0fc3f3d068888e15215" width={500} height={500}></iframe>
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