<template>
  <main class="onboarding-screen" :dir="isRtl ? 'rtl' : 'ltr'">
    <header class="onboarding-header">
      <a class="onboarding-brand" href="/" aria-label="MedicalStudent.ai home">
        <img src="/logo4.png" alt="Medical Student AI" />
      </a>

      <div class="onboarding-actions" aria-label="Preferences">
        <button class="onboarding-language" type="button">
          {{ activeLanguageLabel }}
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M2 12h20"></path>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>

      </div>
    </header>

    <section class="onboarding-center" aria-labelledby="onboarding-title">
      <div
        id="component"
        class="onboarding-card"
        :class="{ 'is-messaging-step': currentStep === 3 }"
      >
        <template v-if="currentStep === 3">
          <div class="plans-hero">
            <button class="onboarding-back" type="button" aria-label="Back" @click="goToPreviousStep">
              <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </button>

            <div class="plans-hero-content">
              <img class="plans-hero-avatar" :src="selectedAvatar.imageSrc" :alt="agentName" />
              <div class="plans-hero-copy">
                <h1 id="onboarding-title">Start your free trial now</h1>
                <p>&mdash; you won't be charged until it ends.</p>
              </div>
            </div>
          </div>

          <div class="onboarding-body plans-body">
            <div class="plans-grid" role="radiogroup" aria-label="Choose your plan">
              <button
                v-for="plan in planCards"
                :key="plan.id"
                class="plan-card"
                :class="[
                  `is-${plan.id}`,
                  selectedPlan === plan.id ? 'is-selected' : '',
                ]"
                type="button"
                role="radio"
                :aria-checked="selectedPlan === plan.id"
                @click="selectPlan(plan.id)"
              >
                <span class="plan-card-topline">
                  <span>{{ plan.eyebrow }}</span>
                  <span class="plan-icon" aria-hidden="true">
                    <component :is="plan.icon" :size="18" :stroke-width="2" />
                  </span>
                </span>

                <span class="plan-price-row">
                  <span class="plan-price">{{ plan.price }}</span>
                  <span class="plan-cadence">{{ plan.cadence }}</span>
                </span>

                <span class="plan-description">{{ plan.description }}</span>

                <span class="plan-divider" aria-hidden="true"></span>

                <span class="plan-features">
                  <span v-for="feature in plan.features" :key="feature" class="plan-feature">
                    <CheckCircle2 :size="15" :stroke-width="2.2" aria-hidden="true" />
                    <span>{{ feature }}</span>
                  </span>
                </span>

                <span class="plan-card-cta">{{ selectedPlan === plan.id ? "Selected" : "Choose plan" }}</span>
              </button>
            </div>
          </div>

          <footer class="onboarding-footer">
            <p>
              <span aria-hidden="true">&#128161;</span>
              Start with a free trial
            </p>
            <button
              class="onboarding-continue"
              type="button"
              tabindex="0"
              :disabled="!selectedPlan"
              @click="handleContinue"
            >
              <span class="button-spinner-slot" aria-hidden="true">
                <span></span>
              </span>
              {{ selectedPlan ? "Continue" : "Select a plan" }}
            </button>
          </footer>
        </template>

        <template v-else>
        <div class="onboarding-hero" :class="currentStep === 1 ? 'is-intro-step' : 'is-integration-step'">
          <button v-if="currentStep === 2" class="onboarding-back" type="button" aria-label="Back" @click="goToPreviousStep">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
        </div>

        <div v-if="currentStep === 1" class="onboarding-body">
          <div class="onboarding-copy">
            <div class="onboarding-title-row">
              <h1 id="onboarding-title">Hey there, I'm Sina</h1>
            </div>
            <p>
              Your personal AI medical tutor&mdash;here to help you understand complex topics, prepare for any medical
              exam, and study smarter.
            </p>
          </div>

          <div class="onboarding-field">
            <label id="onboarding-language-label" for="onboarding-language-select">
              Which language should we use to communicate?
            </label>

            <div class="onboarding-select-wrap">
              <select id="onboarding-language-select" v-model="selectedLanguage" aria-labelledby="onboarding-language-label">
                <option v-for="language in languages" :key="language.value" :value="language.value">
                  {{ language.label }}
                </option>
              </select>
              <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </div>

            <p>
              After selecting a language, AI responses will use that language, and the interface language will also sync
            </p>
          </div>
        </div>

        <div v-else class="onboarding-body">
          <div class="onboarding-copy">
            <div class="onboarding-title-row">
              <h1 id="onboarding-title">{{ activeCopy.modeQuestionTitle }}</h1>
            </div>
            <p>{{ activeCopy.modeQuestionDescription }}</p>
          </div>

          <div class="integration-list-wrap" role="presentation">
            <div class="integration-list" role="radiogroup" :aria-label="activeCopy.modeGroupLabel">
              <div class="integration-items" role="presentation">
                <div
                  v-for="mode in usageModes"
                  :key="mode.id"
                  class="integration-item-shell"
                  :class="{ 'is-expanded': mode.id === 'clinic' && selectedUsageMode === 'clinic' }"
                >
                  <button
                    class="integration-item usage-mode-option"
                    :class="{ 'is-selected': selectedUsageMode === mode.id }"
                    type="button"
                    role="radio"
                    :aria-checked="selectedUsageMode === mode.id"
                    :aria-expanded="mode.id === 'clinic' ? selectedUsageMode === 'clinic' : undefined"
                    :aria-label="`${mode.name}: ${mode.description}`"
                    @click="selectUsageMode(mode.id)"
                  >
                    <div class="integration-main">
                      <div class="integration-icon">
                        <component
                          :is="mode.icon"
                          class="mode-lucide-icon"
                          :class="mode.iconClass"
                          :size="18"
                          :stroke-width="2"
                          aria-hidden="true"
                        />
                      </div>

                      <div class="integration-copy">
                        <div class="integration-name">{{ mode.name }}</div>
                        <div class="integration-description">{{ mode.description }}</div>
                      </div>
                    </div>

                    <span class="mode-radio-indicator" aria-hidden="true">
                      <span></span>
                    </span>
                  </button>

                  <Transition name="clinic-preview">
                    <div
                      v-if="mode.id === 'clinic' && selectedUsageMode === 'clinic'"
                      class="clinic-preview-wrap"
                      role="region"
                      :aria-label="clinicPreviewRegionLabel"
                    >
                      <div class="clinic-preview-inner">
                        <div
                          class="clinic-preview-open"
                          role="button"
                          tabindex="0"
                          :aria-label="clinicPreviewExpandLabel"
                          @click="toggleClinicPreviewModal"
                          @keydown.enter.prevent="toggleClinicPreviewModal"
                          @keydown.space.prevent="toggleClinicPreviewModal"
                        >
                          <DemoPreviewFrame
                            :key="`clinic-preview-${clinicPreviewReplayKey}-${selectedLanguage}`"
                            :src="clinicPreviewSrc"
                            :title="clinicPreviewFrameTitle"
                            variant="inline"
                          />
                          <span class="clinic-preview-expand" aria-hidden="true">
                            <Maximize2 :size="15" :stroke-width="2" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
            <div class="integration-scrollbar" aria-hidden="true">
              <div></div>
            </div>
          </div>
        </div>

        <footer class="onboarding-footer">
          <p>
            <span aria-hidden="true">&#128161;</span>
            {{ activeCopy.editLater }}
          </p>
          <button class="onboarding-continue" type="button" tabindex="0" @click="handleContinue">
            <span class="button-spinner-slot" aria-hidden="true">
              <span></span>
            </span>
            {{ activeCopy.continue }}
          </button>
        </footer>
        </template>
      </div>
    </section>
  </main>

  <Teleport to="body">
    <Transition name="clinic-preview-modal">
      <div
        v-if="isClinicPreviewModalOpen"
        class="clinic-preview-modal-backdrop"
        role="presentation"
        @click.self="closeClinicPreviewModal"
      >
        <div
          class="clinic-preview-modal"
          role="dialog"
          aria-modal="true"
          :aria-label="clinicPreviewModalLabel"
          @click.stop="toggleClinicPreviewModal"
        >
          <button
            ref="clinicPreviewCloseButton"
            class="clinic-preview-modal-close"
            type="button"
            :aria-label="clinicPreviewCloseLabel"
            @click.stop="closeClinicPreviewModal"
          >
            <X :size="20" :stroke-width="2" />
          </button>

          <DemoPreviewFrame
            :key="`clinic-preview-modal-${clinicPreviewReplayKey}-${selectedLanguage}`"
            :src="clinicPreviewSrc"
            :title="clinicPreviewFrameTitle"
            variant="expanded"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { BookOpen, CheckCircle2, Crown, Maximize2, MessageSquare, Sparkles, Stethoscope, X } from "lucide-vue-next";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Component } from "vue";
