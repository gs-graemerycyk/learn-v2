"use client";

import { ArrowRight, Play, Clock, BookOpen } from "lucide-react";

const inProgress = [
  {
    id: 1,
    title: "Relational Databases Deep Dive",
    description: "Master relations, rollups, and advanced formulas to build connected workspaces.",
    progress: 65,
    lessons: "8/12 lessons",
    duration: "~25 min left",
    image: "/assets/pawel-czerwinski-MpwnazDHBw0-unsplash.jpg",
  },
  {
    id: 2,
    title: "Automation Workflows 101",
    description: "Learn to automate repetitive tasks with triggers, actions, and conditional logic.",
    progress: 30,
    lessons: "3/10 lessons",
    duration: "~45 min left",
    image: "/assets/pawel-czerwinski-QM6sJUVoGgI-unsplash.jpg",
  },
];

const trending = [
  {
    id: 3,
    title: "From Spreadsheets to Orbit",
    description: "Migrate your existing data and workflows into a structured, scalable workspace.",
    author: "Orbit Academy",
    students: "4.2k",
    duration: "1h 20min",
    image: "/assets/yue-ma-Ml1FGGnGtn8-unsplash.jpg",
  },
  {
    id: 4,
    title: "Building a Company Wiki",
    description: "Create a searchable knowledge base with nested pages, templates, and permissions.",
    author: "Orbit Academy",
    students: "3.8k",
    duration: "55min",
    image: "/assets/yue-ma-bp2TuVlTydc-unsplash.jpg",
  },
];

export function CoursesWidget() {
  return (
    <section aria-labelledby="courses-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="courses-heading" className="text-[24px] font-semibold tracking-tight text-foreground">
          Courses
        </h2>
        <button className="flex items-center gap-1 text-[14px] font-medium text-black/50 transition-colors hover:text-black/70">
          Browse all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      {/* In progress — card layout matching trending */}
      <div className="flex flex-col gap-3 mb-6">
        <span className="text-[12px] font-medium text-black/50 uppercase tracking-wider">
          Continue learning
        </span>
        <div className="grid grid-cols-2 gap-4">
          {inProgress.map((course) => (
            <article
              key={course.id}
              className="group cursor-pointer rounded-[20px] border border-black/[0.06] bg-white overflow-hidden transition-all duration-200 hover:border-black/[0.10] hover:shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={course.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform duration-200 group-hover:scale-110">
                    <Play className="h-4 w-4 fill-foreground text-foreground ml-0.5" strokeWidth={0} aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[14px] text-black/50">{course.lessons}</span>
                  <span className="text-black/20" aria-hidden="true">·</span>
                  <span className="text-[14px] text-black/50">{course.duration}</span>
                </div>
                <h3 className="text-[20px] font-semibold text-foreground leading-snug tracking-[-0.01em] truncate">
                  {course.title}
                </h3>
                <p className="mt-2 text-[16px] leading-relaxed text-black/50 line-clamp-2">
                  {course.description}
                </p>
                {/* Progress bar */}
                <div className="mt-5">
                  <div
                    className="h-1.5 rounded-full bg-black/[0.06]"
                    role="progressbar"
                    aria-valuenow={course.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${course.title} progress`}
                  >
                    <div
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-black/45 mt-1.5 block text-right">
                    {course.progress}%
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Trending — 2 columns */}
      <span className="text-[12px] font-medium text-black/50 uppercase tracking-wider block mb-3">
        Trending
      </span>
      <div className="grid grid-cols-2 gap-4">
        {trending.map((course) => (
          <article
            key={course.id}
            className="group cursor-pointer rounded-[20px] border border-black/[0.06] bg-white overflow-hidden transition-all duration-200 hover:border-black/[0.10] hover:shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)]"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={course.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-3.5 w-3.5 text-black/45" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-[14px] text-black/50">{course.duration}</span>
              </div>
              <h3 className="text-[20px] font-semibold text-foreground leading-snug tracking-[-0.01em] truncate">
                {course.title}
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-black/50 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <BookOpen className="h-3.5 w-3.5 text-black/45" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-[14px] text-black/50">
                  {course.students} students
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
