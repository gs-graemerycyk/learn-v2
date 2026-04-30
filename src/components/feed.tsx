"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Share2,
  Bookmark,
  Heart,
  ArrowRight,
} from "lucide-react";

type ThreadComment = {
  text: string;
  author: string;
  avatar: string;
  time: string;
};

type EmojiReaction = {
  emoji: string;
  label: string;
  count: number;
};

type Post = {
  id: number;
  author: string;
  avatar: string;
  initials: string;
  role: string;
  time: string;
  title: string;
  excerpt: string;
  likes: number;
  replies: number;
  shares: number;
  liked: boolean;
  tags: string[];
  reactions: EmojiReaction[];
  threadComments: ThreadComment[];
};

const posts: Post[] = [
  {
    id: 1,
    author: "Elena Kowalski",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
    initials: "EK",
    role: "Champion",
    time: "2h ago",
    title:
      "How we replaced 6 tools with one Orbit workspace — our migration playbook",
    excerpt:
      "We moved our product specs, sprint boards, and knowledge base into Orbit in 3 weeks. Sharing the template structure, permission setup, and what we'd do differently.",
    likes: 214,
    replies: 47,
    shares: 18,
    liked: true,
    tags: ["Insight", "Migration"],
    reactions: [
      { emoji: "🔥", label: "Fire", count: 34 },
      { emoji: "👍", label: "Helpful", count: 89 },
      { emoji: "👀", label: "Watching", count: 12 },
    ],
    threadComments: [
      { text: "This saved us weeks of planning. The permission template alone was worth it.", author: "Marcus Rivera", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", time: "1h ago" },
      { text: "How did you handle migrating existing Notion databases? That's our biggest blocker.", author: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face", time: "45m ago" },
      { text: "We did the same migration last quarter — happy to share our CSV import scripts.", author: "David Park", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face", time: "30m ago" },
    ],
  },
  {
    id: 2,
    author: "James Okafor",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    initials: "JO",
    role: "Expert",
    time: "4h ago",
    title:
      "Building a real-time project tracker with linked databases and rollups",
    excerpt:
      "I connected our roadmap, sprint backlog, and bug tracker using relational databases in Orbit. Here's the schema and the formulas that made it click.",
    likes: 156,
    replies: 31,
    shares: 9,
    liked: false,
    tags: ["Workaround", "Databases"],
    reactions: [
      { emoji: "❤️", label: "Love", count: 41 },
      { emoji: "👍", label: "Helpful", count: 67 },
    ],
    threadComments: [
      { text: "The rollup formula for sprint velocity is exactly what I needed. Works flawlessly.", author: "Anna Torres", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face", time: "2h ago" },
      { text: "Can you share how you handle cross-board relations? We hit a 1000 row limit.", author: "Leo Müller", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face", time: "1h ago" },
      { text: "Added this to our team's onboarding docs. Best walkthrough I've seen.", author: "Rachel Nguyen", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face", time: "50m ago" },
    ],
  },
  {
    id: 3,
    author: "Priya Sharma",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    initials: "PS",
    role: "Pioneer",
    time: "6h ago",
    title: "Should Orbit add native Gantt charts? Here's my case for it",
    excerpt:
      "I've been using timeline view as a workaround, but a dedicated Gantt view with dependencies and critical path would be a game-changer for project managers.",
    likes: 342,
    replies: 89,
    shares: 24,
    liked: false,
    tags: ["Product Idea", "Project Management"],
    reactions: [
      { emoji: "💡", label: "Great idea", count: 128 },
      { emoji: "👍", label: "Agree", count: 94 },
      { emoji: "🔥", label: "Fire", count: 56 },
    ],
    threadComments: [
      { text: "Timeline view is close, but dependencies are the missing piece. Fully support this.", author: "James Okafor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", time: "4h ago" },
      { text: "We switched to Orbit from Monday.com specifically for this — still waiting on Gantt.", author: "Nina Petrov", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face", time: "3h ago" },
      { text: "Critical path visualization would make Orbit the only PM tool our team needs.", author: "Tom Hashimoto", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&crop=face", time: "2h ago" },
    ],
  },
  {
    id: 4,
    author: "Thomas Lindgren",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    initials: "TL",
    role: "Advocate",
    time: "8h ago",
    title:
      "Advanced automation recipes: Slack notifications, status syncing, and auto-archiving",
    excerpt:
      "A collection of 12 automation workflows I've built for our 200-person org. From auto-assigning tasks to syncing statuses across boards — all native, no Zapier needed.",
    likes: 198,
    replies: 53,
    shares: 15,
    liked: true,
    tags: ["Trending", "Automation"],
    reactions: [
      { emoji: "🔥", label: "Fire", count: 73 },
      { emoji: "❤️", label: "Love", count: 45 },
      { emoji: "👀", label: "Watching", count: 29 },
    ],
    threadComments: [
      { text: "Recipe #7 (auto-archive after 30 days) saved us from database bloat. Game changer.", author: "Elena Kowalski", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face", time: "5h ago" },
      { text: "Any way to chain automations? I want status change → Slack ping → auto-assign.", author: "Chris Yang", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", time: "4h ago" },
      { text: "Built on top of recipe #3 — added a condition for priority levels. Works great.", author: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", time: "3h ago" },
    ],
  },
  {
    id: 5,
    author: "Mei Chen",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=face",
    initials: "MC",
    role: "Contributor",
    time: "10h ago",
    title:
      "How do you handle 10k+ row databases without performance issues?",
    excerpt:
      "Our team wiki has grown to 12,000 pages and queries are getting slow. Has anyone found good patterns for archiving or splitting large databases in Orbit?",
    likes: 87,
    replies: 24,
    shares: 6,
    liked: false,
    tags: ["Question", "Performance"],
    reactions: [
      { emoji: "👍", label: "Same question", count: 31 },
      { emoji: "👀", label: "Following", count: 18 },
    ],
    threadComments: [
      { text: "We split into quarterly archives once we hit 5k rows. Performance went back to normal.", author: "Thomas Lindgren", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", time: "8h ago" },
      { text: "Try filtering with indexed properties — it cut our query time by 80%.", author: "Marcus Rivera", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", time: "6h ago" },
      { text: "Orbit team said they're working on lazy loading for large DBs. Should land next month.", author: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face", time: "5h ago" },
    ],
  },
];

/* ── Reaction picker emojis ── */
const reactionOptions = [
  { emoji: "❤️", label: "Love" },
  { emoji: "👍", label: "Helpful" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "💡", label: "Great idea" },
  { emoji: "👀", label: "Watching" },
  { emoji: "🎉", label: "Celebrate" },
];

/* ── Rotating thread comment hook — same pattern as modal's useRotatingQuote ── */

function useRotatingComment(comments: ThreadComment[], intervalMs = 8000) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (comments.length <= 1) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % comments.length);
        setVisible(true);
      }, 400);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [comments.length, intervalMs]);

  return { comment: comments[index], visible, index };
}

/* ── Thread preview — nested comment box with rotating animation ── */

function ThreadPreview({ comments }: { comments: ThreadComment[] }) {
  const { comment, visible, index } = useRotatingComment(comments);

  if (!comments.length) return null;

  return (
    <div className="mt-5 rounded-[14px] bg-black/[0.015] overflow-hidden">
      <div className="px-5 py-4">
        <div className="overflow-hidden relative">
          <div
            className="transition-all duration-[400ms] ease-in-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(4px)" }}
          >
            <p className="text-[14px] leading-relaxed text-black/50 line-clamp-1">
              {comment.text}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <img src={comment.avatar} alt="" className="h-[14px] w-[14px] rounded-full object-cover ring-1 ring-black/[0.04] shrink-0" />
              <span className="text-[13px] font-medium text-black/35">{comment.author}</span>
              <span className="text-[13px] text-black/20">·</span>
              <span className="text-[13px] text-black/25">{comment.time}</span>
            </div>
          </div>
          {/* Shimmer during transition */}
          {!visible && (
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.015) 40%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.015) 60%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "threadShimmer 0.8s ease-in-out",
              }}
            />
          )}
        </div>
      </div>
      {/* Progress bar — edge to edge, resets on comment change */}
      <div className="h-[2px] w-full bg-transparent">
        <div
          key={index}
          className="h-full bg-[#EDEDEE]"
          style={{ animation: "threadProgress 8s linear forwards" }}
        />
      </div>
    </div>
  );
}

/* ── Collected emoji bubbles ── */
function ReactionBubbles({ reactions }: { reactions: EmojiReaction[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (reactions.length === 0) return null;

  return (
    <div className="relative flex items-center">
      {reactions.map((r, i) => (
        <div
          key={r.emoji}
          className="relative"
          style={{ marginLeft: i > 0 ? "-6px" : 0, zIndex: reactions.length - i }}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.04] border-2 border-white text-[13px] cursor-default transition-transform hover:scale-110">
            <span style={{ filter: "none", opacity: 1 }}>{r.emoji}</span>
          </div>
          {/* Tooltip */}
          {hoveredIdx === i && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background shadow-lg z-20">
              {r.label} · {r.count}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Post card ── */
function PostCard({ post }: { post: Post }) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(post.liked ? "❤️" : null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLikeEnter = () => {
    if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
    pickerTimeout.current = setTimeout(() => setShowPicker(true), 400);
  };

  const handleLikeLeave = () => {
    if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
    pickerTimeout.current = setTimeout(() => setShowPicker(false), 300);
  };

  const handleLikeClick = () => {
    if (liked) {
      setLiked(false);
      setSelectedEmoji(null);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setSelectedEmoji("❤️");
      setLikeCount((c) => c + 1);
    }
  };

  const handleReactionSelect = (emoji: string) => {
    if (selectedEmoji === emoji) {
      // Deselect
      setLiked(false);
      setSelectedEmoji(null);
      setLikeCount((c) => c - 1);
    } else {
      if (!liked) setLikeCount((c) => c + 1);
      setLiked(true);
      setSelectedEmoji(emoji);
    }
    setShowPicker(false);
  };

  return (
    <article className="group rounded-[20px] border border-black/[0.06] bg-white px-7 py-6 transition-all duration-200 hover:border-black/[0.10] hover:shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)]">
      {/* Top row — avatar + author left, time right */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <Avatar className="h-10 w-10 shrink-0 ring-1 ring-black/[0.04]">
            <AvatarImage src={post.avatar} />
            <AvatarFallback className="text-xs">
              {post.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="text-[15px] font-semibold text-foreground">{post.author}</span>
            <div className="text-[14px] text-black/40 -mt-0.5">
              {post.role}
            </div>
          </div>
        </div>
        <span className="text-[14px] text-black/35 pt-0.5 shrink-0">{post.time}</span>
      </div>

      {/* Title */}
      <h3 className="mt-7 text-[20px] font-semibold leading-snug tracking-[-0.01em] text-foreground cursor-pointer transition-colors group-hover:text-black/75 line-clamp-1">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="mt-1.5 text-[16px] leading-relaxed text-black/50 line-clamp-2">
        {post.excerpt}
      </p>

      {/* Thread preview — rotating comments */}
      {post.threadComments.length > 0 && (
        <ThreadPreview comments={post.threadComments} />
      )}

      {/* ── Action bar ── */}
      <div className="mt-4 flex items-center justify-between">
        {/* Left — actions */}
        <div className="flex items-center gap-1">
          {/* Heart / Like — with reaction picker on hover */}
          <div
            className="relative"
            onMouseEnter={handleLikeEnter}
            onMouseLeave={handleLikeLeave}
          >
            <button
              aria-label={liked ? "Unlike" : "Like"}
              aria-pressed={liked}
              onClick={handleLikeClick}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[14px] font-medium transition-all duration-150",
                liked
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-black/35 hover:text-black/55 hover:bg-black/[0.03]"
              )}
            >
              {liked && selectedEmoji && selectedEmoji !== "❤️" ? (
                <span className="text-[15px] leading-none h-[16px] flex items-center" style={{ filter: "none", opacity: 1 }}>{selectedEmoji}</span>
              ) : (
                <Heart
                  className={cn("h-[16px] w-[16px]", liked && "fill-current")}
                  strokeWidth={1.75}
                />
              )}
              <span>{likeCount}</span>
            </button>

            {/* Reaction picker popup */}
            {showPicker && (
              <div
                className="absolute bottom-full left-0 mb-2 flex items-center gap-1 rounded-xl bg-white border border-black/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] px-2 py-1.5 z-20"
                onMouseEnter={() => {
                  if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
                }}
                onMouseLeave={handleLikeLeave}
              >
                {reactionOptions.map((r) => (
                  <button
                    key={r.emoji}
                    aria-label={r.label}
                    onClick={() => handleReactionSelect(r.emoji)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-[18px] transition-transform duration-150 hover:scale-125 hover:bg-black/[0.04]",
                      selectedEmoji === r.emoji && "bg-black/[0.06] scale-110"
                    )}
                  >
                    <span style={{ filter: "none", opacity: 1 }}>{r.emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comment */}
          <button
            aria-label={`${post.replies} comments`}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[14px] font-medium text-black/35 transition-all duration-150 hover:text-black/55 hover:bg-black/[0.03]"
          >
            <MessageSquare className="h-[16px] w-[16px]" strokeWidth={1.75} />
            <span>{post.replies}</span>
          </button>

          {/* Share */}
          <button
            aria-label={`${post.shares} shares`}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[14px] font-medium text-black/35 transition-all duration-150 hover:text-black/55 hover:bg-black/[0.03]"
          >
            <Share2 className="h-[16px] w-[16px]" strokeWidth={1.75} />
            <span>{post.shares}</span>
          </button>

          {/* Bookmark */}
          <button
            aria-label={saved ? "Remove bookmark" : "Bookmark"}
            aria-pressed={saved}
            onClick={() => setSaved(!saved)}
            className={cn(
              "flex items-center justify-center rounded-lg px-2 py-1.5 transition-all duration-150",
              saved
                ? "text-foreground"
                : "text-black/35 hover:text-black/55 hover:bg-black/[0.03]"
            )}
          >
            <Bookmark
              className={cn("h-[16px] w-[16px]", saved && "fill-current")}
              strokeWidth={1.75}
            />
          </button>
        </div>

        {/* Right — collected emoji reactions */}
        <ReactionBubbles reactions={post.reactions} />
      </div>
    </article>
  );
}

export function Feed() {
  return (
    <section className="w-full" aria-labelledby="feed-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="feed-heading" className="text-[24px] font-semibold tracking-tight text-foreground">
          Community Pulse
        </h2>
        <button className="flex items-center gap-1 text-[14px] font-medium text-black/50 transition-colors hover:text-black/70">
          View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Thread comment shimmer animation */}
      <style>{`
        @keyframes threadShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes threadProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