import DemoPreviewFrame from "./DemoPreviewFrame.vue";

interface LanguageOption {
  label: string;
  value: string;
}

type UsageModeId = "study" | "clinic" | "general-questions";
type PlanTier = "pro" | "clinics";

interface UsageModeOption {
  id: UsageModeId;
  name: string;
  description: string;
  icon: Component;
  iconClass: string;
}

interface ClinicPreviewStep {
  id: string;
  stepLabel: string;
  title: string;
  description: string;
}

interface PlanCard {
  id: PlanTier;
  eyebrow: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  icon: Component;
}

const route = useRoute();
const router = useRouter();
const selectedLanguage = ref("en-US");
const agentName = ref("Sina");
const selectedUsageMode = useState<UsageModeId>("onboarding-usage-mode", () => "study");
const selectedPlan = ref<PlanTier | null>(null);
const clinicPreviewReplayKey = ref(0);
const isClinicPreviewModalOpen = ref(false);
const clinicPreviewCloseButton = ref<HTMLButtonElement | null>(null);
let clinicPreviewReplayTimer: ReturnType<typeof window.setTimeout> | undefined;
let previousBodyOverflow = "";

const currentStep = computed<1 | 2 | 3>(() => {
  if (route.query.step === "1") {
    return 1;
  }

  if (route.query.step === "3" || route.query.step === "4") {
    return 3;
  }

  return 2;
});

