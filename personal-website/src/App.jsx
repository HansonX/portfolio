import './App.css'

function App() {
  return (
    <div className="page">
      <nav className="side-menu" aria-label="Section navigation">
        <a href="#welcome">Welcome</a>
        <a href="#about">About me</a>
        <a href="#experiences">Experiences</a>
        <a href="#footer">Connect</a>
      </nav>

      <header className="section section--welcome" id="welcome">
        <div className="section__inner">
          <p className="eyebrow">Hello, I&apos;m</p>
          <h1 className="welcome__title">Hanson</h1>
        </div>
        <a className="welcome__scroll" href="#about" aria-label="Scroll to about me section">
          <span aria-hidden="true">⌄</span>
        </a>
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
                {/* Add your image at public/about-me.jpg (or change src below) */}
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
                <p>Software Engineering Intern
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
          </div>
          <p className="footer__copyright">
            © {new Date().getFullYear()} Hanson Xu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
