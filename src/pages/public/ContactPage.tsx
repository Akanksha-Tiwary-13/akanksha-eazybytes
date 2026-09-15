import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePublicContext } from "@/components/layout/PublicLayout";
import { api } from "@/lib/api";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(160),
  message: z.string().min(5, "Message is a little short").max(5000),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  usePageTitle("Contact");
  const { settings } = usePublicContext();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactForm) {
    setSubmitError(null);
    try {
      await api.post("/messages", values);
      setSubmitted(true);
      reset();
    } catch {
      setSubmitError("Couldn't send your message. Please try again in a moment.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold">Get in touch</h1>
      <p className="mb-10 text-[var(--color-text-muted)]">
        Have a project in mind or just want to say hi? Send a message below.
      </p>

      <div className="mb-10 flex flex-wrap gap-6 text-sm text-[var(--color-text-muted)]">
        {settings?.email && (
          <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 hover:text-[var(--color-text)]">
            <Mail size={16} /> {settings.email}
          </a>
        )}
        {settings?.location && (
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} /> {settings.location}
          </span>
        )}
      </div>

      {submitted ? (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--color-accent)]" size={20} />
          <div>
            <p className="font-medium">Message sent!</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Thanks for reaching out — I'll get back to you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 text-sm font-medium text-[var(--color-accent)]"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} placeholder="Jane Doe" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="jane@example.com" />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register("subject")} placeholder="Let's build something" />
            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={6} {...register("message")} placeholder="Tell me a bit about your project..." />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
          </div>
          {submitError && <p className="text-sm text-red-500">{submitError}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}
