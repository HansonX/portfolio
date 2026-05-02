import '../App.css'
import { SpotifyNowPlaying } from '../SpotifyNowPlaying'
import { WelcomeTyping } from '../WelcomeTyping'

const YOUTUBE_VLOGS = 'https://www.youtube.com/@hanson9305'
const YOUTUBE_MUSIC =
  'https://www.youtube.com/watch?v=BhO4zqprUDo&list=PL95xtCx6ID-oJ1tJjwUpH514o9hyLRed4&pp=sAgC'

export default function HomePage() {
  return (
    <div className="page">
      <nav className="side-menu" aria-label="section navigation">
        <a href="#about">about me</a>
        <a href="#experiences">experiences</a>
        <a href="#footer">connect</a>
      </nav>

      <header className="section section--welcome" id="welcome">
        <SpotifyNowPlaying />
        <div className="section__inner">
          <WelcomeTyping />
        </div>
      </header>

      <main>
        <section className="section section--about" id="about">
          <div className="section__inner section__inner--about">
            <div className="about__grid">
              <div className="about__content">
                <h2>about me</h2>
                <p>
                  software engineer at permitflow, graduated
                  from northwestern university in 2026, interested in full stack development, operating systems, and ai/ml
                </p>
                <p>my technologies:</p>
                <ul className="about__tech-list">
                  <li>python</li>
                  <li>java</li>
                  <li>c++</li>
                  <li>javascript</li>
                  <li>typescript</li>
                  <li>react</li>
                  <li>sql</li>
                  <li>aws</li>
                </ul>
              </div>
              <figure className="about__figure">
                <img
                  className="about__image"
                  src="/me-pic3.jpg"
                  alt="portrait"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="section section--experiences" id="experiences">
          <div className="section__inner section__inner--about">
            <h2>experiences</h2>
            <ul className="experience-list">
              <li className="experience-list__item">
                <h3>permitflow</h3>
                <p className="experience-list__meta">starting september 2026</p>
                <p>
                  software engineer <br />
                  nyc
                </p>
              </li>
              <li className="experience-list__item">
                <h3>amazon web services</h3>
                <p className="experience-list__meta">june 2025 - september 2025</p>
                <p>
                  software development engineer intern <br />
                  seattle, wa
                </p>
              </li>
              <li className="experience-list__item">
                <h3>netscout</h3>
                <p className="experience-list__meta">june 2024 - august 2024</p>
                <p>
                  software engineering intern
                  <br />
                  allen, tx
                </p>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="section section--footer" id="footer">
        <div className="section__inner section__inner--footer">
          <h2 className="footer__title">connect</h2>
          <div className="footer__groups">
            <div className="footer__group">
              <h3 className="footer__subheader">professional</h3>
              <nav className="footer__links" aria-label="professional links">
                <a href="mailto:hhanxu1119@gmail.com">email</a>
                <a href="https://github.com/HansonX" target="_blank" rel="noreferrer">
                  github
                </a>
                <a href="https://www.linkedin.com/in/hansonxu/" target="_blank" rel="noreferrer">
                  linkedin
                </a>
              </nav>
            </div>

            <div className="footer__group">
              <h3 className="footer__subheader">social</h3>
              <nav className="footer__links" aria-label="social links">
                <a href="https://www.instagram.com/_hansonx_/" target="_blank" rel="noreferrer">
                  instagram
                </a>
                <a href="https://www.tiktok.com/@hanson_xu" target="_blank" rel="noreferrer">
                  tiktok
                </a>
              </nav>
            </div>

            <div className="footer__group">
              <h3 className="footer__subheader">old stuff</h3>
              <nav className="footer__links" aria-label="youtube">
                <a href={YOUTUBE_MUSIC} target="_blank" rel="noreferrer">
                  music
                </a>
                <a href={YOUTUBE_VLOGS} target="_blank" rel="noreferrer">
                  vlogs
                </a>
              </nav>
            </div>
          </div>
          <div className="footer__bar">
            <p className="footer__copyright">
              © {new Date().getFullYear()} hanson xu. all rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
