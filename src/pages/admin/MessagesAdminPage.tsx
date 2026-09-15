import { Mail, MailOpen, Trash2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";
import type { MessageDTO } from "@shared/types";

export default function MessagesAdminPage() {
  usePageTitle("Messages");
  const { data: messages, loading, refetch } = useApiResource<MessageDTO[]>("/messages", [
    "messages",
  ]);

  async function markRead(message: MessageDTO) {
    if (message.read) return;
    await api.patch(`/messages/${message.id}/read`);
    refetch();
  }

  async function handleDelete(message: MessageDTO) {
    if (!confirm(`Delete message from ${message.name}?`)) return;
    await api.delete(`/messages/${message.id}`);
    refetch();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-[var(--color-text-muted)]">Inquiries submitted through your contact form.</p>
      </div>

      {loading ? (
        <FullPageSpinner />
      ) : (
        <div className="space-y-3">
          {messages?.map((message) => (
            <Card
              key={message.id}
              onClick={() => markRead(message)}
              className={cn(
                "cursor-pointer transition",
                !message.read && "border-[var(--color-accent)]"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {message.read ? (
                    <MailOpen size={18} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
                  ) : (
                    <Mail size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {message.subject}{" "}
                      <span className="font-normal text-[var(--color-text-muted)]">
                        from {message.name}
                      </span>
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">{message.email}</p>
                    <p className="mt-2 whitespace-pre-line text-sm">{message.message}</p>
                    <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(message);
                  }}
                  aria-label="Delete"
                  className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
          {messages?.length === 0 && (
            <p className="text-[var(--color-text-muted)]">No messages yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
