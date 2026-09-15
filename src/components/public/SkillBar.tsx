import { motion } from "framer-motion";
import type { SkillDTO } from "@shared/types";

export function SkillBar({ skill }: { skill: SkillDTO }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className="text-[var(--color-text-muted)]">{skill.level}/5</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(skill.level / 5) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-[var(--color-accent)]"
        />
      </div>
    </div>
  );
}