const languages: LanguageOption[] = [
  { label: "English", value: "en-US" },
  { label: "العربية", value: "ar" },
  { label: "Turkish", value: "tr" },
  { label: "French", value: "fr" },
  { label: "Spanish", value: "es" },
];

const onboardingTranslations = {
  en: {
    continue: "Continue",
    editLater: "You can edit this later",
    modeQuestionTitle: "How will you use Sina?",
    modeQuestionDescription: "Choose a starting mode so answers and workflows open in the right place.",
    modeGroupLabel: "Choose a usage mode",
    modes: {
      study: {
        name: "Study",
        description: "Learning, review, and question-based practice.",
      },
      clinic: {
        name: "Clinic",
        description:
          "Add patients, start a visit, transcribe notes, generate AVS, and get AI-powered, evidence-based clinical insights—all in one place.",
      },
      generalQuestions: {
        name: "General Questions",
        description: "Broad medical answers and search.",
      },
    },
    clinicPreview: {
      regionLabel: "Clinic mode step 1 preview",
      frameTitle: "Add patient demo animation",
      steps: [
        {
          id: "add-patient",
          stepLabel: "Step 1",
          title: "Add patients and patient data",
          description: "Create a patient card from pasted or uploaded intake details.",
        },
        {
          id: "start-visit",
          stepLabel: "Step 2",
          title: "Start and record a visit",
          description: "Open a visit workspace, start transcription, and record the encounter.",
        },
        {
          id: "generate-note",
          stepLabel: "Step 3",
          title: "Generate notes, summaries, and answers",
          description: "Turn the recording into a SOAP note, After Visit Summary, and clinical Q&A.",
        },
      ],
    },
  },
  ar: {
    continue: "متابعة",
    editLater: "يمكنك تعديل ذلك لاحقا",
    modeQuestionTitle: "كيف ستستخدم سينا؟",
    modeQuestionDescription: "اختر وضع البداية حتى تفتح الإجابات وسير العمل في المكان المناسب.",
    modeGroupLabel: "اختر وضع الاستخدام",
    modes: {
      study: {
        name: "الدراسة",
        description: "تعلم ومراجعة وتدريب قائم على الأسئلة.",
      },
      clinic: {
        name: "العيادة",
        description: "عمل المرضى والملاحظات وسير الزيارات.",
      },
      generalQuestions: {
        name: "أسئلة عامة",
        description: "إجابات طبية عامة وبحث.",
      },
    },
    clinicPreview: {
      regionLabel: "معاينة الخطوة الأولى لوضع العيادة",
      frameTitle: "رسوم متحركة لإضافة مريض",
      steps: [
        {
          id: "add-patient",
          stepLabel: "الخطوة 1",
          title: "أضف المرضى وبياناتهم",
          description: "أنشئ بطاقة مريض من تفاصيل استقبال ملصقة أو مرفوعة.",
        },
        {
          id: "start-visit",
          stepLabel: "الخطوة 2",
          title: "ابدأ وسجل زيارة",
          description: "افتح مساحة عمل الزيارة وابدأ التفريغ وسجل المقابلة.",
        },
        {
          id: "generate-note",
          stepLabel: "Step 3",
          title: "Generate notes, summaries, and answers",
          description: "Turn the recording into a SOAP note, After Visit Summary, and clinical Q&A.",
        },
      ],
    },
  },
} as const;

const activeCopy = computed(() => (selectedLanguage.value === "ar" ? onboardingTranslations.ar : onboardingTranslations.en));
const isRtl = computed(() => selectedLanguage.value === "ar");
const activeLanguageLabel = computed(() => languages.find((language) => language.value === selectedLanguage.value)?.label ?? "English");
const usageModes = computed<UsageModeOption[]>(() => [
  {
    id: "study",
    name: activeCopy.value.modes.study.name,
    description: activeCopy.value.modes.study.description,
    icon: BookOpen,
    iconClass: "mode-icon-study",
  },
  {
    id: "clinic",
    name: activeCopy.value.modes.clinic.name,
    description: activeCopy.value.modes.clinic.description,
    icon: Stethoscope,
    iconClass: "mode-icon-clinic",
  },
  {
    id: "general-questions",
    name: activeCopy.value.modes.generalQuestions.name,
    description: activeCopy.value.modes.generalQuestions.description,
    icon: MessageSquare,
    iconClass: "mode-icon-general",
  },
]);
const clinicPreviewRegionLabel = computed(() => activeCopy.value.clinicPreview.regionLabel);
const clinicPreviewSteps = computed<ClinicPreviewStep[]>(() => [...activeCopy.value.clinicPreview.steps]);
const clinicPreviewFrameTitle = computed(() => activeCopy.value.clinicPreview.frameTitle);
const clinicPreviewExpandLabel = "Expand clinic preview";
const clinicPreviewModalLabel = "Expanded clinic preview";
const clinicPreviewCloseLabel = "Close clinic preview";
const clinicPreviewLanguage = computed(() => (selectedLanguage.value === "ar" ? "ar" : "en"));
const clinicPreviewSrc = computed(
  () => `/clinic-add-patient-demo.html?play=${clinicPreviewReplayKey.value}&lang=${clinicPreviewLanguage.value}`,
);

