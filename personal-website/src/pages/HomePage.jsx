import '../App.css'
import { SpotifyNowPlaying } from '../SpotifyNowPlaying'
import { WelcomeTyping } from '../WelcomeTyping'

const YOUTUBE_VLOGS = 'https://www.youtube.com/@hanson9305'
const YOUTUBE_MUSIC =
  'https://www.youtube.com/watch?v=BhO4zqprUDo&list=PL95xtCx6ID-oJ1tJjwUpH514o9hyLRed4&pp=sAgC'

export default function HomePage() {
  return (
    <div className="page">
      <nav className="side-menu" aria-label="Section navigation">
        <a href="#about">About me</a>
        <a href="#experiences">Experiences</a>
        <a href="#footer">Connect</a>
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
                <h2>About me</h2>
                <p>
                  I&apos;m a software engineer at PermitFlow, and I graduated
                  from Northwestern University with a B.S. in Computer Science
                  in 2026.
                </p>
                <p>My technologies:</p>
                <ul className="about__tech-list">
                  <li>Python</li>
                  <li>Java</li>
                  <li>C++</li>
                  <li>JavaScript</li>
                  <li>TypeScript</li>
                  <li>React</li>
                  <li>SQL</li>
                  <li>AWS</li>
                </ul>
              </div>
              <figure className="about__figure">
                <img
                  className="about__image"
                  src="/me-pic3.jpg"
                  alt="Portrait"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="section section--experiences" id="experiences">
          <div className="section__inner section__inner--about">
            <h2>Experiences</h2>
            <ul className="experience-list">
              <li className="experience-list__item">
                <h3>PermitFlow</h3>
                <p className="experience-list__meta">Starting September 2026</p>
                <p>
                  Software Engineer <br />
                  NYC
                </p>
              </li>
              <li className="experience-list__item">
                <h3>Amazon Web Services</h3>
                <p className="experience-list__meta">June 2025 - September 2025</p>
                <p>
                  Software Development Engineer Intern <br />
                  Seattle, WA
                </p>
              </li>
              <li className="experience-list__item">
                <h3>NetScout</h3>
                <p className="experience-list__meta">June 2024 - August 2024</p>
                <p>
                  Software Engineering Intern
                  <br />
                  Allen, TX
                </p>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="section section--footer" id="footer">
        <div className="section__inner section__inner--footer">
          <h2 className="footer__title">Connect</h2>
          <div className="footer__groups">
            <div className="footer__group">
              <h3 className="footer__subheader">Professional</h3>
              <nav className="footer__links" aria-label="Professional links">
                <a href="mailto:hhanxu1119@gmail.com">Email</a>
                <a href="https://github.com/HansonX" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/hansonxu/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </nav>
            </div>

            <div className="footer__group">
              <h3 className="footer__subheader">Social</h3>
              <nav className="footer__links" aria-label="Social links">
                <a href="https://www.instagram.com/_hansonx_/" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href="https://www.tiktok.com/@hanson_xu" target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </nav>
            </div>

            <div className="footer__group">
              <h3 className="footer__subheader footer__subheader--lowercase">OLD STUFF</h3>
              <nav className="footer__links" aria-label="YouTube">
                <a href={YOUTUBE_MUSIC} target="_blank" rel="noreferrer">
                  Music
                </a>
                <a href={YOUTUBE_VLOGS} target="_blank" rel="noreferrer">
                  Vlogs
                </a>
              </nav>
            </div>
          </div>
          <div className="footer__bar">
            <p className="footer__copyright">
              © {new Date().getFullYear()} Hanson Xu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
