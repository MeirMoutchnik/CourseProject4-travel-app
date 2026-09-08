export default function About() {
  return (
    <section className="about-page">
      <div className="about-card">
        <h1>About</h1>
        <p>This is my travel website.</p>
        <p>
          You can choose your preferred mode of transportation and destination.
        </p>
        <p>Lists of trains and flights available will be displayed.</p>
        <div className="about-links">
          <a
            className="about-link"
            href="https://github.com/MeirMoutchnik/CourseProject4-travel-app"
            target="_blank"
            rel="noreferrer"
          >
            View code on GitHub
          </a>
          <a
            className="about-link"
            href="https://meirtravelapp.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Live site on Vercel
          </a>
        </div>
      </div>
    </section>
  );
}