const selectedAvatar = {
  imageSrc: "/images/onboarding-step-3.png",
};

const planCards: PlanCard[] = [
  {
    id: "pro",
    eyebrow: "PRO",
    price: "$20",
    cadence: "per month",
    description: "Core MedAI access for study, review, and AI tutor workflows.",
    features: ["Full AI Tutor access", "Study Workspace", "Custom question sets", "14-day free trial"],
    icon: Crown,
  },
  {
    id: "clinics",
    eyebrow: "CLINICS",
    price: "$50",
    cadence: "per month",
    description: "For providers to log patients and manage their clinic.",
    features: ["Everything in Pro", "Clinic Workspace", "Patient Scheduler", "AI Scribe", "7-day free trial"],
    icon: Sparkles,
  },
];

const goToFirstStep = () => {
  void router.push({ path: "/onboarding", query: { step: "1" } });
};

const goToSecondStep = () => {
  void router.push({ path: "/onboarding" });
};

const goToThirdStep = () => {
  void router.push({ path: "/onboarding", query: { step: "3" } });
};

const goToPreviousStep = () => {
  if (currentStep.value === 3) {
    goToSecondStep();
    return;
  }

  if (currentStep.value === 2) {
    goToFirstStep();
  }
};

const handleContinue = () => {
  if (currentStep.value === 1) {
    goToSecondStep();
    return;
  }

  if (currentStep.value === 2) {
    goToThirdStep();
    return;
  }

  if (currentStep.value === 3 && selectedPlan.value) {
    void router.push({ path: "/signup", query: { plan: selectedPlan.value } });
  }
};

const selectPlan = (plan: PlanTier) => {
  selectedPlan.value = plan;
};

const clearClinicPreviewReplayTimer = () => {
  if (clinicPreviewReplayTimer) {
    window.clearTimeout(clinicPreviewReplayTimer);
    clinicPreviewReplayTimer = undefined;
  }
};

const replayClinicPreview = () => {
  clearClinicPreviewReplayTimer();
  clinicPreviewReplayKey.value += 1;
};

const selectUsageMode = (mode: UsageModeId) => {
  selectedUsageMode.value = mode;

  if (mode === "clinic") {
    openClinicPreviewModal();
  }
};

const openClinicPreviewModal = () => {
  if (selectedUsageMode.value !== "clinic") {
    return;
  }

  replayClinicPreview();
  isClinicPreviewModalOpen.value = true;
  void nextTick(() => {
    clinicPreviewCloseButton.value?.focus();
  });
};

const closeClinicPreviewModal = () => {
  isClinicPreviewModalOpen.value = false;
};

const toggleClinicPreviewModal = () => {
  if (isClinicPreviewModalOpen.value) {
    closeClinicPreviewModal();
    return;
  }

  openClinicPreviewModal();
};

const handleClinicPreviewKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isClinicPreviewModalOpen.value) {
    closeClinicPreviewModal();
  }
};

const handleClinicPreviewMessage = (event: MessageEvent) => {
  if (event.origin !== window.location.origin || event.data?.type !== "clinic-demo-complete") {
    return;
  }

  if (selectedUsageMode.value !== "clinic") {
    return;
  }

  clearClinicPreviewReplayTimer();
  clinicPreviewReplayTimer = window.setTimeout(() => {
    if (selectedUsageMode.value === "clinic") {
      clinicPreviewReplayKey.value += 1;
    }
  }, 700);
};

watch(selectedUsageMode, (mode) => {
  if (mode === "clinic") {
    if (!isClinicPreviewModalOpen.value) {
      replayClinicPreview();
    }

    return;
  }

  closeClinicPreviewModal();
  clearClinicPreviewReplayTimer();
});

watch(selectedLanguage, () => {
  if (selectedUsageMode.value === "clinic") {
    replayClinicPreview();
  }
});

watch(isClinicPreviewModalOpen, (isOpen) => {
  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
});

