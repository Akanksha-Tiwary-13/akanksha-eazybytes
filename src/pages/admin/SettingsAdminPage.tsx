import { useLayoutEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSettings } from "@/hooks/useSettings";
import { api } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { FullPageSpinner } from "@/components/ui/Spinner";

const settingsFormSchema = z.object({
  siteTitle: z.string().min(1, "Required"),
  tagline: z.string().min(1, "Required"),
  aboutText: z.string().min(1, "Required"),
  avatarUrl: z.string().url().or(z.literal("")),
  resumeUrl: z.string().url().or(z.literal("")),
  email: z.string().email().or(z.literal("")),
  location: z.string(),
  socialLinks: z.array(z.object({ platform: z.string().min(1), url: z.string().url() })),
  themeMode: z.enum(["light", "dark"]),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #6366f1"),
});

type SettingsForm = z.infer<typeof settingsFormSchema>;

export default function SettingsAdminPage() {
  usePageTitle("Site Settings");
  const { settings, loading, refetch } = useSettings();
  const applyAccent = useThemeStore((s) => s.setAccentColor);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsForm>({ resolver: zodResolver(settingsFormSchema) });

  const { fields, append, remove } = useFieldArray({ control, name: "socialLinks" });

  useLayoutEffect(() => {
    if (settings) {
      reset({
        siteTitle: settings.siteTitle,
        tagline: settings.tagline,
        aboutText: settings.aboutText,
        avatarUrl: settings.avatarUrl ?? "",
        resumeUrl: settings.resumeUrl ?? "",
        email: settings.email,
        location: settings.location ?? "",
        socialLinks: settings.socialLinks,
        themeMode: settings.theme.mode,
        accentColor: settings.theme.accentColor,
      });
    }
  }, [settings]);

  const accentColor = watch("accentColor");

  async function onSubmit(values: SettingsForm) {
    const { themeMode, accentColor, ...rest } = values;
    await api.put("/settings", {
      ...rest,
      theme: { mode: themeMode, accentColor },
    });
    applyAccent(accentColor);
    await refetch();
  }

  if (loading || !settings) return <FullPageSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-[var(--color-text-muted)]">
          Controls what visitors see across the whole site, including the default theme.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="space-y-4">
          <h2 className="font-semibold">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="siteTitle">Site title / your name</Label>
              <Input id="siteTitle" {...register("siteTitle")} />
              {errors.siteTitle && <p className="mt-1 text-xs text-red-500">{errors.siteTitle.message}</p>}
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" {...register("tagline")} />
              {errors.tagline && <p className="mt-1 text-xs text-red-500">{errors.tagline.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="aboutText">About</Label>
            <Textarea id="aboutText" rows={5} {...register("aboutText")} />
            {errors.aboutText && <p className="mt-1 text-xs text-red-500">{errors.aboutText.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input id="avatarUrl" {...register("avatarUrl")} />
              {errors.avatarUrl && <p className="mt-1 text-xs text-red-500">Must be a valid URL</p>}
            </div>
            <div>
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input id="resumeUrl" {...register("resumeUrl")} />
              {errors.resumeUrl && <p className="mt-1 text-xs text-red-500">Must be a valid URL</p>}
            </div>
            <div>
              <Label htmlFor="email">Contact email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-red-500">Must be a valid email</p>}
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Social links</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ platform: "", url: "" })}
              className="inline-flex items-center gap-1"
            >
              <Plus size={14} /> Add link
            </Button>
          </div>
          {fields.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)]">No social links added yet.</p>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-3">
              <div className="w-32">
                <Label htmlFor={`socialLinks.${index}.platform`}>Platform</Label>
                <Input
                  id={`socialLinks.${index}.platform`}
                  {...register(`socialLinks.${index}.platform` as const)}
                  placeholder="GitHub"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`socialLinks.${index}.url`}>URL</Label>
                <Input
                  id={`socialLinks.${index}.url`}
                  {...register(`socialLinks.${index}.url` as const)}
                  placeholder="https://..."
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove link"
                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold">Theme</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Sets the default appearance for new visitors. Visitors can still toggle light/dark for
            themselves.
          </p>
          <div className="flex flex-wrap items-end gap-6">
            <div>
              <Label htmlFor="themeMode">Default mode</Label>
              <select
                id="themeMode"
                {...register("themeMode")}
                className="accent-ring rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <Label htmlFor="accentColor">Accent color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) =>
                    setValue("accentColor", e.target.value, { shouldDirty: true, shouldValidate: true })
                  }
                  className="h-9 w-9 cursor-pointer rounded border border-[var(--color-border)]"
                />
                <Input id="accentColor" className="w-32" {...register("accentColor")} />
              </div>
              {errors.accentColor && (
                <p className="mt-1 text-xs text-red-500">{errors.accentColor.message}</p>
              )}
            </div>
          </div>
        </Card>

        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Saving..." : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
