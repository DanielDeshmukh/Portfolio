import React, { useState, useEffect } from "react";

const iconMap = {
  "Node.js": "nodejs",
  "React": "react",
  "Supabase": "supabase",
  "TailwindCSS": "tailwindcss",
  "Python": "python",
  "PostgreSQL": "postgresql",
  "Next.js": "nextjs",
  "TypeScript": "typescript",
};

export default function Skills({ profile, adminMode, onSave }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills || []);
    }
  }, [profile]);

  function addSkill() {
    if (!newSkill.trim()) return;

    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill("");

    if (onSave) {
      onSave({ ...profile, skills: updatedSkills });
    }
  }

  function deleteSkill(index) {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);

    if (onSave) {
      onSave({ ...profile, skills: updatedSkills });
    }
  }

  return (
    <section id="skills" className="mt-12 scroll-mt-24">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-heading">
        Skills
      </h2>

      {/* Responsive Grid */}
      <div
        className="
          mt-6
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
        "
      >
        {skills.map((skill, index) => {
          const icon = iconMap[skill] || skill.toLowerCase();
          const src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`;

          return (
            <div
              key={skill + index}
              className="
                card
                flex
                items-center
                gap-4
                p-4
                rounded-lg
                bg-secondary
                hover:bg-secondary/80
                transition
              "
            >
              {/* Icon */}
              <img
                src={src}
                alt={skill}
                className="w-10 h-10 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* Skill Name */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">
                  {skill}
                </div>

                {adminMode && (
                  <div className="text-xs text-accent">
                    editable
                  </div>
                )}
              </div>

              {/* Delete Button */}
              {adminMode && (
                <button
                  onClick={() => deleteSkill(index)}
                  className="
                    text-red-400
                    hover:text-red-300
                    transition
                    flex-shrink-0
                  "
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin Add Skill */}
      {adminMode && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="New skill"
            className="
              px-4
              py-2
              bg-secondary
              rounded-md
              flex-1
              outline-none
              border border-transparent
              focus:border-primary
            "
          />

          <button
            onClick={addSkill}
            className="
              px-5
              py-2
              bg-primary
              text-black
              rounded-md
              hover:opacity-90
              transition
              whitespace-nowrap
            "
          >
            Add Skill
          </button>
        </div>
      )}
    </section>
  );
}
