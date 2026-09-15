import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { BlogPostDTO } from "@shared/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function BlogCard({ post, index = 0 }: { post: BlogPostDTO; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="flex h-full flex-col gap-3">
        <Link to={`/blog/${post.slug}`} className="text-lg font-semibold hover:text-[var(--color-accent)]">
          {post.title}
        </Link>
        <p className="text-sm text-[var(--color-text-muted)]">{post.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-[var(--color-text-muted)]">
          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