onMounted(() => {
  window.addEventListener("message", handleClinicPreviewMessage);
  window.addEventListener("keydown", handleClinicPreviewKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", handleClinicPreviewMessage);
  window.removeEventListener("keydown", handleClinicPreviewKeydown);
  document.body.style.overflow = previousBodyOverflow;
  clearClinicPreviewReplayTimer();
});

</script>

<style scoped>
.onboarding-screen {
  min-height: 100svh;
  color: #09090b;
  background: #ffffff;
  font-family:
    Geist,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI Variable Display",
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "HarmonyOS Sans SC",
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei UI",
    "Microsoft YaHei",
    "Source Han Sans SC",
    "Noto Sans CJK SC",
    ui-sans-serif,
    system-ui,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
  font-size: 14px;
  line-height: 1.625;
  overflow-x: hidden;
}

.onboarding-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 62px;
  padding: 18px 24px 8px;
}

.onboarding-brand {
  display: inline-flex;
  align-items: center;
  width: 146px;
  color: #111111;
  line-height: 1;
  text-decoration: none;
}

.onboarding-brand img {
  display: block;
  width: 100%;
  height: auto;
}

.onboarding-actions {
  display: flex;
  align-items: center;
  gap: 22px;
}

.onboarding-language {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  border: 0;
  border-radius: 8px;
  color: #09090b;
  background: transparent;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  gap: 6px;
  padding: 0 8px;
}

.onboarding-language svg {
  width: 14px;
  height: 14px;
}

.onboarding-language svg,
.onboarding-back svg,
.onboarding-select-wrap svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.onboarding-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 28px 18px 20px;
}

.onboarding-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: min(100%, 600px);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  color: #09090b;
}

.onboarding-card.is-messaging-step {
  gap: 0;
  width: min(100%, 760px);
}

.plans-hero {
  position: relative;
  flex: none;
  min-height: 192px;
  margin: 12px 12px 0;
  overflow: hidden;
  border-radius: 10px;
  background: linear-gradient(90deg, #fcf9f7 0%, #fbf5f3 46%, #f7f1ef 100%);
}

.plans-hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(150px, 210px) minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  min-height: 192px;
  padding: 10px 34px 0 18px;
}

.plans-hero-avatar {
  align-self: end;
  width: 100%;
  max-height: 202px;
  object-fit: contain;
  object-position: center bottom;
}

.plans-hero-copy {
  max-width: 390px;
}

.plans-hero-copy h1 {
  margin: 0;
  color: #09090b;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0;
}

.plans-hero-copy p {
  margin: 10px 0 0;
  color: #52525b;
  font-size: clamp(15px, 1.7vw, 18px);
  font-weight: 500;
  line-height: 1.35;
}

.plans-body {
  gap: 0;
  padding-top: 18px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  min-height: 306px;
  padding: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #0f172a;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.plan-card:hover {
  border-color: rgb(15 23 42 / 28%);
  box-shadow: 0 14px 30px rgb(15 23 42 / 8%);
  transform: translateY(-1px);
}

.plan-card.is-selected {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgb(16 185 129 / 18%), 0 18px 34px rgb(15 23 42 / 10%);
}

.plan-card.is-clinics {
  border-color: transparent;
  color: #ffffff;
  background: linear-gradient(180deg, #1e1b4b 0%, #111827 44%, #0f172a 100%);
}

.plan-card.is-clinics:hover,
.plan-card.is-clinics.is-selected {
  border-color: rgb(255 255 255 / 34%);
}

.plan-card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.plan-card.is-clinics .plan-card-topline {
  color: rgb(255 255 255 / 68%);
}

.plan-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #059669;
  background: rgb(16 185 129 / 10%);
}

.plan-card.is-clinics .plan-icon {
  color: #ffffff;
  background: rgb(255 255 255 / 12%);
}

.plan-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 18px;
}

.plan-price {
  color: currentColor;
  font-size: clamp(38px, 5.4vw, 48px);
  font-weight: 350;
  line-height: 0.95;
}

.plan-cadence {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.plan-card.is-clinics .plan-cadence {
  color: rgb(255 255 255 / 88%);
}

.plan-description {
  min-height: 42px;
  margin-top: 10px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
}

.plan-card.is-clinics .plan-description {
  color: rgb(255 255 255 / 88%);
}

.plan-divider {
  display: block;
  height: 1px;
  margin: 14px 0;
  background: #e2e8f0;
}

.plan-card.is-clinics .plan-divider {
  background: rgb(255 255 255 / 18%);
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.plan-feature {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #475569;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.35;
}

.plan-feature svg {
  flex: 0 0 auto;
  margin-top: 1px;
  color: #059669;
}

.plan-card.is-clinics .plan-feature {
  color: rgb(255 255 255 / 90%);
}

.plan-card.is-clinics .plan-feature svg {
  color: rgb(255 255 255 / 90%);
}

.plan-card-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 34px;
  margin-top: auto;
  padding: 0 13px;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  color: #047857;
  background: #ecfdf5;
  font-size: 12.5px;
  font-weight: 750;
  line-height: 1;
}

.plan-card.is-clinics .plan-card-cta {
  border-color: rgb(255 255 255 / 24%);
  color: #ffffff;
  background: rgb(255 255 255 / 12%);
}

.messaging-hero {
  position: relative;
  flex: none;
  aspect-ratio: 3;
  margin: 12px 12px 0;
  overflow: hidden;
  background-position: 50%;
  background-size: cover;
}

.messaging-hero-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 20px;
  padding: 0 56px 24px 0;
}

