import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import jobsImage from "@/assets/echoes-symbolic-jobs.jpg";

const SteveJobsPage = () => {
  return (
    <>
      <Helmet>
        <title>Steve Jobs — The Architect of Human-Centered Innovation | ECHOES</title>
        <meta name="description" content="Discover how Steve Jobs revolutionized technology by merging art, science, and humanity — transforming the way the world experiences innovation." />
        <link rel="canonical" href="https://teenmentorshipacademy.com/voices/echoes/steve-jobs" />
      </Helmet>

      <article className="min-h-screen bg-[#1C2B3A]">
        {/* Hero Section */}
        <section className="relative bg-[#1C2B3A] text-[#F6F6F6] py-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Label */}
            <div className="mb-8">
              <span className="inline-block text-sm uppercase tracking-[0.2em] text-[#F6F6F6]/70 font-light">
                🕊️ ECHOES — The Messengers of Management
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
              Steve Jobs
            </h1>
            <p className="text-xl md:text-2xl text-[#F6F6F6]/80 font-light mb-12">
              The Architect of Human-Centered Innovation
            </p>

            {/* Symbolic Image */}
            <figure className="mb-8">
              <img 
                src={jobsImage} 
                alt="A glowing circuit symbolizing the union of creativity and technology" 
                className="w-full rounded-lg shadow-2xl"
              />
              <figcaption className="text-sm text-[#F6F6F6]/60 mt-4 italic text-center">
                A single glowing light emerging from within a sleek, minimal circuit — symbolizing the union of human creativity and digital intelligence.
              </figcaption>
            </figure>

            {/* Quote Block */}
            <blockquote className="border-l-4 border-[#D7261D] pl-6 py-2 my-8">
              <p className="text-lg md:text-xl italic text-[#F6F6F6]/90 leading-relaxed mb-2">
                "Technology alone is not enough. It's technology married with the liberal arts, married with the humanities, that yields the results that make our hearts sing."
              </p>
              <footer className="text-sm text-[#F6F6F6]/70 mt-2">
                — Steve Jobs (1955 – 2011)
              </footer>
            </blockquote>
          </div>
        </section>

        {/* Content Sections */}
        <div className="bg-white text-gray-900">
          {/* Snapshot */}
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-light mb-6 pb-3 border-b-2 border-gray-200">
                Snapshot
              </h2>
              <p className="text-lg leading-relaxed mb-4">
                Steve Jobs was an American entrepreneur, inventor, and visionary whose pursuit of perfection transformed the way the world experiences technology. As co-founder of Apple Inc., he revolutionized personal computing, music, animation, and mobile communication by infusing soul into technology — insisting that design should not just look good but feel right.
              </p>
              <p className="text-lg leading-relaxed">
                Born in 1955 in San Francisco, Jobs dropped out of college but never abandoned learning. His curiosity for design, calligraphy, and Zen philosophy later shaped the simplicity and clarity that became Apple's identity.
              </p>
            </div>
          </section>

          {/* Major Works & Signature Ideas */}
          <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-light mb-6 pb-3 border-b-2 border-gray-200">
                Major Works & Signature Ideas
              </h2>
              <ul className="space-y-6 text-lg leading-relaxed">
                <li>
                  <strong className="text-[#D7261D]">User-Centered Design:</strong> Jobs believed that innovation starts with empathy — understanding the user's heart and mind before building the product.
                </li>
                <li>
                  <strong className="text-[#D7261D]">Interdisciplinary Thinking:</strong> He merged art, science, and business — proving creativity and technology thrive together.
                </li>
                <li>
                  <strong className="text-[#D7261D]">Pursuit of Excellence:</strong> His famous mantra, "Stay Hungry, Stay Foolish," inspired generations to remain curious and fearless.
                </li>
                <li>
                  <strong className="text-[#D7261D]">The Reality Distortion Field:</strong> A term coined by his colleagues to describe how his conviction and storytelling could make the impossible seem achievable — a testament to the power of vision in leadership.
                </li>
              </ul>
            </div>
          </section>

          {/* Selected Quotes */}
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-light mb-8 pb-3 border-b-2 border-gray-200">
                Selected Quotes
              </h2>
              <div className="space-y-6">
                <blockquote className="border-l-4 border-[#D7261D] pl-6 py-2">
                  <p className="text-lg italic text-gray-700">
                    "Innovation distinguishes between a leader and a follower."
                  </p>
                </blockquote>
                <blockquote className="border-l-4 border-[#D7261D] pl-6 py-2">
                  <p className="text-lg italic text-gray-700">
                    "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work."
                  </p>
                </blockquote>
                <blockquote className="border-l-4 border-[#D7261D] pl-6 py-2">
                  <p className="text-lg italic text-gray-700">
                    "The people who are crazy enough to think they can change the world are the ones who do."
                  </p>
                </blockquote>
                <blockquote className="border-l-4 border-[#D7261D] pl-6 py-2">
                  <p className="text-lg italic text-gray-700">
                    "Design is not just what it looks like and feels like. Design is how it works."
                  </p>
                </blockquote>
              </div>
            </div>
          </section>

          {/* Honours & Recognition */}
          <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-light mb-6 pb-3 border-b-2 border-gray-200">
                Honours & Recognition
              </h2>
              <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
                <li>Co-founder, Apple Inc., Pixar Animation Studios, and NeXT Inc.</li>
                <li>Named among Time's 100 Most Influential People of the Century</li>
                <li>Recipient of National Medal of Technology (posthumous 2012)</li>
                <li>His legacy continues to influence digital design, entrepreneurship, and leadership education worldwide.</li>
              </ul>
            </div>
          </section>

          {/* Closing Reflection */}
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-light mb-6 pb-3 border-b-2 border-gray-200">
                Closing Reflection
              </h2>
              <p className="text-lg leading-relaxed mb-6">
                Steve Jobs reminded the world that technology is at its best when it amplifies human potential. Through ECHOES, his message to future leaders is timeless: lead innovation not through complexity, but through clarity — where design meets purpose, and intelligence serves humanity.
              </p>
              <p className="text-center text-gray-600 italic mt-8">
                Curated by Dr. Iraj Sardari Baf
              </p>
            </div>
          </section>

          {/* Footer Navigation */}
          <footer className="py-12 px-6 bg-gray-100 border-t border-gray-200">
            <div className="max-w-4xl mx-auto text-center">
              <Link 
                to="/voices/echoes" 
                className="inline-flex items-center gap-2 text-[#D7261D] hover:text-[#B91C1C] transition-colors"
              >
                <span>←</span>
                <span>Back to ECHOES Collection</span>
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
};

export default SteveJobsPage;
