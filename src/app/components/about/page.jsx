"use client";

export default function About() {
  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Ideas Shared", value: "50K+" },
    { label: "Community Members", value: "5K+" },
    { label: "Countries", value: "120+" },
  ];

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Capture Ideas",
      description: "Never let a great idea slip away. Capture thoughts instantly and organize them effortlessly.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
      title: "Organize & Curate",
      description: "Categorize, tag, and refine your ideas. Build a personal knowledge base that grows with you.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      title: "Share & Collaborate",
      description: "Share your ideas with the community, get feedback, and collaborate with like-minded thinkers.",
    },
  ];

  return (
    <>
      <section className="about-section">
        <div className="about-inner">
          <div className="about-header">
            <div className="about-accent-line" />
            <h2 className="about-heading">
              About <span>IdeaVault</span>
            </h2>
            <p className="about-subtitle">
              We believe every great innovation starts with a single idea. 
              Our mission is to provide a space where ideas are captured, 
              nurtured, and transformed into reality.
            </p>
          </div>

          <div className="about-story">
            <div className="about-story-text">
              <p>
                IdeaVault was born from a simple observation: brilliant ideas 
                are often lost because there's no dedicated space to capture 
                and develop them. We set out to change that.
              </p>
              <p>
                What started as a personal project quickly grew into a vibrant 
                community of thinkers, creators, and innovators. Today, 
                IdeaVault serves thousands of users worldwide, helping them 
                organize their thoughts, collaborate with others, and turn 
                inspiration into action.
              </p>
              <p>
                Whether you're an entrepreneur brainstorming your next 
                venture, a writer developing a story, or simply someone who 
                loves to explore new ideas &mdash; IdeaVault is your home.
              </p>
            </div>
            <div className="about-story-visual">
              <div className="about-quote">
                &ldquo;The best way to have a good idea is to have a lot of ideas.&rdquo;
              </div>
              <div className="about-quote-attribution">
                &mdash; Linus Pauling
              </div>
            </div>
          </div>

          <div className="about-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="about-stat">
                <div className="about-stat-value">{stat.value}</div>
                <div className="about-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="about-features">
            {features.map((feature) => (
              <div key={feature.title} className="about-feature-card">
                <div className="about-feature-icon">{feature.icon}</div>
                <div className="about-feature-title">{feature.title}</div>
                <div className="about-feature-desc">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
