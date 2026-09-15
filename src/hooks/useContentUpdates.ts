import { useEffect } from "react";
import { socket } from "@/lib/socket";

type ContentTopic = "projects" | "skills" | "blog" | "settings" | "messages";

export function useContentUpdates(topics: ContentTopic[], onUpdate: () => void) {
  useEffect(() => {
    function handleUpdate(payload: { topic: ContentTopic }) {
      if (topics.includes(payload.topic)) {
        onUpdate();
      }
    }

    socket.on("content:updated", handleUpdate);
    return () => {
      socket.off("content:updated", handleUpdate);
    };
  }, [topics.join(","), onUpdate]);
}
