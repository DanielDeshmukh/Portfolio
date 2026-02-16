import React from "react";

export default function Contact({ profile }) {
  if (!profile) return null;

  const contact = profile.contact || {};
  const phone = "8552084251";

  return (
    <section
      id="contact"
      className="mt-16 scroll-mt-24 px-1 sm:px-0"
    >
      <div className="mb-6 flex items-center gap-3">
        <i className="fas fa-envelope text-primary text-lg sm:text-xl"></i>
        <h2 className="text-2xl sm:text-3xl font-heading text-white tracking-wide">
          Contact
        </h2>
      </div>

      <div
        className="
          card
          bg-secondary
          border border-accent/20
          rounded-xl
          p-4 sm:p-6
          flex
          flex-col
          gap-6
          md:flex-row
          md:items-center
          md:justify-between
          hover:border-primary
          transition-all duration-300
        "
      >
        <div className="flex flex-col gap-4 w-full md:w-auto">

          {contact.email && (
            <div className="flex items-start gap-3 group">
              <i className="fas fa-envelope text-accent mt-1 group-hover:text-primary transition-colors"></i>

              <div className="min-w-0">
                <div className="text-sm text-gray-400">
                  Email
                </div>

                <a
                  href={`mailto:${contact.email}`}
                  className="
                    text-accent
                    hover:text-primary
                    transition-colors
                    font-medium
                    break-all
                    text-sm sm:text-base
                  "
                >
                  {contact.email}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 group">
            <i className="fas fa-phone text-accent mt-1 group-hover:text-primary transition-colors"></i>

            <div>
              <div className="text-sm text-gray-400">
                Call / WhatsApp
              </div>

              <a
                href={`tel:${phone}`}
                className="
                  text-accent
                  hover:text-primary
                  transition-colors
                  font-medium
                  text-sm sm:text-base
                "
              >
                +91 {phone}
              </a>
            </div>
          </div>
        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-5
            text-lg sm:text-xl
            justify-start
            md:justify-end
            w-full
            md:w-auto
          "
        >
          {contact.github && (
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="
                text-accent
                hover:text-primary
                hover:scale-110
                transition-all duration-300
              "
            >
              <i className="fab fa-github"></i>
            </a>
          )}

          {contact.linkedin && (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="
                text-accent
                hover:text-primary
                hover:scale-110
                transition-all duration-300
              "
            >
              <i className="fab fa-linkedin"></i>
            </a>
          )}

          {contact.x && (
            <a
              href={contact.x}
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="
                text-accent
                hover:text-primary
                hover:scale-110
                transition-all duration-300
              "
            >
              <i className="fab fa-twitter"></i>
            </a>
          )}

          <a
            href={`tel:${phone}`}
            aria-label="Call"
            className="
              text-accent
              hover:text-primary
              hover:scale-110
              transition-all duration-300
            "
          >
            <i className="fas fa-phone"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
