import styles from './styles.module.css';
import Button from '@mui/material/Button';

const Home = () => {
  return (
    <div style={{}} className={styles["container"]}>
      <div className={styles["inner-container"]}>
        <div className={styles["title"]}>
          <div style={{ fontSize: '62px', fontWeight: '400' }} >
            Welcome to
          </div>
          <div style={{ fontSize: '121px', fontWeight: '700' }}>
            REVI
            <span className={styles["gradient"]}>
              FI
            </span>
          </div>
        </div>
        <div className="text-xl">
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque minima consequatur fugit et error exercitationem suscipit ipsam adipisci</p>
          <p>nostrum fugiat tempore atque autem vitae accusamus voluptatibus expedita, vel dolor iure.</p>
        </div>
        <div className={styles["buttons"]}>
          <Button style={{ color: 'white', background: 'linear-gradient(#0047aa, #0085b6)',width: '50%' }}>
            Join Telegram
          </Button>
          <Button style={{ border: '2px solid #0047AA', width: '50%' }} >
            LitePaper
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home