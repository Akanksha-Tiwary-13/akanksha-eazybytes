import type { SettingsDTO } from "@shared/types";

export function Footer({ settings }: { settings: SettingsDTO | null }) {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:justify-between sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} {settings?.siteTitle ?? "Portfolio"}. Built with the
          React + Node CMS.
        </p>
        <div className="flex items-center gap-4">
          {settings?.socialLinks?.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--color-text)]"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