.messaging-hero-avatar {
  flex: 0 0 auto;
  align-self: flex-start;
  height: 150%;
  object-fit: contain;
  object-position: center top;
}

.messaging-quote {
  color: #09090b;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
}

.messaging-quote strong {
  color: #09090b;
  font-weight: 700;
}

.messaging-quote-mark {
  position: absolute;
  inset-block-start: 26%;
  inset-inline-end: 24px;
  color: rgb(245 158 11 / 44%);
  font-family: Georgia, serif;
  font-size: 60px;
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
}

.messenger-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.messenger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  padding: 4px 0;
}

.messenger-main {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.messenger-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.messenger-icon svg {
  display: inline;
  flex: none;
  width: 20px;
  height: 20px;
  line-height: 1;
}

.messenger-name {
  color: #09090b;
  font-size: 14px;
  font-weight: 500;
}

.messenger-connect {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  gap: 6px;
  border-radius: 10px;
  color: #09090b;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 150ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 150ms cubic-bezier(0.32, 0.72, 0, 1);
}

.messenger-connect:hover {
  color: #262626;
}

.messenger-connect:active {
  transform: translateY(1px);
}

.fill-rose {
  fill: #e11d48;
}

.fill-sky,
.fill-telegram {
  fill: #38bdf8;
}

.fill-emerald {
  fill: #10b981;
}

.fill-amber {
  fill: #fbbf24;
}

.fill-discord {
  fill: #6366f1;
}

.local-agents-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
}

.local-agents-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.local-agents-title {
  color: #09090b;
  font-size: 14px;
  font-weight: 600;
}

.local-agents-description {
  color: #a3a3a3;
  font-size: 12px;
  line-height: 1.55;
}

.local-agents-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.local-agents-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.local-agent-icons {
  display: flex;
  gap: 8px;
}

.local-agent-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.local-agent-badge {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  overflow: hidden;
  border-radius: 50%;
}

.local-agent-badge svg {
  width: 20px;
  height: 20px;
  transform: scale(0.7);
}

.claude-badge {
  color: #d97757;
  background: #09090b;
}

.claude-badge svg {
  fill: currentColor;
}

.codex-badge {
  background: #ffffff;
  box-shadow: inset 0 0 4px rgb(0 0 0 / 14%);
}

.local-agents-note {
  max-width: 310px;
  color: #a3a3a3;
  font-size: 12px;
  line-height: 1.55;
}

.onboarding-hero {
  position: relative;
  flex: none;
  aspect-ratio: 3;
  margin: 12px 12px 0;
  overflow: hidden;
  border-radius: 10px;
  background-position: 50%;
  background-size: cover;
}

.onboarding-hero.is-intro-step {
  background-image: url("/images/onboarding-step-1.png");
}

.onboarding-hero.is-integration-step {
  background-image: url("/images/onboarding-step-2.png");
}

.onboarding-back {
  position: absolute;
  z-index: 3;
  inset-block-start: 12px;
  inset-inline-start: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  color: #09090b;
  background: rgb(255 255 255 / 74%);
  box-shadow: 0 6px 18px rgb(24 24 27 / 16%);
  backdrop-filter: saturate(150%) blur(10px);
  cursor: pointer;
  transition:
    background-color 150ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 150ms cubic-bezier(0.32, 0.72, 0, 1);
}

.onboarding-back:hover {
  background: rgb(255 255 255 / 90%);
}

.onboarding-back:active {
  transform: translateY(1px);
}

.onboarding-back svg {
  width: 16px;
  height: 16px;
}

.onboarding-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  padding: 24px;
}

.onboarding-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.onboarding-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.onboarding-copy h1 {
  margin: 0 0 12px;
  color: #09090b;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0;
}

.onboarding-copy p,
.onboarding-field p,
.onboarding-footer p {
  margin: 0;
  color: #78716c;
}

.onboarding-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.onboarding-field label {
  color: #09090b;
  font-weight: 700;
}

.onboarding-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.onboarding-select-wrap select {
  width: 100%;
  min-height: 32px;
  padding: 4px 34px 4px 12px;
  border: 0;
  appearance: none;
  color: #09090b;
  background: transparent;
  font: inherit;
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
}

.onboarding-select-wrap svg {
  position: absolute;
  right: 12px;
  width: 14px;
  height: 14px;
  color: #78716c;
  pointer-events: none;
}

