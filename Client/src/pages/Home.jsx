import styles from './pages.module.css';
import Button from '@mui/material/Button';

const Home = () => {
  return (
    <div style={{}} className={styles["home-container"]}>
      <div className="flex-col w-1/2 h-[400px]">
        <div className="text-black">
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
          <p>ReviFi is a decentralized asset manager platform for crypto-portfolio administration.

          </p>
          <p>Experience the power of AI-enhanced DeFi asset management.</p>
        </div>
        <div className="flex gap-[2rem] w-full pt-10">
          <Button style={{ color: 'white', background: 'linear-gradient(#0047aa, #0085b6)', width: '50%' }}>
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