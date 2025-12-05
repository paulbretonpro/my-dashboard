import { CardTaskInLate } from './dashboard/components/CardTaskInLate'
import { CardTaskOfTheDay } from './dashboard/components/CardTaskOfTheDay'
import { CardTaskTomorrow } from './dashboard/components/CardTaskTomorrow'
import styles from './dashboard/css/dashboard.module.css'

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.today}>
        <CardTaskOfTheDay />
      </div>
      <div className={styles.tomorrow}>
        <CardTaskTomorrow />
      </div>
      <div className={styles.late}>
        <CardTaskInLate />
      </div>

      <div className={styles.last}>Last task</div>
    </div>
  )
}
