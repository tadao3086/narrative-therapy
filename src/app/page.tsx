"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { StoryData } from "./data/stories";
import { BASE_STORIES, GUIDES, ITEMS, ENDINGS } from "./data/storyModules";

type AppState = "home" | "interview" | "loading" | "story";

const QUESTIONS = [
  {
    id: "fear",
    text: "今、あなたが一番「怖い」と感じていることは何ですか？",
    type: "select",
    options: [
      { value: "", label: "選択してください" },
      { value: "failure", label: "失敗して笑われること" },
      { value: "rejection", label: "本当の自分を出して拒絶されること" },
      { value: "trust", label: "誰かを信じて裏切られること" },
    ]
  },
  {
    id: "facade",
    text: "その恐れを隠すために、普段どんな態度をとってしまいますか？",
    type: "select",
    options: [
      { value: "", label: "選択してください" },
      { value: "perfection", label: "完璧なふりをして隙を見せない" },
      { value: "cynical", label: "冷めたふりをして何にも期待しない" },
      { value: "clown", label: "道化を演じて本音をごまかす" },
    ]
  },
  {
    id: "keyword",
    text: "今の気持ちを表す「キーワード」を一つ教えてください。",
    type: "text",
    placeholder: "例：空虚、焦り、透明人間、仮面"
  }
];

// --- プロシージャルストーリー生成ロジック ---
const generateProceduralStory = (answers: Record<string, string>): StoryData => {
  const fear = answers["fear"] || "failure";
  const keyword = answers["keyword"] || "不安";

  const base = BASE_STORIES[fear] || BASE_STORIES["failure"];
  
  // ランダムパーツの抽出
  const guide = GUIDES[Math.floor(Math.random() * GUIDES.length)];
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const endingTemplate = ENDINGS[Math.floor(Math.random() * ENDINGS.length)];

  // キーワードの置換
  const finalEnding = endingTemplate.replace(/{keyword}/g, keyword);

  // あらすじの合成
  const synopsis = `${base.synopsis_intro}\n\n空虚な日々の中、主人公はある日、奇妙な存在に出会う。\n${guide.desc}\n${guide.text}\nさらに、その手には「${item}」が握られていた。`;

  // クライマックスの合成
  const climax = `${base.climax_intro}\n\n目の前には、かつて恐れていたはずの【${base.shadowCharacter.name}】が立ち塞がる。\nしかし、不思議な導き手である【${guide.name}】がくれた「${item}」が、主人公に小さな勇気を与えた。`;

  return {
    title: base.title,
    catchphrase: base.catchphrase,
    synopsis: synopsis,
    theme: base.theme,
    characters: [
      base.mainCharacter,
      { name: guide.name, desc: guide.desc },
      base.shadowCharacter
    ],
    climax: climax,
    ending: finalEnding
  };
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("home");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [storyData, setStoryData] = useState<StoryData | null>(null);

  const handleStart = () => {
    setAppState("interview");
  };

  const handleAnswerChange = (val: string) => {
    const q = QUESTIONS[currentQuestionIdx];
    setAnswers(prev => ({ ...prev, [q.id]: val }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      generateStory();
    }
  };

  const generateStory = () => {
    setAppState("loading");
    setTimeout(() => {
      // プロシージャル生成（ランダム＋キーワード置換）を実行
      const story = generateProceduralStory(answers);
      setStoryData(story);
      setAppState("story");
    }, 4000);
  };

  const handleReset = () => {
    setAppState("home");
    setCurrentQuestionIdx(0);
    setAnswers({});
    setStoryData(null);
  };

  const isCurrentAnswerValid = () => {
    const q = QUESTIONS[currentQuestionIdx];
    const ans = answers[q.id];
    return ans !== undefined && ans.trim() !== "";
  };

  return (
    <main className={styles.main}>
      {appState === "home" && (
        <div className={styles.animateFadeIn}>
          <h1 className={styles.title}>Shadow Tale</h1>
          <p className={styles.subtitle}>
            あなたの心の奥にある傷や恐れを投影し、価値観が反転した世界で小さな一歩を踏み出す童話を生成します。
          </p>
          <button className={styles.startButton} onClick={handleStart}>
            物語を紡ぐ
          </button>
        </div>
      )}

      {appState === "interview" && (
        <div className={styles.interviewContainer}>
          <div className={`${styles.questionCard} glass-panel`}>
            <span className={styles.questionNumber}>
              Question {currentQuestionIdx + 1} / {QUESTIONS.length}
            </span>
            <h2 className={styles.questionText}>
              {QUESTIONS[currentQuestionIdx].text}
            </h2>
            
            {QUESTIONS[currentQuestionIdx].type === "select" ? (
              <select 
                className={styles.selectInput}
                value={answers[QUESTIONS[currentQuestionIdx].id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
              >
                {QUESTIONS[currentQuestionIdx].options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input 
                type="text"
                className={styles.textInput}
                placeholder={QUESTIONS[currentQuestionIdx].placeholder}
                value={answers[QUESTIONS[currentQuestionIdx].id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isCurrentAnswerValid()) {
                    handleNextQuestion();
                  }
                }}
              />
            )}

            <div className={styles.actionRow}>
              <button 
                className={styles.nextButton}
                onClick={handleNextQuestion}
                disabled={!isCurrentAnswerValid()}
              >
                {currentQuestionIdx === QUESTIONS.length - 1 ? "生成する" : "次へ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {appState === "loading" && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>
            あなたの感情を読み解き、反転した世界を構築しています...
          </p>
        </div>
      )}

      {appState === "story" && storyData && (
        <div className={`${styles.storyContainer} glass-panel animate-fade-in`}>
          <h2 className={styles.storyTitle}>{storyData.title}</h2>
          <p className={styles.catchphrase}>{storyData.catchphrase}</p>
          
          <h3 className={styles.sectionTitle}>あらすじ</h3>
          {storyData.synopsis.split('\\n').map((paragraph, idx) => (
            <p key={`synopsis-${idx}`} className={styles.storyParagraph}>{paragraph}</p>
          ))}

          <h3 className={styles.sectionTitle}>物語のテーマ</h3>
          {storyData.theme.split('\\n').map((paragraph, idx) => (
            <p key={`theme-${idx}`} className={styles.storyParagraph}>{paragraph}</p>
          ))}

          <h3 className={styles.sectionTitle}>主要キャラクター</h3>
          <div className={styles.characterList}>
            {storyData.characters.map((char, idx) => (
              <div key={idx} className={styles.characterItem}>
                <div className={styles.characterName}>{char.name}</div>
                <div className={styles.characterDesc}>{char.desc}</div>
              </div>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>クライマックス</h3>
          {storyData.climax.split('\\n').map((paragraph, idx) => (
            <p key={`climax-${idx}`} className={styles.storyParagraph}>{paragraph}</p>
          ))}

          <h3 className={styles.sectionTitle}>ラストシーン</h3>
          {storyData.ending.split('\\n').map((paragraph, idx) => (
            <p key={`ending-${idx}`} className={styles.storyParagraph}>{paragraph}</p>
          ))}

          <button className={styles.resetButton} onClick={handleReset}>
            もう一度、自分の心と向き合う
          </button>
        </div>
      )}
    </main>
  );
}
