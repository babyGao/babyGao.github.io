import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import { localePath, type Locale } from "../../lib/i18n";
import { home } from "../../content/site";

/**
 * 首页那张深色卡片：中间是一句话和一个按钮，四周散落着小图和几个问题，
 * 用细线连起来。对应参考站首页 "built on hard questions" 那一屏。
 *
 * 坐标都是卡片宽高的百分比。中间 26%~74% 留空给文字，图和问题只放在两侧。
 * 窄屏下整个装饰层会被隐藏，只留中间的文字。
 */

type Spot = { file: string; x: number; y: number; w: number; r: number };

/*
 * 纵向留出两条空带（约 37% 和 78%）给问题文字，小图都排在空带之外，
 * 免得图和字叠在一起。改坐标时记得一起check这两条带还空着。
 */
const LEFT_SPOTS: Spot[] = [
  { file: "spark-summit", x: 8, y: 10, w: 78, r: -4 },
  { file: "spark-scroll", x: 20, y: 22, w: 62, r: 3 },
  { file: "spark-fragment", x: 5, y: 52, w: 68, r: -2 },
  { file: "spark-utsu", x: 19, y: 64, w: 58, r: 4 },
  { file: "spark-falls", x: 9, y: 90, w: 70, r: -3 },
];

const RIGHT_SPOTS: Spot[] = [
  { file: "spark-plan", x: 90, y: 10, w: 74, r: 3 },
  { file: "spark-fish", x: 78, y: 22, w: 60, r: -3 },
  { file: "spark-sampler", x: 94, y: 52, w: 64, r: 2 },
  { file: "spark-panel", x: 80, y: 64, w: 58, r: -4 },
  { file: "spark-dragon", x: 90, y: 90, w: 58, r: 4 },
];

/** 四个问题挂在哪儿，side 决定它贴左边还是贴右边 */
const LABEL_SPOTS = [
  { side: "left" as const, x: 3, y: 37 },
  { side: "left" as const, x: 4, y: 78 },
  { side: "right" as const, x: 3, y: 37 },
  { side: "right" as const, x: 4, y: 78 },
];

export function Constellation({ lang }: { lang: Locale }) {
  const questions = home.spark.questions[lang];

  return (
    <section className="spark">
      <div className="spark-scatter" aria-hidden="true">
        {/*
          连线层。viewBox 是 0..100，配合 preserveAspectRatio="none"
          正好让坐标等于百分比，和下面小图的定位对得上。
        */}
        <svg className="spark-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={toPoints(LEFT_SPOTS)} />
          <polyline points={toPoints(RIGHT_SPOTS)} />
        </svg>

        {[...LEFT_SPOTS, ...RIGHT_SPOTS].map((spot) => (
          <span
            key={spot.file}
            className="spark-thumb"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: `${spot.w}px`,
              height: `${Math.round(spot.w * 1.12)}px`,
              transform: `translate(-50%, -50%) rotate(${spot.r}deg)`,
            }}
          >
            <Image
              src={`/art/${spot.file}.jpg`}
              alt=""
              width={spot.w}
              height={Math.round(spot.w * 1.12)}
            />
          </span>
        ))}

        {questions.slice(0, LABEL_SPOTS.length).map((question, index) => {
          const spot = LABEL_SPOTS[index];
          return (
            <span
              key={question}
              className={`spark-question spark-question-${spot.side}`}
              style={
                spot.side === "left"
                  ? { left: `${spot.x}%`, top: `${spot.y}%` }
                  : { right: `${spot.x}%`, top: `${spot.y}%` }
              }
            >
              {question}
            </span>
          );
        })}
      </div>

      <div className="spark-center">
        <h2>{home.spark.title[lang]}</h2>
        <p>{home.spark.lead[lang]}</p>
        <Link className="button button-light" href={localePath(lang, "research")}>
          {home.spark.action[lang]}
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

function toPoints(spots: Spot[]): string {
  return spots.map((spot) => `${spot.x},${spot.y}`).join(" ");
}
