import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import { localePath, type Locale } from "../../lib/i18n";
import { home } from "../../content/site";

/**
 * 首页深色画面：中央放标题，两侧用馆藏图片与细线串联研究主题。
 *
 * 坐标相对于固定画布。展开时只改变裁切范围，图片与文字不随之缩放或移动。
 * 靠近中央的图片从初始状态可见，外围图片随着两侧展开逐步显露。
 */

type Spot = { file: string; x: number; y: number; w: number; r: number };

/*
 * 纵向留出两条空带（约 37% 和 78%）给问题文字，小图都排在空带之外，
 * 免得图和字叠在一起。改坐标时记得一起check这两条带还空着。
 */
const LEFT_SPOTS: Spot[] = [
  { file: "spark-summit", x: 8, y: 10, w: 94, r: -4 },
  { file: "post-parallel-geometry", x: 30, y: 22, w: 78, r: 3 },
  { file: "spark-fragment", x: 17, y: 52, w: 82, r: -2 },
  { file: "research-botanical-study", x: 29, y: 64, w: 72, r: 4 },
  { file: "post-visual-glass", x: 9, y: 90, w: 86, r: -3 },
];

const RIGHT_SPOTS: Spot[] = [
  { file: "spark-plan", x: 90, y: 10, w: 90, r: 3 },
  { file: "spark-fish", x: 70, y: 22, w: 76, r: -3 },
  { file: "spark-sampler", x: 83, y: 52, w: 80, r: 2 },
  { file: "spark-panel", x: 71, y: 64, w: 74, r: -4 },
  { file: "spark-dragon", x: 91, y: 90, w: 74, r: 4 },
];

/** 四个问题挂在哪儿，side 决定它贴左边还是贴右边 */
const LABEL_SPOTS = [
  { side: "left" as const, x: 23, y: 37 },
  { side: "left" as const, x: 23, y: 78 },
  { side: "right" as const, x: 23, y: 37 },
  { side: "right" as const, x: 23, y: 78 },
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
