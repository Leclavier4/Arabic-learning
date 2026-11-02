import { useCallback, useEffect, useState } from "react";
import { useLesson } from "../hooks/useLesson";
import { useLang } from "../hooks/useLang";
import { useHarakat } from "../hooks/useHarakat";
import { StepProgressHeader } from "../components/lesson/StepProgressHeader";
import { WarmupStep } from "../components/lesson/WarmupStep";
import { DiscoverStep } from "../components/lesson/DiscoverStep";
import { BuildSentencesStep } from "../components/lesson/BuildSentencesStep";
import { MemoryStep } from "../components/lesson/MemoryStep";
import { ReadParagraphStep } from "../components/lesson/ReadParagraphStep";
import { PracticeStep } from "../components/lesson/PracticeStep";
import { LessonCompleteScreen } from "../components/lesson/LessonCompleteScreen";
import { Toast } from "../components/ui/Toast";
import { encouragementFor } from "../services/encouragements";
import { burstSoft } from "../services/confetti";
import { stopSpeaking } from "../services/speech";

/** Parcours d'une leçon : échauffement → 5 étapes obligatoires → écran final + cadeau. */
export function LessonPage() {
  const {
    state,
    todaysLesson,
    todaysGift,
    stepId,
    reviewWords,
    progressFraction,
    nextStep,
    toggleFlipped,
    completeDiscoverStep,
    setSentence,
    completeBuildStep,
    selectMemoryWord,
    setMemoryText,
    saveMemory,
    completeReadStep,
    completeLesson,
    setWarmupAnswer,
    completeWarmupStep,
  } = useLesson();
  const { t } = useLang();
  const { showHarakat } = useHarakat();

  const [message, setMessage] = useState<string | null>(null);
  const clearMessage = useCallback(() => setMessage(null), []);
  const celebrate = (step: string) => {
    setMessage(encouragementFor(t, step));
    burstSoft();
  };

  // Remonte en haut à chaque changement d'étape, et coupe l'audio en cours.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    stopSpeaking();
  }, [stepId]);

  const lesson = state.lesson;

  return (
    <div>
      <Toast message={message} onDone={clearMessage} />

      {stepId !== "complete" && <StepProgressHeader stepId={stepId} fraction={progressFraction} day={state.currentDay} />}

      {stepId === "warmup" && (
        <WarmupStep
          reviewWords={reviewWords}
          answers={lesson.warmupAnswers}
          onAnswer={setWarmupAnswer}
          onComplete={() => {
            completeWarmupStep();
            nextStep();
            if (reviewWords.length) celebrate("warmup");
          }}
        />
      )}

      {stepId === "discover" && (
        <DiscoverStep
          words={todaysLesson.words}
          flippedWords={lesson.flippedWords}
          onFlip={toggleFlipped}
          onComplete={() => {
            completeDiscoverStep();
            nextStep();
            celebrate("discover");
          }}
        />
      )}

      {stepId === "build" && (
        <BuildSentencesStep
          words={todaysLesson.words}
          sentences={lesson.sentences}
          onChange={setSentence}
          onComplete={() => {
            completeBuildStep();
            nextStep();
            celebrate("build");
          }}
        />
      )}

      {stepId === "memory" && (
        <MemoryStep
          words={todaysLesson.words}
          memoryWord={lesson.memoryWord}
          memoryText={lesson.memoryText}
          alreadySaved={lesson.xpAwardedSteps.includes("memory")}
          onSelectWord={selectMemoryWord}
          onChangeText={setMemoryText}
          onSave={() => {
            saveMemory();
            celebrate("memory");
          }}
          onComplete={nextStep}
        />
      )}

      {stepId === "read" && (
        <ReadParagraphStep
          words={todaysLesson.words}
          readDone={lesson.readDone}
          onMarkRead={() => {
            completeReadStep();
            celebrate("read");
          }}
          onContinue={nextStep}
        />
      )}

      {stepId === "practice" && (
        <PracticeStep
          words={todaysLesson.words}
          onFinish={() => {
            completeLesson({ withoutHarakat: !showHarakat });
            celebrate("practice");
          }}
        />
      )}

      {stepId === "complete" && (
        <LessonCompleteScreen
          lesson={todaysLesson}
          lessonState={lesson}
          xp={state.xp}
          streak={state.streak}
          gift={todaysGift}
        />
      )}
    </div>
  );
}