.onboarding-field p {
  color: #a3a3a3;
  font-size: 12px;
  line-height: 1.55;
}

.integration-list-wrap {
  position: relative;
  margin-inline-end: -24px;
}

.integration-list {
  position: relative;
  overflow: visible;
  scrollbar-width: none;
}

.integration-list::-webkit-scrollbar {
  display: none;
}

.integration-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: fit-content;
  padding-inline-end: 24px;
  color: #09090b;
  font-size: 12px;
  line-height: 1.5rem;
}

.integration-item-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.integration-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  padding: 4px 0;
}

.usage-mode-option {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.usage-mode-option:hover .integration-name {
  color: #262626;
}

.integration-main {
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: 0;
  gap: 12px;
  overflow: hidden;
}

.integration-icon {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 3px;
  border-radius: 6px;
}

.integration-icon img {
  display: inline;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.integration-icon-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #09090b;
  line-height: 0;
}

.integration-icon-svg svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

.mode-lucide-icon {
  display: block;
  width: 18px;
  height: 18px;
}

.mode-icon-study {
  color: #10b981;
}

.mode-icon-clinic {
  color: #38bdf8;
}

.mode-icon-general {
  color: #6366f1;
}

.integration-copy {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  gap: 2px;
  overflow: hidden;
}

.integration-name {
  color: #09090b;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

.integration-description {
  color: #a3a3a3;
  font-size: 12px;
  line-height: 1.7;
}

.mode-radio-indicator {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid #d4d4d8;
  border-radius: 50%;
  background: #ffffff;
  transition:
    border-color 150ms cubic-bezier(0.32, 0.72, 0, 1),
    background-color 150ms cubic-bezier(0.32, 0.72, 0, 1);
}

.mode-radio-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffffff;
  opacity: 0;
  transition: opacity 150ms cubic-bezier(0.32, 0.72, 0, 1);
}

.usage-mode-option.is-selected .mode-radio-indicator {
  border-color: #27272a;
  background: #27272a;
}

.usage-mode-option.is-selected .mode-radio-indicator span {
  opacity: 1;
}

.clinic-preview-wrap {
  display: grid;
  grid-template-rows: 1fr;
  overflow: hidden;
  padding-block-start: 8px;
  padding-inline-start: 36px;
  padding-inline-end: 12px;
  opacity: 1;
  transform: translateY(0);
  transition:
    grid-template-rows 420ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 260ms ease,
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.clinic-preview-enter-from,
.clinic-preview-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(-6px);
}

.clinic-preview-enter-active,
.clinic-preview-leave-active {
  transition:
    grid-template-rows 420ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease,
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.clinic-preview-inner {
  display: grid;
  min-height: 0;
  padding: 0 0 10px;
}

.clinic-preview-demo {
  position: relative;
  min-height: 0;
}

.clinic-preview-open {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  color: #09090b;
  cursor: zoom-in;
  transition:
    filter 180ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 180ms cubic-bezier(0.32, 0.72, 0, 1);
}

.clinic-preview-open:hover {
  filter: brightness(0.98);
  transform: translateY(-1px);
}

.clinic-preview-open:active {
  transform: translateY(0);
}

.clinic-preview-open :deep(iframe) {
  pointer-events: none;
}

.clinic-preview-modal :deep(iframe) {
  pointer-events: none;
}

.clinic-preview-expand {
  position: absolute;
  inset-block-start: 10px;
  inset-inline-end: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid rgb(255 255 255 / 78%);
  border-radius: 8px;
  color: #18181b;
  background: rgb(255 255 255 / 82%);
  box-shadow: 0 8px 24px rgb(24 24 27 / 16%);
  backdrop-filter: saturate(150%) blur(10px);
}

.clinic-preview-modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(18px, 4vw, 48px);
  background: rgb(9 9 11 / 74%);
  backdrop-filter: blur(8px);
}

.clinic-preview-modal {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}

.clinic-preview-modal-close {
  position: absolute;
  z-index: 2;
  inset-block-start: 12px;
  inset-inline-end: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 10px;
  color: #18181b;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 14px 34px rgb(0 0 0 / 22%);
  cursor: pointer;
  transition:
    background-color 150ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 150ms cubic-bezier(0.32, 0.72, 0, 1);
}

.clinic-preview-modal-close:hover {
  background: #ffffff;
}

.clinic-preview-modal-close:active {
  transform: translateY(1px);
}

.clinic-preview-modal-enter-active,
.clinic-preview-modal-leave-active {
  transition: opacity 180ms ease;
}

.clinic-preview-modal-enter-active .clinic-preview-modal,
.clinic-preview-modal-leave-active .clinic-preview-modal {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.clinic-preview-modal-enter-from,
.clinic-preview-modal-leave-to {
  opacity: 0;
}

.clinic-preview-modal-enter-from .clinic-preview-modal,
.clinic-preview-modal-leave-to .clinic-preview-modal {
  transform: scale(0.97);
}

.integration-scrollbar {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  width: 4px;
  margin: 4px 0;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  opacity: 0;
}

.integration-scrollbar div {
  width: 100%;
  height: 176px;
  border-radius: inherit;
}

.onboarding-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0;
  padding: 16px 24px;
}

.onboarding-footer p {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #a3a3a3;
  font-size: 12px;
  line-height: 1.55;
}

.onboarding-continue {
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  min-width: 86px;
  height: 32px;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  color: #fafaf9;
  background: #27272a;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 150ms cubic-bezier(0.32, 0.72, 0, 1),
    color 150ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 150ms cubic-bezier(0.32, 0.72, 0, 1);
}

.onboarding-continue:hover {
  background: #18181b;
}

.onboarding-continue:disabled {
  background: #86efac;
  cursor: default;
  transform: none;
}

.onboarding-continue:active {
  transform: translateY(1px);
}

.button-spinner-slot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0;
  margin-right: -6px;
  overflow: hidden;
  opacity: 0;
  transition:
    opacity 380ms cubic-bezier(0.22, 1, 0.36, 1),
    width 380ms cubic-bezier(0.22, 1, 0.36, 1),
    margin-right 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.button-spinner-slot span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: base-button-spin 0.6s linear infinite;
}

