import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  X,
  GalleryHorizontalEnd,
  Mail,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
};

type Language = "en" | "zh";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({ language: "en", setLanguage: () => undefined });

function useLanguage() {
  return useContext(LanguageContext);
}

function localize(language: Language, english: string, chinese: string) {
  return language === "zh" ? chinese : english;
}

function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ContactButton() {
  const { language } = useLanguage();

  return (
    <a
      href="mailto:cwei64368@gmail.com"
      className="inline-flex items-center gap-2 rounded-full bg-[#1d1c18] px-8 py-3 text-xs font-medium uppercase tracking-widest text-white outline outline-2 -outline-offset-[3px] outline-white transition duration-200 hover:scale-[1.03] hover:bg-black sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        boxShadow:
          "0px 12px 28px rgba(29, 28, 24, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.22)",
      }}
    >
      {localize(language, "Contact Me", "联系我")}
      <Mail size={18} strokeWidth={1.8} />
    </a>
  );
}

function Magnet({
  children,
  padding = 150,
  strength = 3,
  maxOffset = 28,
  className,
}: {
  children: ReactNode;
  padding?: number;
  strength?: number;
  maxOffset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0, 0, 0)");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const within =
        event.clientX > rect.left - padding &&
        event.clientX < rect.right + padding &&
        event.clientY > rect.top - padding &&
        event.clientY < rect.bottom + padding;

      if (!within) {
        setActive(false);
        setTransform("translate3d(0, 0, 0)");
        return;
      }

      const rawX = (event.clientX - (rect.left + rect.width / 2)) / strength;
      const rawY = (event.clientY - (rect.top + rect.height / 2)) / strength;
      const x = Math.max(-maxOffset, Math.min(maxOffset, rawX));
      const y = Math.max(-maxOffset, Math.min(maxOffset, rawY));
      setActive(true);
      setTransform(`translate3d(${x}px, ${y}px, 0)`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [maxOffset, padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        transition: active
          ? "transform 0.3s ease-out"
          : "transform 0.6s ease-in-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

function AnimatedText({
  text,
  className = "text-mist",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "center center"],
  });

  return (
    <p
      ref={ref}
      className={`max-w-[760px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed ${className}`}
    >
      {text.split(" ").map((word, index, words) => {
        const start = (index / words.length) * 0.55;
        const end = Math.min(0.72, start + 0.08);
        return (
          <AnimatedWord
            key={`${word}-${index}`}
            word={word}
            progress={scrollYProgress}
            start={start}
            end={end}
            trailingSpace={index < words.length - 1}
          />
        );
      })}
    </p>
  );
}

function AnimatedWord({
  word,
  progress,
  start,
  end,
  trailingSpace,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  trailingSpace: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  const visibleWord = `${word}${trailingSpace ? "\u00A0" : ""}`;

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="opacity-0">{visibleWord}</span>
      <motion.span
        className="absolute inset-0"
        style={{ opacity }}
        aria-hidden="true"
      >
        {visibleWord}
      </motion.span>
    </span>
  );
}

const marqueeImages = [
  "/assets/ngv_cover.webp",
  "/assets/moodpet_final.webp",
  "/assets/fragmented_outcome.webp",
  "/assets/quiet_booking.webp",
  "/assets/finch_forms.webp",
  "/assets/dating_section.webp",
  "/assets/ngv_process.webp",
  "/assets/moodpet_features.webp",
  "/assets/fragmented_concept.webp",
  "/assets/quiet_journey.webp",
  "/assets/finch_statement.webp",
  "/assets/dating_problem.webp",
  "/assets/ngv_outcome.webp",
  "/assets/cover.webp",
];

const workExperiences = [
  {
    number: "01",
    period: "04/2026 - 06/2026",
    location: "Melbourne, Australia",
    organisation: "National Gallery of Victoria",
    logo: "/assets/logo-ngv.png",
    logoAlt: "National Gallery of Victoria logo",
    logoClassName: "w-28 sm:w-32 md:w-36",
    role: "Design Architecture Intern",
    summary:
      "Supported the Curatorial Support team in delivering Melbourne Design Week 2026 public programming across AIGC visual content, web maintenance, and cross-departmental project support.",
    bullets: [
      "Maintained content on the official Melbourne Design Week website.",
      "Independently conceived and produced the AIGC hero visual for the public talk \"It's 2100.: Welcome to the Symbiocene\", published on the MDW 2026 official website.",
      "Supported project management for the Symbiocene program, liaising with artists and managing speaker contracts and run-of-show logistics.",
      "Compiled and edited post-event video materials for the Symbiocene public talk, including speaker presentation footage.",
      "Contributed to early-stage planning for NGV's upcoming exhibition Plant Life.",
    ],
  },
  {
    number: "02",
    period: "07/2021 - 09/2021",
    location: "Beijing, China",
    organisation: "China Agricultural Film and Television Center",
    logo: "/assets/logo-china-agricultural-film-tv.png",
    logoAlt: "China Agricultural Film and Television Center logo",
    logoClassName: "w-36 sm:w-40 md:w-44",
    role: "Film Department Intern",
    summary:
      "Supported service-flow coordination, on-site execution, and review management for the national-level China Farmers Film Festival.",
    bullets: [
      "Supported service-flow planning and on-site execution for the China Farmers Film Festival, coordinating events from leadership meetings to large-scale live broadcast sessions with China Central Television (CCTV).",
      "Organised submission materials for festival entries and supported the review and judging workflow.",
      "Contributed to the design of trophies and branded merchandise, ensuring alignment with the festival's visual identity and cultural positioning.",
    ],
  },
];

const skillCapabilities = [
  {
    number: "01",
    name: "AI Generation",
    tools:
      "Codex (ChatGPT), Claude Design, Nano Banana, Midjourney, Runway, Seedance",
  },
  {
    number: "02",
    name: "3D Modeling",
    tools: "SketchUp, Rhino, Blender, CAD",
  },
  {
    number: "03",
    name: "Video Editing",
    tools: "CapCut Pro, Final Cut Pro, Premiere Pro, Clipchamp",
  },
  {
    number: "04",
    name: "Interaction Design",
    tools: "TouchDesigner, Arduino, P5js",
  },
  {
    number: "05",
    name: "Data Visualization",
    tools: "Flourish",
  },
  {
    number: "06",
    name: "Graphic Design",
    tools: "Illustration, Photoshop, InDesign, Figma, Canva",
  },
];

const skillNamesZh = [
  "AI 生成",
  "三维建模",
  "视频剪辑",
  "交互设计",
  "数据可视化",
  "平面设计",
];

const workExperiencesZh = [
  {
    location: "澳大利亚，墨尔本",
    organisation: "维多利亚国家美术馆",
    role: "设计与建筑实习生",
    summary:
      "协助策展支持团队完成墨尔本设计周 2026 的公共项目，涵盖 AIGC 视觉内容、网站维护与跨部门项目支持。",
    bullets: [
      "维护墨尔本设计周官方网站内容。",
      "独立构思并制作公共论坛《It's 2100: Welcome to the Symbiocene》的 AIGC 主视觉，并发布于 MDW 2026 官方网站。",
      "协助 Symbiocene 项目管理，与艺术家沟通并处理演讲嘉宾合同及活动流程。",
      "整理并剪辑活动后的影像材料，包括演讲展示视频。",
      "参与 NGV 即将推出的 Plant Life 展览前期策划。",
    ],
  },
  {
    location: "中国，北京",
    organisation: "中国农业电影电视中心",
    role: "电影部实习生",
    summary:
      "参与国家级中国农民电影节的服务流程协调、现场执行与评审管理。",
    bullets: [
      "参与电影节服务流程规划与现场执行，协调领导会议及与中央电视台合作的大型直播活动。",
      "整理参赛影片材料并协助评审工作流程。",
      "参与奖杯与品牌周边设计，确保符合电影节视觉形象与文化定位。",
    ],
  },
];

const projects = [
  {
    number: "01",
    name: "MoodPet / MOSS",
    category: "AI Companion Product",
    categoryZh: "AI 陪伴产品",
    cover: "/assets/cover_moodpet.webp",
    bubbleCover: "/assets/moodpet-storyboard-cover.jpg",
    pdfHref: "/assets/profolio2.pdf#page=3",
    description:
      "An AI-driven emotional companion drone for older adults living alone, balancing care, autonomy, privacy, and health prediction.",
    descriptionZh:
      "一款面向独居老年人的 AI 情感陪伴无人机，在关怀、自主性、隐私与健康预测之间取得平衡。",
    images: [
      "/assets/moodpet_final.webp",
      "/assets/moodpet_features.webp",
      "/assets/cover.webp",
    ],
  },
  {
    number: "02",
    name: "It's 2100: Welcome to the Symbiocene",
    category: "NGV Internship",
    categoryZh: "NGV 实习项目",
    cover: "/assets/cover_ngv.webp",
    bubbleCover: "/assets/bubble-cover-symbiocene.png",
    pdfHref: "/assets/NGV_Portfolio_YushanWei.pdf#page=1",
    description:
      "Official AI-generated event visual and curatorial support work for Melbourne Design Week 2026 at NGV.",
    descriptionZh:
      "为 NGV 墨尔本设计周 2026 创作的官方 AI 活动视觉及策展支持项目。",
    images: [
      "/assets/ngv_cover.webp",
      "/assets/ngv_process.webp",
      "/assets/ngv_outcome.webp",
    ],
  },
  {
    number: "03",
    name: "Fragmented Feast",
    category: "Social Design",
    categoryZh: "社会设计",
    cover: "/assets/cover_fragmented.webp",
    bubbleCover: "/assets/fragmented-feast-bubble-cover.png",
    pdfHref: "/assets/profolio2.pdf#page=12",
    description:
      "A participatory Melbourne Design Week project translating dietary restriction into a shared social puzzle about belonging.",
    descriptionZh:
      "一个参与式墨尔本设计周项目，将饮食限制转化为探讨归属感的共享社交拼图。",
    images: [
      "/assets/fragmented_concept.webp",
      "/assets/fragmented_outcome.webp",
      "/assets/ngv_process.webp",
    ],
  },
  {
    number: "04",
    name: "Quiet Access",
    category: "Service Design",
    categoryZh: "服务设计",
    cover: "/assets/cover_quiet.webp",
    bubbleCover: "/assets/audiobook2.png",
    pdfHref: "/assets/profolio2.pdf#page=21",
    description:
      "A neuro-inclusive service system for the State Library of Victoria, combining booking, wayfinding, quiet pods, and non-verbal help.",
    descriptionZh:
      "为维多利亚州立图书馆设计的神经多样性友好服务系统，整合预约、导视、安静舱与非语言帮助。",
    images: [
      "/assets/quiet_booking.webp",
      "/assets/quiet_journey.webp",
      "/assets/fragmented_concept.webp",
    ],
  },
  {
    number: "05",
    name: "When Finch Songs Are Sealed",
    category: "Data Installation",
    categoryZh: "数据装置",
    cover: "/assets/cover_finch.webp",
    bubbleCover: "/assets/finch-bird-jars-cover.png",
    pdfHref: "/assets/profolio2.pdf#page=32",
    description:
      "Ecological data from the Carmichael coal mine translated into speculative bird forms that archive pollution and habitat loss.",
    descriptionZh:
      "将卡迈克尔煤矿的生态数据转化为推想性鸟类形态，记录污染与栖息地流失。",
    images: [
      "/assets/finch_statement.webp",
      "/assets/finch_forms.webp",
      "/assets/quiet_journey.webp",
    ],
  },
  {
    number: "06",
    name: "Dating Corner Space Design",
    category: "Public Space",
    categoryZh: "公共空间设计",
    cover: "/assets/cover_dating.webp",
    bubbleCover: "/assets/dating-corner-night-cover.png",
    pdfHref: "/assets/profolio2.pdf#page=38",
    description:
      "A digital media public-space redesign that shifts matchmaking corners from parental mediation toward participant agency.",
    descriptionZh:
      "以数字媒体重新设计相亲角公共空间，使其从家长主导转向参与者自主。",
    images: [
      "/assets/dating_problem.webp",
      "/assets/dating_section.webp",
      "/assets/finch_forms.webp",
    ],
  },
  {
    number: "07",
    name: "The Cube",
    category: "Digital Media Art",
    categoryZh: "数字媒体艺术",
    cover: "/assets/cover_dating.webp",
    bubbleCover: "/assets/cover_dating.webp",
    pdfHref: "#",
    description:
      "A digital media artwork created with Blender and Premiere Pro, visualising the rapid, layered brainstorm of an ADHD mind as ideas collide, multiply, and reorganise within a shifting cube.",
    descriptionZh:
      "一件使用 Blender 与 Premiere Pro 制作的数字媒体艺术作品，以不断变化的魔方空间呈现 ADHD 思维中快速、层叠的头脑风暴——想法彼此碰撞、增殖并重新组织。",
    images: [
      "/assets/cover_dating.webp",
      "/assets/cover_dating.webp",
      "/assets/cover_dating.webp",
    ],
    videoSrc: "/assets/the-cube.mp4",
  },
  {
    number: "08",
    name: "Black Dress",
    category: "Photography",
    categoryZh: "摄影",
    cover: "/assets/photography-vogue.png",
    bubbleCover: "/assets/photography-vogue.png",
    pdfHref: "#",
    description:
      "Photography is an ongoing part of my creative practice, sharpening how I observe composition, light, architecture, and human presence. This black-and-white image was selected for PhotoVogue, Vogue Italia's curated photography platform.",
    descriptionZh:
      "摄影是我持续进行的创作实践，帮助我观察构图、光线、建筑与人物之间的关系。这幅黑白摄影作品曾入选 Vogue Italia 旗下的策展摄影平台 PhotoVogue。",
    images: [
      "/assets/photography-vogue.png",
      "/assets/photography-vogue.png",
      "/assets/photography-vogue.png",
    ],
    photoSrc: "/assets/photography-vogue.png",
  },
];

const moodpetPdfPages = Array.from(
  { length: 9 },
  (_, index) => `/assets/moodpet-pages/page-${index + 1}.jpg`,
);

const finchPdfPages = Array.from(
  { length: 6 },
  (_, index) => `/assets/finch-pages/page-${index + 1}.jpg`,
);

const fragmentedPdfPages = Array.from(
  { length: 9 },
  (_, index) => `/assets/fragmented-pages/page-${index + 1}.jpg`,
);

const ngvPdfPages = Array.from(
  { length: 8 },
  (_, index) => `/assets/ngv-pages/page-${index + 1}.jpg`,
);

const quietAccessPdfPages = Array.from(
  { length: 11 },
  (_, index) => `/assets/quiet-access-pages/page-${index + 1}.jpg`,
);

const datingCornerPdfPages = Array.from(
  { length: 3 },
  (_, index) => `/assets/dating-corner-pages/page-${index + 1}.jpg`,
);

const bubbleLayouts = [
  {
    className: "h-[88px] w-[88px] sm:h-[162px] sm:w-[162px] lg:h-[196px] lg:w-[196px]",
  },
  {
    className: "h-[88px] w-[88px] sm:h-[162px] sm:w-[162px] lg:h-[196px] lg:w-[196px]",
  },
  {
    className: "h-[88px] w-[88px] sm:h-[162px] sm:w-[162px] lg:h-[196px] lg:w-[196px]",
  },
  {
    className: "h-[88px] w-[88px] sm:h-[162px] sm:w-[162px] lg:h-[196px] lg:w-[196px]",
  },
  {
    className: "h-[88px] w-[88px] sm:h-[162px] sm:w-[162px] lg:h-[196px] lg:w-[196px]",
  },
  {
    className: "h-[88px] w-[88px] sm:h-[162px] sm:w-[162px] lg:h-[196px] lg:w-[196px]",
  },
];

function ProjectBubble({
  project,
  index,
  onPreview,
  onHoverChange,
}: {
  project: (typeof projects)[number];
  index: number;
  onPreview: () => void;
  onHoverChange: (isHovered: boolean) => void;
}) {
  const layout = bubbleLayouts[index % bubbleLayouts.length];
  const previewTimer = useRef<number | null>(null);

  const clearPreviewTimer = () => {
    if (previewTimer.current !== null) {
      window.clearTimeout(previewTimer.current);
      previewTimer.current = null;
    }
  };

  const startPreviewTimer = () => {
    clearPreviewTimer();
    previewTimer.current = window.setTimeout(() => {
      onPreview();
      previewTimer.current = null;
    }, 1000);
  };

  useEffect(() => clearPreviewTimer, []);

  return (
    <div
      data-orbit-index={index}
      className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 hover:z-40 focus-within:z-40 ${layout.className}`}
    >
      <motion.button
        type="button"
        aria-label={`Preview ${project.name}`}
        onMouseEnter={() => {
          onHoverChange(true);
          startPreviewTimer();
        }}
        onMouseLeave={() => {
          onHoverChange(false);
          clearPreviewTimer();
        }}
        onFocus={() => {
          onHoverChange(true);
          onPreview();
        }}
        onBlur={() => onHoverChange(false)}
        onClick={onPreview}
        className="group pointer-events-auto relative h-full w-full"
        initial={{ opacity: 0, scale: 0.82, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: 0.18 + index * 0.08,
          duration: 0.72,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        whileHover={{ scale: 1.1 }}
        whileFocus={{ scale: 1.1 }}
      >
        <div
          className="relative h-full w-full"
          style={{ transform: "rotate(var(--counter-angle, 0deg))" }}
        >
          <div className="absolute inset-[-18px] rounded-full bg-[#bcd4ea]/45 blur-2xl transition duration-500 group-hover:scale-125 group-hover:bg-[#d8e8f6]/90" />
          <div className="relative h-full w-full overflow-hidden rounded-full border border-[#9eb8cd]/70 bg-[#dcecf7] p-2.5 shadow-[0_20px_50px_rgba(75,105,130,0.2)] outline outline-1 -outline-offset-[8px] outline-white/50">
            <img
              src={project.bubbleCover}
              alt={project.name}
              className="h-full w-full rounded-full object-cover project-image"
            />
            <div className="absolute inset-2.5 rounded-full bg-white/8 ring-1 ring-white/55" />
          </div>
        </div>
      </motion.button>
    </div>
  );
}

function SelectedProjectFocus({
  project,
  onClose,
  onViewProject,
}: {
  project: (typeof projects)[number];
  onClose: () => void;
  onViewProject: () => void;
}) {
  const { language } = useLanguage();

  return (
    <div className="absolute inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-[#f8f7f2] px-4 py-16 sm:px-5 sm:py-24">
      <motion.div
        className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center text-center"
        initial={{ opacity: 0, scale: 0.86, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={{ duration: 0.52, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="relative z-20 h-[min(34vh,370px)] w-[min(34vh,370px)] min-h-[180px] min-w-[180px] rounded-full bg-[#dcecf7] p-3 shadow-[0_26px_80px_rgba(75,105,130,0.24)] sm:h-[min(42vh,370px)] sm:w-[min(42vh,370px)] sm:min-h-[240px] sm:min-w-[240px] sm:p-4">
          <button
            type="button"
            aria-label="Close selected project"
            onClick={onClose}
            className="absolute right-0 top-0 z-30 inline-flex h-11 w-11 translate-x-2 -translate-y-2 items-center justify-center rounded-full bg-[#1d1c18]/80 text-white shadow-lg backdrop-blur transition hover:bg-[#1d1c18] sm:h-14 sm:w-14 sm:translate-x-6 sm:-translate-y-3"
          >
            <X size={26} strokeWidth={1.8} />
          </button>
          <img
            src={project.cover}
            alt={project.name}
            className="h-full w-full rounded-full object-cover project-image"
          />
          <div className="absolute inset-4 rounded-full ring-1 ring-white/70" />
        </div>

        <div className="relative z-10 -mt-5 w-[min(92vw,920px)] rounded-[26px] bg-white/92 px-5 py-7 shadow-[0_22px_80px_rgba(29,28,24,0.09)] backdrop-blur-md sm:-mt-7 sm:rounded-[34px] sm:px-10 sm:py-10 md:px-16 md:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1d1c18]/55">
            {project.number} / {language === "zh" ? project.categoryZh : project.category}
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,6vw,5.8rem)] leading-[0.95] tracking-[-0.04em] text-[#1d1c18] sm:mt-4">
            {project.name}
          </h2>
          <p className="mx-auto mt-4 max-w-[680px] text-[clamp(0.9rem,2vw,1.45rem)] font-light leading-relaxed text-[#1d1c18]/78 sm:mt-6">
            {language === "zh" ? project.descriptionZh : project.description}
          </p>
          <button
            type="button"
            onClick={onViewProject}
            className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#1d1c18]/20 bg-[#1d1c18] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:scale-[1.03] sm:mt-9 sm:px-8 sm:py-4 sm:text-sm"
          >
            {localize(language, "View PDF", "查看 PDF")}
            <ArrowUpRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function HeroSectionLegacy() {
  const { language } = useLanguage();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(
    null,
  );
  const selectedProject =
    selectedProjectIndex === null ? null : projects[selectedProjectIndex];
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const orbitAngleRef = useRef(0);
  const orbitSpeedRef = useRef(0.0012);
  const orbitPausedRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );

  useEffect(() => {
    let animationFrame = 0;
    let previousTime = performance.now();

    const animateOrbit = (time: number) => {
      const elapsed = Math.min(time - previousTime, 40);
      previousTime = time;

      if (!orbitPausedRef.current) {
        orbitAngleRef.current =
          (orbitAngleRef.current + orbitSpeedRef.current * elapsed) % 360;
      }

      orbitSpeedRef.current += (0.0012 - orbitSpeedRef.current) * 0.018;
      if (orbitRef.current) {
        const orbit = orbitRef.current;
        const bubbles = orbit.querySelectorAll<HTMLElement>("[data-orbit-index]");
        const angleOffset = (orbitAngleRef.current * Math.PI) / 180;

        bubbles.forEach((bubble, index) => {
          const bubbleRadius = bubble.offsetWidth / 2;
          const radiusX = Math.max(0, orbit.clientWidth / 2 - bubbleRadius - 24);
          const radiusY = Math.max(0, orbit.clientHeight / 2 - bubbleRadius - 24);
          const angle = angleOffset - Math.PI / 2 + (index * Math.PI * 2) / bubbles.length;

          bubble.style.left = `${orbit.clientWidth / 2 + Math.cos(angle) * radiusX}px`;
          bubble.style.top = `${orbit.clientHeight / 2 + Math.sin(angle) * radiusY}px`;
        });
      }

      animationFrame = window.requestAnimationFrame(animateOrbit);
    };

    animationFrame = window.requestAnimationFrame(animateOrbit);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const viewSelectedProject = () => {
    if (selectedProjectIndex === null) return;

    const projectIndex = selectedProjectIndex;
    setSelectedProjectIndex(null);
    window.requestAnimationFrame(() => {
      document
        .getElementById(`project-${projectIndex}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#f8f7f2] text-[#1d1c18]"
      onPointerMove={(event) => {
        const now = performance.now();
        const previous = lastPointerRef.current;
        if (previous) {
          const elapsed = Math.max(now - previous.time, 1);
          const distance = Math.hypot(
            event.clientX - previous.x,
            event.clientY - previous.y,
          );
          const pointerSpeed = distance / elapsed;
          orbitSpeedRef.current = Math.max(
            orbitSpeedRef.current,
            0.0012 + Math.min(pointerSpeed * 0.012, 0.024),
          );
        }
        lastPointerRef.current = { x: event.clientX, y: event.clientY, time: now };
      }}
      onPointerLeave={() => {
        lastPointerRef.current = null;
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_center,#1d1c18_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(72vw,680px)] w-[min(72vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1d1c18]/10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(48vw,440px)] w-[min(48vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1d1c18]/10" />

      <FadeIn delay={0} y={-20}>
        <nav className="relative z-20 mx-auto flex max-w-md flex-wrap justify-center gap-x-5 gap-y-3 px-4 pt-5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#1d1c18] sm:max-w-none sm:justify-end sm:gap-8 sm:px-8 sm:pt-7 sm:text-xs sm:tracking-[0.18em] md:px-10 md:text-sm lg:gap-16 lg:text-base">
          {[
            { label: localize(language, "About", "关于我"), href: "#about" },
            { label: localize(language, "Capabilities", "技能"), href: "#capabilities" },
            { label: localize(language, "Work Experience", "工作经历"), href: "#work-experience" },
            { label: localize(language, "Projects", "项目"), href: "#projects" },
            { label: localize(language, "Contact", "联系我"), href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition duration-200 hover:opacity-55"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="relative z-10 h-[calc(100svh-92px)] min-h-[620px] px-4 sm:h-[calc(100vh-72px)] sm:min-h-[720px] sm:px-5 md:min-h-[760px]">
        <div
          ref={orbitRef}
          className="pointer-events-none absolute inset-0 z-10"
        >
          {projects.slice(0, 6).map((project, index) => (
            <ProjectBubble
              key={project.name}
              project={project}
              index={index}
              onPreview={() => setSelectedProjectIndex(index)}
              onHoverChange={(isHovered) => {
                orbitPausedRef.current = isHovered;
              }}
            />
          ))}
        </div>

        {selectedProject ? (
          <SelectedProjectFocus
            project={selectedProject}
            onClose={() => setSelectedProjectIndex(null)}
            onViewProject={viewSelectedProject}
          />
        ) : (
        <div className="absolute left-1/2 top-[49%] z-30 w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 text-center sm:top-[48%] sm:w-[min(58vw,560px)]">
            <FadeIn delay={0.28} y={26}>
              <p className="mx-auto mb-4 w-fit text-xs font-semibold uppercase tracking-[0.24em] text-[#1d1c18]/55 md:text-sm">
                {localize(language, "Design Innovation & Technology", "设计创新与科技")}
              </p>
              <h1 className="mx-auto w-fit font-serif text-[clamp(2.15rem,5.4vw,6.4rem)] leading-[0.92] tracking-[-0.04em] text-[#1d1c18]">
                Yushan
                <span className="block italic">(Angie) Wei</span>
              </h1>
              <p className="mx-auto mt-4 max-w-[420px] text-[clamp(0.82rem,1.25vw,1.05rem)] font-light leading-snug text-[#1d1c18]/72">
                {localize(
                  language,
                  "A portfolio orbiting AIGC, service design, speculative products, data visualization, and public-space storytelling.",
                  "一个围绕 AIGC、服务设计、推想性产品、数据可视化与公共空间叙事展开的作品集。",
                )}
              </p>
            </FadeIn>
          </div>
        )}

      </div>
    </section>
  );
}

const heroProjectTypes = [
  "AI Companion Product",
  "AIGC",
  "Curatorial Design",
  "User Experience",
  "Data",
  "Spatial",
];

function HeroSectionGridLegacy() {
  const { language } = useLanguage();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-4 pb-12 text-black sm:px-6 md:px-10">
      <FadeIn delay={0} y={-20}>
        <nav className="relative z-30 mx-auto flex max-w-md flex-wrap justify-center gap-x-5 gap-y-3 pt-5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.12em] sm:max-w-none sm:justify-end sm:gap-8 sm:pt-7 sm:text-xs sm:tracking-[0.18em] md:text-sm lg:gap-16 lg:text-base">
          {[
            { label: "About", href: "#about" },
            { label: "Capabilities", href: "#capabilities" },
            { label: "Work Experience", href: "#work-experience" },
            { label: "Projects", href: "#projects" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="transition duration-200 hover:opacity-50">
              {item.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="mx-auto flex min-h-[calc(100svh-76px)] max-w-[1600px] flex-col justify-center pt-12 sm:pt-16">
        <FadeIn delay={0.12} y={24}>
          <div className="mb-12 text-center sm:mb-16 md:mb-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] md:text-sm">
              {localize(language, "Design Innovation & Technology", "Design Innovation & Technology")}
            </p>
            <h1 className="text-[clamp(3.2rem,8vw,8rem)] font-black leading-[0.78] tracking-[-0.065em]">
              Yushan <span className="italic">(Angie) Wei</span>
            </h1>
          </div>
        </FadeIn>

        <div
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-5"
          onMouseLeave={() => setHoveredProject(null)}
        >
          {projects.slice(0, 6).map((project, index) => {
            const isActive = hoveredProject === index;
            const isDeemphasized = hoveredProject !== null && !isActive;

            return (
              <motion.a
                key={project.name}
                href={`#project-${index}`}
                aria-label={`View ${project.name}`}
                className="group block min-w-0 origin-center"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                animate={{
                  scale: isActive ? 1.045 : 1,
                  filter: isDeemphasized ? "blur(4px)" : "blur(0px)",
                  opacity: isDeemphasized ? 0.36 : 1,
                }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                onMouseEnter={() => setHoveredProject(index)}
                onFocus={() => setHoveredProject(index)}
                onBlur={() => setHoveredProject(null)}
              >
                <div className="aspect-square overflow-hidden border border-black/20 bg-white">
                  <img
                    src={project.bubbleCover}
                    alt={project.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-black pt-2">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] sm:text-xs">
                    {heroProjectTypes[index]}
                  </span>
                  <span className="text-[0.65rem] font-medium tabular-nums opacity-45 sm:text-xs">
                    0{index + 1}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const heroScatterLayouts = [
  "lg:left-[2%] lg:top-[36%] lg:w-[29%]",
  "lg:left-[47%] lg:top-[18%] lg:w-[22%]",
  "lg:left-[40%] lg:bottom-[12%] lg:w-[17%]",
  "lg:right-[4%] lg:top-[31%] lg:w-[18%]",
  "lg:left-auto lg:right-[7%] lg:bottom-[1%] lg:w-[13%]",
  "lg:left-[62%] lg:bottom-[0%] lg:w-[11%]",
];

const heroCompactLayouts = [
  "w-[78%] self-center mb-[20svh] sm:w-[66%]",
  "w-[48%] self-start sm:w-[40%]",
  "w-[46%] self-end -mt-[14svh] mb-[28svh] sm:w-[38%] sm:-mt-[22svh]",
  "w-[72%] self-center mb-[24svh] sm:w-[60%]",
  "w-[48%] self-start sm:w-[40%]",
  "w-[46%] self-end -mt-[14svh] mb-[8svh] sm:w-[38%] sm:-mt-[22svh]",
];

function HeroSection() {
  const { language, setLanguage } = useLanguage();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-4 pb-10 text-black sm:px-6 md:px-8">
      <div className="relative mx-auto min-h-[100svh] max-w-[1800px] pt-5 sm:pt-7">
        <FadeIn delay={0.04} x={-24} y={0} className="relative z-30 max-w-[72%] lg:absolute lg:left-0 lg:top-6 lg:max-w-[43%]">
          <h1 className="text-[clamp(3.4rem,7.8vw,8.6rem)] font-black leading-[0.74] tracking-[-0.075em]">
            Yushan
            <span className="block italic">(Angie) Wei</span>
          </h1>
          <p className="mt-5 max-w-[430px] text-sm font-medium leading-tight sm:text-base md:text-lg">
            {localize(
              language,
              "Design innovation, AIGC, interactive experiences, and visual storytelling.",
              "设计创新、AIGC、互动体验与视觉叙事。",
            )}
          </p>
        </FadeIn>

        <FadeIn delay={0} y={-16} className="absolute right-0 top-5 z-40 sm:top-7">
          <nav className="flex flex-col items-end gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.13em] sm:text-xs md:flex-row md:gap-6 md:text-sm lg:gap-10">
            {[
              { label: localize(language, "About", "关于我"), href: "#about" },
              { label: localize(language, "Capabilities", "专业技能"), href: "#capabilities" },
              { label: localize(language, "Work", "工作经历"), href: "#work-experience" },
              { label: localize(language, "Projects", "项目作品"), href: "#projects" },
              { label: localize(language, "Contact", "联系方式"), href: "#contact" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="transition hover:opacity-45">
                {item.label}
              </a>
            ))}
            <label className="relative cursor-pointer transition hover:opacity-45">
              <span>{localize(language, "Language", "语言")}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                aria-label={localize(language, "Language", "语言")}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </label>
          </nav>
        </FadeIn>

        <div
          className="relative z-20 mt-20 flex flex-col pb-8 sm:mt-28 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-0 lg:mt-0 lg:block lg:pb-0"
          onMouseLeave={() => setHoveredProject(null)}
        >
          {projects.slice(0, 6).map((project, index) => {
            const isActive = hoveredProject === index;
            const isDeemphasized = hoveredProject !== null && !isActive;

            return (
              <motion.a
                key={project.name}
                href={`#project-${index}`}
                data-hero-project={index}
                aria-label={`View ${project.name}`}
                className={`group relative block min-w-0 origin-center lg:absolute lg:m-0 lg:self-auto ${heroCompactLayouts[index]} ${heroScatterLayouts[index]}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                animate={{
                  scale: isActive ? 1.055 : 1,
                  filter: isDeemphasized ? "blur(5px)" : "blur(0px)",
                  opacity: isDeemphasized ? 0.3 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                onFocus={() => setHoveredProject(index)}
                onBlur={() => setHoveredProject(null)}
              >
                {index === 5 && (
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] sm:text-xs">
                      {language === "zh" ? project.categoryZh : heroProjectTypes[index]}
                    </span>
                    <span className="text-[0.6rem] font-medium tabular-nums opacity-45 sm:text-[0.7rem]">
                      0{index + 1}
                    </span>
                  </div>
                )}
                <div className="aspect-square overflow-hidden border border-black/20 bg-white">
                  <img
                    src={project.bubbleCover}
                    alt={project.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                  />
                </div>
                {index !== 5 && (
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] sm:text-xs">
                      {language === "zh" ? project.categoryZh : heroProjectTypes[index]}
                    </span>
                    <span className="text-[0.6rem] font-medium tabular-nums opacity-45 sm:text-[0.7rem]">
                      0{index + 1}
                    </span>
                  </div>
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({
  images,
  direction,
}: {
  images: string[];
  direction: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sectionTop = ref.current?.offsetTop ?? 0;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const repeated = [...images, ...images, ...images];
  const translate =
    direction === "right" ? offset - 200 : -(offset - 200);

  return (
    <div ref={ref} className="overflow-hidden">
      <div
        className="flex gap-3"
        style={{
          transform: `translateX(${translate}px)`,
          willChange: "transform",
        }}
      >
        {repeated.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt=""
            loading="lazy"
            className="h-[190px] w-[300px] shrink-0 rounded-2xl object-cover project-image sm:h-[230px] sm:w-[360px] md:h-[270px] md:w-[420px]"
          />
        ))}
      </div>
    </div>
  );
}

function MarqueeSection() {
  return (
    <section className="bg-ink pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <MarqueeRow images={marqueeImages.slice(0, 7)} direction="right" />
        <MarqueeRow images={marqueeImages.slice(7)} direction="left" />
      </div>
    </section>
  );
}

function AboutSectionLegacy() {
  const { language } = useLanguage();

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f8f7f2] px-5 py-20 text-ink sm:px-8 md:px-10"
    >
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
        <BrainCircuit className="absolute left-[4%] top-[8%] h-[96px] w-[96px] text-ink/10 sm:h-[136px] sm:w-[136px] md:h-[180px] md:w-[180px]" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
        <GalleryHorizontalEnd className="absolute right-[4%] top-[8%] h-[96px] w-[96px] text-ink/10 sm:h-[136px] sm:w-[136px] md:h-[180px] md:w-[180px]" />
      </FadeIn>
      <motion.img
        src="/assets/about_mdw.webp"
        alt=""
        className="absolute bottom-[5%] left-[5%] hidden max-h-[230px] w-[120px] rounded-[28px] border border-ink/10 bg-white/45 object-contain opacity-90 shadow-[0_18px_60px_rgba(29,28,24,0.1)] sm:block md:bottom-[6%] md:left-[8%] md:w-[150px]"
        initial={{ opacity: 0, x: -70, y: 18, rotate: -5 }}
        whileInView={{ opacity: 0.9, x: 0, y: 0, rotate: -5 }}
        viewport={{ once: true, margin: "50px", amount: 0 }}
        transition={{ delay: 0.25, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.img
        src="/assets/about_right_new.webp"
        alt=""
        className="absolute bottom-[5%] right-[5%] hidden max-h-[230px] w-[124px] rounded-[28px] border border-ink/10 bg-white/45 object-contain opacity-90 shadow-[0_18px_60px_rgba(29,28,24,0.1)] sm:block md:bottom-[6%] md:right-[8%] md:w-[154px]"
        initial={{ opacity: 0, x: 70, y: 18, rotate: 5 }}
        whileInView={{ opacity: 0.9, x: 0, y: 0, rotate: 5 }}
        viewport={{ once: true, margin: "50px", amount: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      />

      <div className="relative z-20 flex -translate-y-20 flex-col items-center gap-8 sm:-translate-y-24 sm:gap-10 md:-translate-y-36 md:gap-12 lg:-translate-y-40">
        <FadeIn y={40}>
          <h2 className="text-center font-serif text-[clamp(3rem,12vw,160px)] italic leading-none tracking-[-0.05em] text-ink">
            {localize(language, "About Me", "关于我")}
          </h2>
        </FadeIn>
        <AnimatedText
          className="text-ink"
          text={localize(
            language,
            "A final-year Master of Interactive Design student at RMIT University with a practice spanning AI-generated visual communication, exhibition production, and service design. Currently deepening expertise in AIGC workflows across cultural and creative institutional contexts. Passionate about translating complex concepts into communicative visual outcomes. Seeking to contribute interdisciplinary design thinking and hands-on production capability to forward-looking creative teams.",
            "我是魏雨杉（Angie），现就读于 RMIT 大学设计创新与科技硕士。我的实践涵盖 AIGC 视觉指导、推想性产品设计、服务设计与数据驱动装置，并持续探索设计如何让关怀、归属感与生态未来变得更加可见。",
          )}
        />
      </div>
      <div className="absolute bottom-[8%] left-1/2 z-30 -translate-x-1/2">
        <FadeIn y={20} delay={0.15}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-acid px-5 py-20 text-ink sm:px-8 sm:py-24 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1600px]">
        <FadeIn y={36}>
          <h2 className="font-serif text-[clamp(4.4rem,14vw,200px)] italic leading-[0.78] tracking-[-0.065em]">
            About Me
          </h2>
        </FadeIn>

        <FadeIn y={28} delay={0.08}>
          <div className="mt-16 grid gap-8 border-t border-ink pt-5 text-sm leading-snug sm:mt-20 md:grid-cols-[0.6fr_0.9fr_2fr] md:gap-12 md:text-base lg:text-lg">
            <p className="font-semibold uppercase tracking-[0.08em]">Bio</p>
            <p className="font-semibold uppercase tracking-[0.08em]">Design · Culture · Technology</p>
            <div className="max-w-3xl space-y-5 text-[clamp(1rem,1.55vw,1.35rem)] leading-[1.35]">
              <p>
                A final-year Master of Interactive Design student at RMIT University, with a practice spanning AI-generated visual communication, exhibition production, and service design.
              </p>
              <p>
                Currently deepening expertise in AIGC workflows across cultural and creative institutional contexts, translating complex concepts into clear, communicative visual outcomes.
              </p>
              <p>
                I bring interdisciplinary design thinking and hands-on production capability to forward-looking creative teams.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn y={48} delay={0.12}>
          <div className="mt-24 grid items-center gap-5 sm:mt-32 md:grid-cols-[0.42fr_2fr_0.42fr] md:gap-7">
            <p className="order-1 text-left text-sm font-semibold uppercase tracking-[0.12em] md:text-base">Yushan</p>
            <div className="order-3 overflow-hidden border border-ink/15 bg-white/20 md:order-2">
              <img
                src="/assets/about-yushan.jpg"
                alt="Portrait of Yushan Wei"
                className="aspect-[4/3] h-auto w-full object-cover object-center"
              />
            </div>
            <p className="order-2 text-right text-sm font-semibold uppercase tracking-[0.12em] md:order-3 md:text-base">Wei</p>
          </div>
        </FadeIn>

        <FadeIn y={32} delay={0.12}>
          <div className="mt-20 grid gap-8 border-t border-ink pt-5 sm:mt-28 md:grid-cols-[0.75fr_2.25fr] md:gap-12">
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] md:text-base">Services</h3>
            <ul className="text-[clamp(1.05rem,1.65vw,1.45rem)] leading-tight">
              {["AIGC", "Vibe Coding", "Interactive Design", "Product Design", "Web Design", "User Experience Design"].map((service) => (
                <li key={service} className="border-b border-ink/15 py-3 first:pt-0 last:border-b-0">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <div className="mt-14 flex justify-center md:mt-20">
          <FadeIn y={20} delay={0.15}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const { language } = useLanguage();

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden bg-[#f8f7f2] px-5 py-20 text-ink sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(82vw,760px)] w-[min(82vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:radial-gradient(circle_at_center,#1d1c18_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-ink/45">
            {localize(language, "Skills from resume", "简历技能")}
          </p>
          <h2 className="mt-4 text-center font-serif text-[clamp(3.2rem,11vw,150px)] italic leading-none tracking-[-0.06em] text-ink">
            {localize(language, "Capabilities", "专业技能")}
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:mt-18 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {skillCapabilities.map((skill, index) => (
            <FadeIn key={skill.number} delay={index * 0.08}>
              <article className="group relative min-h-[220px] overflow-hidden rounded-[34px] border border-ink/10 bg-white/58 p-6 shadow-[0_18px_60px_rgba(29,28,24,0.055)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/84 hover:shadow-[0_24px_80px_rgba(29,28,24,0.09)]">
                <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full border border-ink/10 bg-[#f8f7f2] font-serif text-2xl italic text-ink/45 transition group-hover:text-ink">
                  {skill.number}
                </div>
                <div className="flex h-full flex-col justify-end">
                  <h3 className="max-w-[12rem] font-serif text-[clamp(1.75rem,3.3vw,3.15rem)] leading-[0.95] tracking-[-0.04em]">
                    {language === "zh" ? skillNamesZh[index] : skill.name}
                  </h3>
                  <p className="mt-5 text-[clamp(0.95rem,1.4vw,1.15rem)] font-light leading-relaxed text-ink/66">
                    {skill.tools}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkExperienceSection() {
  const { language } = useLanguage();

  return (
    <section
      id="work-experience"
      className="rounded-t-[40px] bg-white px-5 py-20 text-ink sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn>
        <h2 className="mb-16 text-center text-[clamp(2.8rem,10vw,140px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">
          {localize(language, "Work Experience", "工作经历")}
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {workExperiences.map((item, index) => (
          <FadeIn key={item.number} delay={index * 0.1}>
            <article className="grid gap-6 border-t border-ink/15 py-8 last:border-b sm:gap-8 sm:py-10 md:grid-cols-[0.42fr_1fr] md:py-12">
              <div className="flex flex-col items-start">
                <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none text-ink">
                  {item.number}
                </span>
                <img
                  src={item.logo}
                  alt={item.logoAlt}
                  className={`mt-5 h-auto max-w-full object-contain ${item.logoClassName}`}
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 sm:text-sm">
                  <span>{item.period}</span>
                  <span>{language === "zh" ? workExperiencesZh[index].location : item.location}</span>
                </div>
                <h3 className="mt-3 font-serif text-[clamp(1.9rem,4.6vw,4.6rem)] leading-[0.95] tracking-[-0.04em]">
                  {language === "zh" ? workExperiencesZh[index].organisation : item.organisation}
                </h3>
                <p className="mt-3 text-[clamp(1rem,1.8vw,1.35rem)] font-medium uppercase tracking-[0.08em]">
                  {language === "zh" ? workExperiencesZh[index].role : item.role}
                </p>
                <p className="mt-4 max-w-3xl text-[clamp(0.9rem,1.45vw,1.15rem)] font-light leading-relaxed text-ink/65">
                  {language === "zh" ? workExperiencesZh[index].summary : item.summary}
                </p>
                <ul className="mt-5 grid gap-3 text-sm font-light leading-relaxed text-ink/70 sm:text-base">
                  {(language === "zh" ? workExperiencesZh[index]?.bullets ?? item.bullets : item.bullets).map((bullet) => (
                    <li key={bullet} className="border-l border-ink/20 pl-4">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function PdfPageCarousel({
  pages,
  title,
  videoLink,
}: {
  pages: string[];
  title: string;
  videoLink?: {
    pageIndex: number;
    url: string;
    placement?: "page-left-bottom" | "video-bottom";
  };
}) {
  const { language } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const scrollToPage = (pageIndex: number) => {
    const nextPage = Math.max(0, Math.min(pageIndex, pages.length - 1));
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      left: scroller.clientWidth * nextPage,
      behavior: "smooth",
    });
    setCurrentPage(nextPage);
  };

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientWidth === 0) return;
    setCurrentPage(
      Math.min(
        pages.length - 1,
        Math.max(0, Math.round(scroller.scrollLeft / scroller.clientWidth)),
      ),
    );
  };

  return (
    <div className="pdf-carousel isolate overflow-hidden rounded-[28px] border border-mist/25 bg-black sm:rounded-[40px] md:rounded-[50px]">
      <div className="flex items-center justify-between gap-3 border-b border-mist/15 px-4 py-3 sm:px-6">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-mist/60 sm:text-xs">
          {localize(language, "Swipe or scroll through the PDF", "滑动或滚动浏览 PDF")}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="min-w-12 text-center text-xs font-medium tabular-nums text-mist/70 sm:text-sm">
            {currentPage + 1} / {pages.length}
          </span>
          <button
            type="button"
            aria-label="Previous PDF page"
            onClick={() => scrollToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-mist/30 text-mist transition hover:bg-mist/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next PDF page"
            onClick={() => scrollToPage(currentPage + 1)}
            disabled={currentPage === pages.length - 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-mist/30 text-mist transition hover:bg-mist/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-color:#dce6ee_#111] [scrollbar-width:thin]"
      >
        {pages.map((page, pageIndex) => (
          <figure key={page} className="relative min-w-full snap-center">
            <img
              src={page}
              alt={`${title} PDF page ${pageIndex + 1}`}
              loading={pageIndex === 0 ? "eager" : "lazy"}
              className="aspect-video w-full bg-black object-contain"
            />
            {videoLink?.pageIndex === pageIndex && (
              <a
                href={videoLink.url}
                target="_blank"
                rel="noreferrer"
                className={`absolute inline-flex items-center gap-2 rounded-full border border-white/70 bg-black/80 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white hover:text-black sm:px-6 sm:py-3 sm:text-sm ${
                  videoLink.placement === "page-left-bottom"
                    ? "bottom-[5%] left-[5%]"
                    : "bottom-[10%] left-[59%] -translate-x-full"
                }`}
              >
                {localize(language, "Watch Video", "观看视频")}
                <ArrowUpRight size={18} />
              </a>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const { language } = useLanguage();
  const videoSrc = "videoSrc" in project ? (project.videoSrc as string) : null;
  const isVideoProject = Boolean(videoSrc);
  const isYouTubeVideo = Boolean(videoSrc?.includes("youtube.com/embed/"));
  const photoSrc = "photoSrc" in project ? (project.photoSrc as string) : null;
  const isPhotoProject = Boolean(photoSrc);
  const embeddedPdfPages =
    index === 0
      ? moodpetPdfPages
      : index === 1
        ? ngvPdfPages
        : index === 2
          ? fragmentedPdfPages
          : index === 3
            ? quietAccessPdfPages
            : index === 4
              ? finchPdfPages
              : index === 5
                ? datingCornerPdfPages
                : null;

  return (
    <div
      id={`project-${index}`}
      className={`relative ${index === 0 ? "" : "-mt-3 sm:-mt-4"}`}
      style={{ zIndex: index + 1 }}
    >
      <motion.article
        className="relative overflow-hidden rounded-[34px] border-2 border-mist bg-ink p-4 sm:rounded-[46px] sm:p-6 md:rounded-[58px] md:p-8"
      >
        <div className="mb-5 grid gap-4 md:grid-cols-[0.35fr_1fr_auto] md:items-end">
          <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none text-mist">
            {project.number}
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-acid">
              {language === "zh" ? project.categoryZh : project.category}
            </p>
            <h3 className="mt-2 max-w-3xl text-[clamp(1.6rem,4.8vw,4.8rem)] font-black uppercase leading-none text-mist">
              {project.name}
            </h3>
            <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-mist/70 sm:text-base">
              {language === "zh" ? project.descriptionZh : project.description}
            </p>
          </div>
          {!embeddedPdfPages && !isVideoProject && !isPhotoProject && (
            <a
              href={project.pdfHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-mist px-6 py-3 text-sm font-medium uppercase tracking-widest text-mist transition hover:bg-mist/10 sm:px-8 sm:py-3.5 sm:text-base"
            >
              {localize(language, "Open PDF", "打开 PDF")}
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>

        {isPhotoProject ? (
          <figure className="overflow-hidden rounded-[28px] border border-mist/25 bg-black sm:rounded-[40px] md:rounded-[50px]">
            <img
              src={photoSrc ?? undefined}
              alt="Black Dress photography feature on PhotoVogue by Vogue Italia"
              className="h-auto w-full object-contain"
            />
          </figure>
        ) : isVideoProject ? (
          <div className="overflow-hidden rounded-[28px] border border-mist/25 bg-black sm:rounded-[40px] md:rounded-[50px]">
            {isYouTubeVideo ? (
              <iframe
                src={videoSrc ?? undefined}
                title="The Cube digital media artwork"
                className="aspect-video w-full bg-black"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
            <video
              src={videoSrc ?? undefined}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full bg-black object-contain"
              aria-label={localize(
                language,
                "The Cube digital media artwork",
                "The Cube 数字媒体艺术作品",
              )}
            >
              {localize(
                language,
                "Your browser does not support video playback.",
                "你的浏览器不支持视频播放。",
              )}
            </video>
            )}
          </div>
        ) : embeddedPdfPages ? (
          <PdfPageCarousel
            pages={embeddedPdfPages}
            title={project.name}
            videoLink={
              index === 0
                ? {
                    pageIndex: 8,
                    url: "https://youtu.be/2EBWyT_SLFQ?si=baDkPPWL95mSi3Q2",
                    placement: "page-left-bottom",
                  }
                : index === 3
                ? {
                    pageIndex: 10,
                    url: "https://www.youtube.com/watch?v=2e9GgUsxak4",
                    placement: "video-bottom",
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-[0.4fr_0.6fr]">
            <div className="grid gap-3">
              <img
                src={project.images[0]}
                alt={`${project.name} visual one`}
                className="h-[clamp(130px,16vw,230px)] w-full rounded-[28px] object-cover project-image sm:rounded-[40px] md:rounded-[50px]"
              />
              <img
                src={project.images[1]}
                alt={`${project.name} visual two`}
                className="h-[clamp(160px,22vw,340px)] w-full rounded-[28px] object-cover project-image sm:rounded-[40px] md:rounded-[50px]"
              />
            </div>
            <img
              src={project.images[2]}
              alt={`${project.name} visual three`}
              className="h-[clamp(300px,40vw,584px)] w-full rounded-[28px] object-cover project-image sm:rounded-[40px] md:rounded-[50px]"
            />
          </div>
        )}
      </motion.article>
    </div>
  );
}

function ProjectsSection() {
  const { language } = useLanguage();

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-ink px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn>
        <h2 className="hero-heading mb-14 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20">
          {localize(language, "Projects", "项目作品")}
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-7xl">
        {projects.slice(0, 6).map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={index}
          />
        ))}
        <ProjectCard project={projects[6]} index={6} />
        <ProjectCard project={projects[7]} index={7} />
      </div>
    </section>
  );
}

function ContactSectionLegacy() {
  const { language } = useLanguage();

  return (
    <section
      id="contact"
      className="relative z-20 flex min-h-[78vh] w-full flex-col items-center justify-center bg-[#f8f7f2] px-5 py-24 text-center text-[#1d1c18] before:absolute before:inset-x-0 before:-top-16 before:h-16 before:bg-gradient-to-b before:from-ink before:to-[#f8f7f2] before:content-[''] sm:px-8 md:py-32"
    >
      <BrainCircuit className="pointer-events-none absolute -left-8 top-[12%] h-[120px] w-[120px] text-[#1d1c18]/[0.08] sm:left-[2%] sm:h-[170px] sm:w-[170px] md:h-[220px] md:w-[220px]" />
      <Mail className="pointer-events-none absolute -right-8 top-[14%] h-[120px] w-[120px] text-[#1d1c18]/[0.08] sm:right-[3%] sm:h-[165px] sm:w-[165px] md:h-[210px] md:w-[210px]" strokeWidth={1.2} />

      <FadeIn className="relative z-10 w-full max-w-6xl">
        <h2 className="font-serif text-[clamp(4rem,13vw,11rem)] italic leading-[0.88] tracking-[-0.055em] text-[#11110f]">
          {localize(language, "Let's Talk", "联系我")}
        </h2>
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 text-base font-medium text-[#1d1c18] sm:mt-14 sm:text-xl md:text-2xl">
          <a
            href="mailto:cwei64368@gmail.com"
            className="border-b border-[#1d1c18]/20 transition hover:border-[#1d1c18] hover:opacity-60"
          >
            cwei64368@gmail.com
          </a>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
            <a
              href="tel:+61432068150"
              className="border-b border-[#1d1c18]/20 transition hover:border-[#1d1c18] hover:opacity-60"
            >
              +61 432 068 150
            </a>
            <a
              href="tel:+8615811161833"
              className="border-b border-[#1d1c18]/20 transition hover:border-[#1d1c18] hover:opacity-60"
            >
              +86 158 1116 1833
            </a>
          </div>
          <a
            href="https://linkedin.com/in/yushan-wei-angie"
            target="_blank"
            rel="noreferrer"
            className="break-all border-b border-[#1d1c18]/20 transition hover:border-[#1d1c18] hover:opacity-60"
          >
            linkedin.com/in/yushan-wei-angie
          </a>
        </div>
      </FadeIn>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-20 min-h-screen w-full overflow-hidden bg-white text-black"
    >
      <img
        src="/assets/contact-yushan.jpg"
        alt="Portrait of Yushan Wei"
        className="absolute left-[46%] top-[26%] hidden h-[74%] w-[36%] object-cover object-top md:block"
      />

      <FadeIn className="relative z-10 flex min-h-screen w-full flex-col px-5 py-10 sm:px-8 sm:py-14 md:px-10">
        <h2 className="max-w-[14ch] text-left text-[clamp(4rem,13vw,12rem)] font-black uppercase leading-[0.76] tracking-[-0.065em]">
          Let's Talk;
        </h2>

        <div className="mt-6 flex max-w-5xl flex-col items-start gap-1 text-left text-[clamp(1.05rem,2.3vw,2.25rem)] font-bold leading-tight tracking-[-0.025em] sm:mt-8">
          <a href="mailto:cwei64368@gmail.com" className="transition hover:opacity-55">
            Contact: cwei64368@gmail.com
          </a>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <a href="tel:+61432068150" className="transition hover:opacity-55">
              +61 432 068 150
            </a>
            <a href="tel:+8615811161833" className="transition hover:opacity-55">
              +86 158 1116 1833
            </a>
          </div>
          <a
            href="https://linkedin.com/in/yushan-wei-angie"
            target="_blank"
            rel="noreferrer"
            className="transition hover:opacity-55"
          >
            LinkedIn: yushan-wei-angie
          </a>
          <a
            href="https://www.instagram.com/angie.yushan?igsh=d2N2eTltYnRrc3c0&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            className="transition hover:opacity-55"
          >
            Instagram: yushan.angie
          </a>
        </div>

        <img
          src="/assets/contact-yushan.jpg"
          alt="Portrait of Yushan Wei"
          className="mx-auto mt-12 aspect-[3/4] w-[82%] object-cover object-top sm:w-[68%] md:hidden"
        />

        <p className="mt-auto pt-16 text-left text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm">
          Yushan Wei · Design Innovation &amp; Technology
        </p>
      </FadeIn>
    </section>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";

    const savedLanguage = window.localStorage.getItem("portfolio-language");
    if (savedLanguage === "en" || savedLanguage === "zh") {
      return savedLanguage;
    }

    return window.navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem("portfolio-language", language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <main className="main-wrapper" lang={language === "zh" ? "zh-CN" : "en"}>
        <div className="grain" />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <WorkExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </LanguageContext.Provider>
  );
}
