import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLesson } from "../hooks/useLesson";
import { useLang } from "../hooks/useLang";
import { useHarakat } from "../hooks/useHarakat";
import { useMascot } from "../hooks/useMascot";
import { StepStones } from "../components/game/StepStones";
import { WarmupStep } from "../components/lesson/WarmupStep";
import { DiscoverStep } from "../components/lesson/DiscoverStep";
import { BuildSentencesStep } from "../components/lesson/BuildSentencesStep";
import { MemoryStep } from "../components/lesson/MemoryStep";
import { ReadParagraphStep } from "../components/lesson/ReadParagraphStep";
import { PracticeStep } from "../components/lesson/PracticeStep";
import { LessonCompleteScreen } from "../components/lesson/LessonCompleteScreen";
import type { MascotPose } from "../context/MascotContext";
import type { LessonStepId } from "../types";
import { encouragementFor } from "../services/encouragements";
import { burstSoft } from "../services/confetti";
import { playSound } from "../services/sound";
import { stopSpeaking } from "../services/speech";

/** Pose « de base » de la mascotte pendant chaque étape. */
const STEP_POSE: Record<LessonStepId, MascotPose> = {
  warmup: "think",
  discover: "idle",
  build: "think",
  memory: "idle",
  read: "idle",
  practice: "wave",
  complete: "celebrate",
};

/**
 * Parcours d'une leçon en mode jeu : la mascotte avance de pierre en pierre
 * (échauffement → 5 étapes) puis l'écran de victoire et le coffre.
 * Le feedback est toujours positif : on encourage, on ne pénalise jamais.
 */
export function LessonPage() {
  const {
    state,
    todaysLesson,
    todaysGift,
    stepId,
    reviewWords,
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
  const { t, dir } = useLang();
  const { showHarakat } = useHarakat();
  const { reaction, say } = useMascot();

  /** Validation d'étape : son joyeux, confettis légers, la mascotte félicite (phrase propre à l'étape). */
  const celebrate = (step: string) => {
    playSound("success");
    burstSoft();
    say(encouragementFor(t, step), "cheer");
  };

  // Remonte en haut à chaque changement d'étape, et coupe l'audio en cours.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    stopSpeaking();
  }, [stepId]);

  const lesson = state.lesson;
  const mascotPose = reaction?.pose ?? STEP_POSE[stepId];
  const mascotMessage = reaction?.message ?? t.mascot.steps[stepId];

  return (
    <div>
      {stepId !== "complete" && <StepStones stepId={stepId} day={state.currentDay} mascotPose={mascotPose} mascotMessage={mascotMessage} />}

      {/* Transition « ressort » entre les étapes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepId}
          initial={{ opacity: 0, x: dir === "rtl" ? -40 : 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: dir === "rtl" ? 40 : -40, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {stepId === "warmup" && (
            <WarmupStep
              reviewWords={reviewWords}
              answers={lesson.warmupAnswers}
              onAnswer={setWarmupAnswer}
              onComplete={() => {
                completeWarmupStep();
                nextStep();
                celebrate("warmup");
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
            <LessonCompleteScreen lesson={todaysLesson} lessonState={lesson} xp={state.xp} streak={state.streak} gift={todaysGift} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