.onboarding-language:focus-visible,
.onboarding-back:focus-visible,
.onboarding-select-wrap select:focus-visible,
.usage-mode-option:focus-visible,
.plan-card:focus-visible,
.clinic-preview-open:focus-visible,
.clinic-preview-modal-close:focus-visible,
.messenger-connect:focus-visible,
.onboarding-continue:focus-visible {
  outline: 2px solid #09090b;
  outline-offset: 3px;
}

@media (max-width: 760px) {
  .onboarding-header {
    padding: 18px 18px 8px;
  }

  .onboarding-center {
    justify-content: flex-start;
    padding-top: 26px;
  }

  .onboarding-card.is-messaging-step {
    width: min(100%, 640px);
  }

  .plans-hero-content {
    grid-template-columns: minmax(128px, 170px) minmax(0, 1fr);
    gap: 14px;
    padding-right: 22px;
  }
}

@media (max-width: 520px) {
  .onboarding-actions {
    gap: 12px;
  }

  .onboarding-brand {
    width: 128px;
  }

  .onboarding-card {
    border-radius: 10px;
  }

  .onboarding-hero {
    margin: 10px 10px 0;
  }

  .plans-hero {
    min-height: 176px;
    margin: 10px 10px 0;
  }

  .plans-hero-content {
    grid-template-columns: 128px minmax(0, 1fr);
    min-height: 176px;
    gap: 10px;
    padding: 8px 16px 0 10px;
  }

  .plans-hero-avatar {
    max-height: 176px;
  }

  .plans-hero-copy h1 {
    font-size: 22px;
  }

  .plans-hero-copy p {
    margin-top: 8px;
    font-size: 13px;
  }

  .onboarding-body,
  .onboarding-footer {
    padding-right: 18px;
    padding-left: 18px;
  }

  .onboarding-copy h1 {
    font-size: 22px;
  }

  .messaging-hero {
    margin: 10px 10px 0;
  }

  .messaging-hero-content {
    gap: 12px;
    padding: 0 34px 18px 0;
  }

  .messaging-hero-avatar {
    height: 136%;
  }

  .messaging-quote {
    font-size: 14px;
  }

  .messaging-quote-mark {
    inset-inline-end: 14px;
    font-size: 46px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
  }

  .plan-card {
    min-height: 0;
  }

  .messenger-item {
    gap: 10px;
  }

  .local-agents-panel {
    padding: 12px 0 0;
  }

  .local-agents-row,
  .local-agents-info {
    align-items: flex-start;
  }

  .integration-list-wrap {
    margin-inline-end: -18px;
  }

  .integration-items {
    padding-inline-end: 18px;
  }

  .integration-item {
    align-items: flex-start;
  }

  .clinic-preview-wrap {
    padding-inline-start: 0;
    padding-inline-end: 18px;
  }

  .clinic-preview-modal-backdrop {
    padding: 12px;
  }

  .clinic-preview-modal {
    width: 100%;
    height: 100%;
  }

  .clinic-preview-modal-close {
    inset-block-start: 10px;
    inset-inline-end: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .clinic-preview-wrap,
  .clinic-preview-enter-active,
  .clinic-preview-leave-active,
  .clinic-preview-open,
  .clinic-preview-modal-enter-active,
  .clinic-preview-modal-leave-active,
  .clinic-preview-modal-enter-active .clinic-preview-modal,
  .clinic-preview-modal-leave-active .clinic-preview-modal,
  .mode-radio-indicator,
  .mode-radio-indicator span {
    transition-duration: 1ms !important;
  }
}
</style>
