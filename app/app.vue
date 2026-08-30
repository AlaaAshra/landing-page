<template>
  <main v-if="isOnboardingRoute" class="onboarding-page">
    <header class="onboarding-header">
      <a class="brand-link" href="/" aria-label="MedicalStudent.ai home">
        <img class="brand-logo" src="/logo4.png" alt="Medical Student AI" />
      </a>
      <a class="onboarding-login" href="/login">Login</a>
    </header>

    <section class="onboarding-shell" aria-label="Medical exam plan onboarding">
      <form class="onboarding-card" @submit.prevent="submitOnboarding">
        <div class="onboarding-progress" aria-label="Onboarding progress">
          <button
            v-for="(step, index) in onboardingSteps"
            :key="step.id"
            class="onboarding-progress-step"
            :class="{ 'is-active': onboardingStep === index, 'is-complete': index < onboardingStep }"
            type="button"
            :disabled="index > onboardingStep"
            @click="goToOnboardingStep(index)"
          >
            <span>{{ index + 1 }}</span>
            <strong>{{ step.title }}</strong>
          </button>
        </div>

        <div class="onboarding-progress-bar" aria-hidden="true">
          <span :style="{ width: `${onboardingProgress}%` }"></span>
        </div>

        <Transition name="onboarding-step" mode="out-in">
          <section :key="onboardingSteps[onboardingStep].id" class="onboarding-step-panel">
            <div class="onboarding-step-heading">
              <h2>{{ onboardingSteps[onboardingStep].heading }}</h2>
              <span>{{ onboardingSteps[onboardingStep].description }}</span>
            </div>

            <div v-if="onboardingStep === 0" class="onboarding-fields">
              <label class="onboarding-field">
                <span>Full name</span>
                <input v-model="onboardingForm.name" type="text" autocomplete="name" placeholder="Your name" />
              </label>
              <label class="onboarding-field">
                <span>Email address</span>
                <input v-model="onboardingForm.email" type="email" autocomplete="email" placeholder="you@example.com" />
              </label>
              <label class="onboarding-field">
                <span>Current role</span>
                <select v-model="onboardingForm.role">
                  <option value="" disabled>Select your role</option>
                  <option>Medical student</option>
                  <option>Resident</option>
                  <option>PA student</option>
                  <option>Nursing student</option>
                  <option>Other medical learner</option>
                </select>
              </label>
              <label class="onboarding-field">
                <span>Preferred language</span>
                <select v-model="onboardingForm.language">
                  <option value="" disabled>Select your language</option>
                  <option v-for="language in languageOptions" :key="language">{{ language }}</option>
                </select>
              </label>
            </div>

            <div v-else-if="onboardingStep === 1" class="onboarding-option-grid">
              <label v-for="exam in examOptions" :key="exam" class="onboarding-option" :class="{ 'is-selected': onboardingForm.exam === exam }">
                <input v-model="onboardingForm.exam" type="radio" name="exam" :value="exam" />
                <span>{{ exam }}</span>
              </label>
              <label class="onboarding-field onboarding-field-full">
                <span>Add exam resource or custom exam</span>
                <textarea v-model="onboardingForm.customExam" placeholder="Paste a syllabus, topic list, or describe your exam"></textarea>
              </label>
            </div>

            <div v-else-if="onboardingStep === 2" class="onboarding-fields">
              <label class="onboarding-field">
                <span>Exam date</span>
                <input v-model="onboardingForm.examDate" type="date" />
              </label>
              <div class="onboarding-field onboarding-field-full">
                <span>Study days</span>
                <div class="onboarding-chip-grid">
                  <label v-for="day in studyDays" :key="day" class="onboarding-chip" :class="{ 'is-selected': onboardingForm.studyDays.includes(day) }">
                    <input v-model="onboardingForm.studyDays" type="checkbox" :value="day" />
                    <span>{{ day }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div v-else class="onboarding-summary">
              <div class="summary-card">
                <span>Exam</span>
                <strong>{{ onboardingForm.exam || "Custom exam" }}</strong>
              </div>
              <div class="summary-card">
                <span>Schedule</span>
                <strong>{{ onboardingForm.examDate || "Date pending" }}</strong>
              </div>
              <div class="summary-card">
                <span>Study days</span>
                <strong>{{ onboardingForm.studyDays.length ? onboardingForm.studyDays.join(", ") : "Not selected" }}</strong>
              </div>
              <div class="summary-card">
                <span>Language</span>
                <strong>{{ onboardingForm.language || "Not selected" }}</strong>
              </div>
              <p>User must create an account to continue and save the personalized study plan.</p>
            </div>
          </section>
        </Transition>

        <div class="onboarding-actions">
          <button class="onboarding-secondary" type="button" :disabled="onboardingStep === 0" @click="previousOnboardingStep">
            Back
          </button>
          <button class="onboarding-primary" type="submit" :disabled="!isOnboardingStepValid || isOnboardingSubmitting">
            {{ onboardingStep === onboardingSteps.length - 1 ? (isOnboardingSubmitting ? "Preparing..." : "Create account") : "Next" }}
          </button>
        </div>
      </form>
    </section>
  </main>

  <main v-else class="landing-page">
    <header class="site-header" :class="{ 'is-scrolled': isHeaderScrolled }">
      <nav class="site-nav" aria-label="Primary">
        <a class="brand-link" href="/" aria-label="MedicalStudent.ai home">
          <img class="brand-logo" src="/logo4.png" alt="Medical Student AI" />
        </a>

        <div class="header-links" aria-label="Sections">
          <a href="#plan-steps">Use Cases</a>
          <a href="#features">Features</a>
          <a href="#social-proof">Reviews</a>
          <a href="#faq">FAQ</a>
        </div>

        <div class="header-actions">
          <a class="nav-link" href="/login">Login</a>
          <a class="nav-button" href="/signup">Sign Up</a>
        </div>
      </nav>
    </header>

    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-content">
        <div class="hero-copy">
          <h1 id="hero-title">Ace any medical exam</h1>
          <p class="hero-subheadline">
            The official AI for medical exam preparation, built to help you reduce study time, learn smarter, and perform better.
          </p>

          <a class="hero-cta" href="/onboarding">
            <span>Get Started</span>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>

        <div class="hero-chatbox" :aria-label="heroChatAriaLabel">
          <span class="hero-chat-placeholder" aria-hidden="true">
            <template v-if="heroPromptMode === 'exam'">
              {{ heroTypedPrompt }}<span
                v-if="heroTypedPrompt === heroExamPromptPrefix"
                :key="heroExamRotationKey"
                class="hero-chat-rotating-word"
              >{{ heroRotatingExam }}</span><span v-if="heroTypedPrompt === heroExamPromptPrefix">{{ heroExamPromptSuffix }}</span>
            </template>
            <template v-else>
              {{ heroTypedPrompt }}
            </template><span class="hero-chat-cursor"></span>
          </span>
          <span class="hero-chat-submit" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </span>
        </div>

      </div>

      <div class="hero-trusted" aria-labelledby="hero-trusted-title">
        <p id="hero-trusted-title" class="hero-trusted-title">Supported By Leading Technology Partners</p>
        <div class="hero-trusted-list" aria-label="Partner programs">
          <div class="hero-trusted-track">
            <div
              v-for="(logo, index) in heroTrustedLogoTrack"
              :key="`${logo.id}-${index}`"
              class="hero-trusted-item"
              :aria-hidden="index >= heroTrustedLogos.length ? 'true' : undefined"
            >
              <img :src="logo.image" :alt="index < heroTrustedLogos.length ? `${logo.company} logo` : ''" />
              <span>{{ logo.program }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      ref="heroVideoSectionRef"
      class="hero-video-section"
      :class="{ 'is-in-view': isHeroVideoSectionInView }"
      aria-label="MedicalStudent AI product preview"
    >
      <div class="hero-video-shell">
        <video
          ref="heroVideoRef"
          class="hero-video"
          src="/videos/MedicalStudentAi_comp.mp4"
          muted
          loop
          playsinline
          controls
          preload="metadata"
        ></video>
      </div>
    </section>

    <section id="plan-steps" ref="planStepsSectionRef" class="feature-steps-section" aria-labelledby="plan-steps-title">
      <div class="section-shell feature-steps-shell">
        <h2 id="plan-steps-title">How to get started</h2>

        <div class="feature-steps-grid">
          <div class="feature-steps-list" aria-label="Getting started steps">
            <button
              v-for="(step, index) in planSteps"
              :key="step.title"
              class="feature-step"
              :class="{ 'is-active': currentPlanStep === index }"
              type="button"
              :aria-pressed="currentPlanStep === index"
              @click="selectPlanStep(index)"
            >
              <span class="feature-step-marker">
                <span v-if="index <= currentPlanStep">&#10003;</span>
                <span v-else>{{ index + 1 }}</span>
              </span>
              <span class="feature-step-copy">
                <strong>{{ step.title }}</strong>
                <span>{{ step.content }}</span>
                <span class="feature-step-progress" aria-hidden="true">
                  <span :style="{ width: currentPlanStep === index ? `${planStepProgress}%` : '0%' }"></span>
                </span>
              </span>
            </button>
          </div>

          <div class="feature-visual" aria-label="Study plan setup preview">
            <div
              v-for="(step, index) in planSteps"
              :key="`visual-${step.title}`"
              class="feature-visual-panel"
              :class="{ 'is-active': currentPlanStep === index, 'has-demo': index <= 2 }"
              aria-hidden="true"
            >
              <div v-if="arePlanStepsActive && index === 0" class="getting-started-demo-embed">
                <iframe
                  :key="`getting-started-demo-${planDemoReplayKey}`"
                  :src="`/how-to-get-started-demo.html?play=${planDemoReplayKey}`"
                  title="Make a study plan demo animation"
                  loading="lazy"
                  tabindex="-1"
                ></iframe>
              </div>
              <div v-else-if="arePlanStepsActive && index === 1" class="getting-started-demo-embed">
                <iframe
                  :key="`step2-add-source-demo-${planSourceDemoReplayKey}`"
                  :src="`/step2-add-source-demo.html?play=${planSourceDemoReplayKey}`"
                  title="Add exam source demo animation"
                  loading="lazy"
                  tabindex="-1"
                ></iframe>
              </div>
              <div v-else-if="arePlanStepsActive && index === 2" class="getting-started-demo-embed">
                <iframe
                  :key="`step3-ask-question-demo-${planQuestionDemoReplayKey}`"
                  :src="`/step3-ask-question-demo.html?play=${planQuestionDemoReplayKey}`"
                  title="Ask a study question demo animation"
                  loading="lazy"
                  tabindex="-1"
                ></iframe>
              </div>
              <template v-else>
                <div class="visual-toolbar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="visual-content">
                <p>{{ step.previewLabel }}</p>
                <h3>{{ step.previewTitle }}</h3>
                <div class="visual-card-stack">
                  <span v-for="item in step.previewItems" :key="item">{{ item }}</span>
                </div>
                <a v-if="step.cta" class="feature-preview-button" href="/onboarding">{{ step.cta }}</a>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      id="features"
      ref="featuresSectionRef"
      class="features-section"
      :class="{ 'is-in-view': isSummarySectionInView }"
      aria-labelledby="features-title"
    >
      <div class="section-shell features-shell">
        <div class="features-copy">
          <p class="features-kicker">Summarize</p>
          <h2 id="features-title">
            <span>Save hours</span>
            <span>every day</span>
          </h2>
          <p class="features-description">
            Turn lectures, videos, PDFs, and question explanations into fast, exam-focused summaries you can review before every study session.
          </p>
          <a class="features-cta" href="/onboarding">
            <span aria-hidden="true"></span>
            DISCOVER
          </a>
        </div>

        <article
          class="features-summary-card"
          :class="{
            'is-summarized': isSummaryPreviewReady,
            'is-demo-active': isSummaryPreviewDemoActive,
            'is-auto-pressing': isSummaryPreviewPressing,
            'is-scrubbing': isSummaryPreviewScrubbing,
          }"
          ref="summaryCardRef"
          aria-label="MedicalStudent.ai summarize feature preview"
        >
          <div class="features-summary-layer features-summary-before" :aria-hidden="isSummaryPreviewReady ? 'true' : undefined">
            <div class="features-source-preview">
              <img
                :src="summaryThumbnailSrc"
                alt="Antibiotics lecture video thumbnail"
                loading="lazy"
                @error="handleSummaryThumbnailError"
                @load="handleSummaryLayoutChange"
              />
              <div class="features-video-overlay" aria-hidden="true">
                <span>0:00 / 2:20:12</span>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" />
                </svg>
              </div>
              <div class="features-video-scrubber" aria-hidden="true">
                <span></span>
              </div>
            </div>
            <div class="features-video-title-row">
              <span class="features-video-source-pill">YouTube</span>
              <div class="features-card-title">
                <h3>Antibiotics: Mechanism, Coverage &amp; Resistance</h3>
                <p>YouTube Video - Pharmacology</p>
              </div>
            </div>
            <button ref="summaryButtonRef" class="features-summary-action" type="button" @click="startSummaryPreviewProcessing">
              <span aria-hidden="true"></span>
              Summarize
            </button>
            <span class="features-demo-cursor" :style="summaryCursorStyle" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M5 3l13 9-6.2 1.2L9 20 5 3z" />
              </svg>
            </span>
          </div>

          <div class="features-summary-layer features-summary-after" :aria-hidden="isSummaryPreviewReady ? undefined : 'true'">
              <div class="features-summary-overview">
                <div class="features-card-header">
                <div class="features-card-thumb" aria-hidden="true">
                  <img
                    :src="summaryThumbnailSrc"
                    alt=""
                    loading="lazy"
                    @error="handleSummaryThumbnailError"
                  />
                </div>
                <div class="features-card-title">
                  <h3>Antibiotics: Mechanism, Coverage &amp; Resistance</h3>
                  <p>YouTube Video - Pharmacology</p>
                </div>
              </div>

              <div class="features-summary-meta">
                <span class="features-summary-pill">
                  <span aria-hidden="true"></span>
                  AI Summary
                </span>
                <span class="features-summary-time">2h 20m <span aria-hidden="true">-&gt;</span> <strong>90s</strong></span>
              </div>

              <p class="features-summary-copy">
                A focused review of antibiotic mechanisms, coverage choices, adverse effects, and resistance patterns for exam questions.
              </p>
            </div>

            <ul class="features-summary-list">
              <li
                v-for="(item, index) in summaryHighlights"
                :key="item.time"
                :style="{ transitionDelay: isSummaryPreviewReady ? `${210 + index * 100}ms` : '0ms' }"
              >
                <time>{{ item.time }}</time>
                <span><strong>{{ item.title }}</strong> {{ item.body }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <section
      id="mind-map-feature"
      ref="mindMapSectionRef"
      class="features-section"
      :class="{ 'is-in-view': isMindMapSectionInView }"
      aria-labelledby="features-mindmap-title"
    >
      <div class="section-shell features-shell features-anatomy-shell features-mindmap-shell">
        <div class="features-copy">
          <p class="features-kicker">MIND MAP</p>
          <h2 id="features-mindmap-title">
            <span>Map your notes</span>
            <span>into a mind map</span>
          </h2>
          <p class="features-description">
            Turn any lecture or source into a visual mind map &mdash; see how every topic connects, drill into sub-branches, and study the big picture at a glance.
          </p>
          <a class="features-cta" href="/onboarding">
            <span aria-hidden="true"></span>
            DISCOVER
          </a>
        </div>

        <article
          class="features-summary-card features-anatomy-card features-mindmap-card"
          :class="`is-${mindMapPhase}`"
          aria-label="MedicalStudent.ai mind map feature preview"
        >
          <div class="mindmap-demo" aria-hidden="true">
            <div class="mindmap-demo-header">
              <strong>Introduction to Human Anatomy &amp; Histology</strong>
              <span>51 nodes from 1 source</span>
            </div>

            <div class="mindmap-controls">
              <span>
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="11" cy="11" r="5" />
                  <path d="M11 8v6M8 11h6M15 15l4 4" />
                </svg>
              </span>
              <span>
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="11" cy="11" r="5" />
                  <path d="M8 11h6M15 15l4 4" />
                </svg>
              </span>
            </div>

            <div class="mindmap-viewport">
              <div class="mindmap-world">
                <svg class="mindmap-lines" viewBox="0 0 960 540" preserveAspectRatio="none">
                  <path class="mindmap-link first-link" style="--delay: 0ms;" pathLength="1" d="M485 270 C526 270 518 103 560 103" />
                  <path class="mindmap-link first-link" style="--delay: 170ms;" pathLength="1" d="M485 270 C526 270 518 160 560 160" />
                  <path class="mindmap-link first-link" style="--delay: 340ms;" pathLength="1" d="M485 270 C526 270 518 217 560 217" />
                  <path class="mindmap-link first-link" style="--delay: 510ms;" pathLength="1" d="M485 270 C526 270 518 274 560 274" />
                  <path class="mindmap-link first-link" style="--delay: 680ms;" pathLength="1" d="M485 270 C526 270 518 331 560 331" />
                  <path class="mindmap-link first-link" style="--delay: 850ms;" pathLength="1" d="M485 270 C526 270 518 388 560 388" />
                  <path class="mindmap-link first-link" style="--delay: 1020ms;" pathLength="1" d="M485 270 C526 270 518 445 560 445" />
                  <path class="mindmap-link first-link" style="--delay: 1190ms;" pathLength="1" d="M485 270 C526 270 518 502 560 502" />

                  <path class="mindmap-link def-link" style="--delay: 0ms;" pathLength="1" d="M720 103 C746 103 736 48 770 48" />
                  <path class="mindmap-link def-link" style="--delay: 160ms;" pathLength="1" d="M720 103 C746 103 736 88 770 88" />
                  <path class="mindmap-link def-link" style="--delay: 320ms;" pathLength="1" d="M720 103 C746 103 736 128 770 128" />
                  <path class="mindmap-link def-link" style="--delay: 480ms;" pathLength="1" d="M720 103 C746 103 736 168 770 168" />

                  <path class="mindmap-link term-link" style="--delay: 0ms;" pathLength="1" d="M720 160 C746 160 736 218 770 218" />
                  <path class="mindmap-link term-link" style="--delay: 150ms;" pathLength="1" d="M720 160 C746 160 736 258 770 258" />
                  <path class="mindmap-link term-link" style="--delay: 300ms;" pathLength="1" d="M720 160 C746 160 736 298 770 298" />
                  <path class="mindmap-link term-link" style="--delay: 450ms;" pathLength="1" d="M720 160 C746 160 736 338 770 338" />
                  <path class="mindmap-link term-link" style="--delay: 600ms;" pathLength="1" d="M720 160 C746 160 736 378 770 378" />
                  <path class="mindmap-link term-link" style="--delay: 750ms;" pathLength="1" d="M720 160 C746 160 736 418 770 418" />
                </svg>

                <div class="mindmap-node mindmap-root" style="--x: 315px; --y: 248px;">
                  <strong>Introduction to Human Anatomy &amp; Histology</strong>
                  <span>51 nodes from 1 source</span>
                </div>

                <div class="mindmap-node first-node" style="--x: 560px; --y: 82px; --delay: 0ms;">Definition &amp; Scope of Anatomy <span>&gt;</span></div>
                <div class="mindmap-node first-node" style="--x: 560px; --y: 139px; --delay: 170ms;">Anatomical Terminology &amp; Etymology <span>&gt;</span></div>
                <div class="mindmap-node first-node" style="--x: 560px; --y: 196px; --delay: 340ms;">Levels of Organization &amp; Life Functions <span>&gt;</span></div>
                <div class="mindmap-node first-node" style="--x: 560px; --y: 253px; --delay: 510ms;">Organ Systems &amp; Tissues <span>&gt;</span></div>
                <div class="mindmap-node first-node" style="--x: 560px; --y: 310px; --delay: 680ms;">Body Regions, Planes &amp; Directions <span>&gt;</span></div>
                <div class="mindmap-node first-node" style="--x: 560px; --y: 367px; --delay: 850ms;">Body Cavities &amp; Serous Membranes <span>&gt;</span></div>
                <div class="mindmap-node first-node" style="--x: 560px; --y: 424px; --delay: 1020ms;">Cells &amp; Cell Specializations <span>&gt;</span></div>
                <div class="mindmap-node first-node" style="--x: 560px; --y: 481px; --delay: 1190ms;">Histology &amp; Cytology Basics <span>&gt;</span></div>

                <div class="mindmap-node child-node def-child" style="--x: 770px; --y: 32px; --delay: 0ms;">Human Anatomy</div>
                <div class="mindmap-node child-node def-child" style="--x: 770px; --y: 72px; --delay: 160ms;">Gross Anatomy</div>
                <div class="mindmap-node child-node def-child" style="--x: 770px; --y: 112px; --delay: 320ms;">Microscopic Anatomy</div>
                <div class="mindmap-node child-node def-child" style="--x: 770px; --y: 152px; --delay: 480ms;">Functional Anatomy</div>

                <div class="mindmap-node child-node term-child" style="--x: 770px; --y: 202px; --delay: 0ms;">Word Roots &amp; Etymology</div>
                <div class="mindmap-node child-node term-child" style="--x: 770px; --y: 242px; --delay: 150ms;">Prefixes &amp; Suffixes</div>
                <div class="mindmap-node child-node term-child" style="--x: 770px; --y: 282px; --delay: 300ms;">Diminutives</div>
                <div class="mindmap-node child-node term-child" style="--x: 770px; --y: 322px; --delay: 450ms;">Grammatical Forms</div>
                <div class="mindmap-node child-node term-child" style="--x: 770px; --y: 362px; --delay: 600ms;">Eponyms</div>
                <div class="mindmap-node child-node term-child" style="--x: 770px; --y: 402px; --delay: 750ms;">Descriptive Terms</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section
      id="whiteboard-feature"
      ref="whiteboardSectionRef"
      class="features-section"
      :class="{ 'is-in-view': isWhiteboardSectionInView }"
      aria-labelledby="features-whiteboard-title"
    >
      <div class="section-shell features-shell features-anatomy-shell features-mindmap-shell">
        <div class="features-copy">
          <p class="features-kicker">WHITEBOARD</p>
          <h2 id="features-whiteboard-title">
            <span>Make study</span>
            <span>interactive</span>
          </h2>
          <p class="features-description">
            Use the whiteboard to make learning interactive &mdash; add images and take notes as you study.
          </p>
          <a class="features-cta" href="/onboarding">
            <span aria-hidden="true"></span>
            DISCOVER
          </a>
        </div>

        <article class="features-summary-card features-anatomy-card features-whiteboard-card" aria-label="MedicalStudent.ai whiteboard feature preview">
          <video
            ref="whiteboardVideoRef"
            class="features-whiteboard-video"
            src="/videos/whiteboard-feature.mp4"
            muted
            loop
            playsinline
            preload="auto"
          ></video>
        </article>
      </div>
    </section>

    <section
      ref="anatomySectionRef"
      class="features-section"
      :class="{ 'is-in-view': isAnatomySectionInView }"
      aria-labelledby="features-anatomy-title"
    >
      <div class="section-shell features-shell features-anatomy-shell">
        <div class="features-copy">
          <p class="features-kicker">3D ANATOMY</p>
          <h2 id="features-anatomy-title">
            <span>See anatomy</span>
            <span>in real 3D</span>
          </h2>
          <p class="features-description">
            Toggle body systems on and off, rotate structures, and inspect every detail in an interactive 3D atlas built for exam prep â€” no textbook diagrams required.
          </p>
          <a class="features-cta" href="/onboarding">
            <span aria-hidden="true"></span>
            DISCOVER
          </a>
        </div>

        <article class="features-summary-card features-anatomy-card" aria-label="MedicalStudent.ai 3D anatomy feature preview">
          <video
            ref="anatomyVideoRef"
            class="features-anatomy-video"
            src="/videos/anatomy-atlas-feature.mp4"
            muted
            loop
            playsinline
            preload="auto"
            @loadedmetadata="setAnatomyVideoPlaybackRate"
            @play="setAnatomyVideoPlaybackRate"
          ></video>
        </article>
      </div>
    </section>

    <section
      id="social-proof"
      ref="socialProofSectionRef"
      class="social-proof-section"
      :class="{ 'is-in-view': isSocialProofSectionInView }"
      aria-labelledby="social-proof-title"
    >
      <div class="section-shell testimonials-shell">
        <div class="testimonials-heading">
          <h2 id="social-proof-title">What our users say</h2>
          <p>See how medical learners use MedicalStudent.ai to study with more focus and less wasted time.</p>
        </div>

        <div class="testimonials-columns" aria-label="Customer testimonials">
          <div
            v-for="(column, columnIndex) in testimonialColumns"
            :key="columnIndex"
            class="testimonial-column"
            :class="`testimonial-column-${columnIndex + 1}`"
          >
            <div class="testimonial-scroll">
              <template v-for="repeat in 2" :key="repeat">
                <article
                  v-for="testimonial in column"
                  :key="`${repeat}-${testimonial.name}`"
                  class="testimonial-card"
                  :aria-hidden="repeat === 2 ? 'true' : undefined"
                >
                  <p>{{ testimonial.text }}</p>
                  <footer>
                    <span class="testimonial-avatar" aria-hidden="true">
                      <img
                        v-if="testimonial.image"
                        :src="testimonial.image"
                        alt=""
                        loading="lazy"
                        decoding="async"
                      >
                      <template v-else>{{ testimonial.initials }}</template>
                    </span>
                    <span>
                      <strong>{{ testimonial.name }}</strong>
                      <span>{{ testimonial.role }}</span>
                    </span>
                  </footer>
                </article>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      id="faq"
      ref="faqSectionRef"
      class="faq-section"
      :class="{ 'is-in-view': isFaqSectionInView }"
      aria-labelledby="faq-title"
    >
      <div class="section-shell faq-shell">
        <div class="faq-header">
          <h2 id="faq-title">Frequently Asked Questions</h2>
          <p>Everything you need to know about preparing with MedicalStudent.ai.</p>
        </div>

        <div class="faq-list" aria-label="Frequently asked questions">
          <article
            v-for="(item, index) in faqItems"
            :key="item.question"
            class="faq-item"
            :class="{ 'is-open': openFaqIndex === index }"
          >
            <button
              class="faq-question"
              type="button"
              :aria-expanded="openFaqIndex === index"
              :aria-controls="`faq-answer-${index}`"
              @click="toggleFaq(index)"
            >
              <span>{{ item.question }}</span>
              <span class="faq-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>

            <div :id="`faq-answer-${index}`" class="faq-answer">
              <div class="faq-answer-inner">
                <p>{{ item.answer }}</p>
              </div>
            </div>
          </article>
        </div>

        <div class="faq-contact">
          <div class="faq-contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M4 6h16v12H4z" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </div>
          <p class="faq-contact-title">Ready to start?</p>
          <p class="faq-contact-copy">Create your personalized study plan and prepare smarter.</p>
          <a class="faq-contact-button" href="/onboarding">Start Free Trial</a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const route = useRoute();
const isOnboardingRoute = computed(() => route.path === "/onboarding");

const planSteps = [
  {
    title: "Select your exam, exam date, and study days",
    content: "Choose your exam, set your target date, and pick the days you want to study.",
    previewLabel: "Step 1",
    previewTitle: "Set your exam plan",
    previewItems: ["Exam", "Target date", "Study days"],
  },
  {
    title: "Add exam source or select internal curriculum",
    content: "Upload an exam resource or add a built-in curriculum like USMLE Step 1.",
    previewLabel: "Step 2",
    previewTitle: "Add your sources",
    previewItems: ["Internal curriculum", "PDF upload", "YouTube link"],
  },
  {
    title: "Study with Sina",
    content: "Chat with your sources, ask questions, and use built-in tools to quiz, summarize, or explain as you go.",
    previewLabel: "Step 3",
    previewTitle: "Ask your first question",
    previewItems: ["Tools ready", "Chat input", "Focused explanation"],
  },
];

const summaryHighlights = [
  {
    time: "0:57",
    title: "Mechanism of action.",
    body: "Connect antibiotic classes to the bacterial targets they block and the organisms they affect.",
  },
  {
    time: "24:18",
    title: "Coverage choice.",
    body: "Compare gram-positive, gram-negative, anaerobic, and atypical coverage without rewatching the lecture.",
  },
  {
    time: "53:16",
    title: "Empiric therapy.",
    body: "Review common infection scenarios and the initial antibiotic choices most likely to appear in questions.",
  },
  {
    time: "1:33:40",
    title: "Resistance pattern.",
    body: "Identify beta-lactamases, altered targets, and efflux mechanisms from high-yield clinical clues.",
  },
];

const summaryThumbnailPrimary = "https://img.youtube.com/vi/GGtwJ-SGXTA/maxresdefault.jpg";
const summaryThumbnailFallback = "https://img.youtube.com/vi/GGtwJ-SGXTA/hqdefault.jpg";

const currentPlanStep = ref(0);
const planStepProgress = ref(0);
const isHeaderScrolled = ref(false);
const onboardingStep = ref(0);
const isOnboardingSubmitting = ref(false);
const heroVideoSectionRef = ref<HTMLElement | null>(null);
const featuresSectionRef = ref<HTMLElement | null>(null);
const planStepsSectionRef = ref<HTMLElement | null>(null);
const mindMapSectionRef = ref<HTMLElement | null>(null);
const whiteboardSectionRef = ref<HTMLElement | null>(null);
const anatomySectionRef = ref<HTMLElement | null>(null);
const socialProofSectionRef = ref<HTMLElement | null>(null);
const faqSectionRef = ref<HTMLElement | null>(null);
const summaryCardRef = ref<HTMLElement | null>(null);
const summaryButtonRef = ref<HTMLButtonElement | null>(null);
const heroVideoRef = ref<HTMLVideoElement | null>(null);
const whiteboardVideoRef = ref<HTMLVideoElement | null>(null);
const anatomyVideoRef = ref<HTMLVideoElement | null>(null);
const summaryThumbnailSrc = ref(summaryThumbnailPrimary);
const summaryCursorStyle = ref({ left: "calc(100% - 86px)", top: "calc(100% - 78px)" });
const planDemoReplayKey = ref(0);
const planSourceDemoReplayKey = ref(0);
const planQuestionDemoReplayKey = ref(0);
const arePlanStepsActive = ref(false);
const isHeroVideoSectionInView = ref(false);
const isSummarySectionInView = ref(false);
const isMindMapSectionInView = ref(false);
const isWhiteboardSectionInView = ref(false);
const isAnatomySectionInView = ref(false);
const isSocialProofSectionInView = ref(false);
const isFaqSectionInView = ref(false);
const isSummaryPreviewReady = ref(false);
const isSummaryPreviewDemoActive = ref(false);
const isSummaryPreviewPressing = ref(false);
const isSummaryPreviewScrubbing = ref(false);
type MindMapPhase = "idle" | "first" | "focus-def" | "def-expanded" | "focus-term" | "term-expanded" | "full" | "collapse";
const mindMapPhase = ref<MindMapPhase>("idle");
const heroExamPromptPrefix = "Hey Sina, I have ";
const heroExamPromptSuffix = " exam in 4 weeks, help me?";
const heroExamOptions = ["USMLE", "PLAB", "MCCQE", "NCLEX", "COMLEX"] as const;
const heroSecondPrompt = "What exams can I prepare for?";
const heroPromptMode = ref<"exam" | "question">("exam");
const heroRotatingExam = ref<(typeof heroExamOptions)[number]>(heroExamOptions[0]);
const heroExamRotationKey = ref(0);
const heroTrustedLogos = [
  {
    id: "microsoft",
    company: "Microsoft",
    program: "Microsoft Founder Center",
    image: "/microsoft.png",
  },
  {
    id: "nvidia",
    company: "NVIDIA",
    program: "NVIDIA Foundation Program",
    image: "/nvidia.png",
  },
  {
    id: "google-for-startups",
    company: "Google for Startups",
    program: "Google Startup Program Cloud Computing Program",
    image: "/googleforstartups.png",
  },
] as const;
const heroTrustedLogoTrack = [...heroTrustedLogos, ...heroTrustedLogos];
const heroTypedPrompt = ref("");
const heroChatAriaLabel = computed(() => {
  if (heroPromptMode.value === "exam") {
    return `Chat prompt example: ${heroExamPromptPrefix}${heroRotatingExam.value}${heroExamPromptSuffix}`;
  }

  return `Chat prompt example: ${heroTypedPrompt.value || heroSecondPrompt}`;
});
const planStepDurations = [6200, 3600, 8200] as const;
let planProgressAnimationFrame: number | undefined;
let planStepFallbackTimer: ReturnType<typeof window.setTimeout> | undefined;
let planStepAdvanceTimer: ReturnType<typeof window.setTimeout> | undefined;
let activePlanStepRun = 0;
let heroTypewriterTimer: ReturnType<typeof window.setTimeout> | undefined;
let heroVideoObserver: IntersectionObserver | undefined;
let summaryPreviewObserver: IntersectionObserver | undefined;
let planStepsObserver: IntersectionObserver | undefined;
let mindMapObserver: IntersectionObserver | undefined;
let whiteboardObserver: IntersectionObserver | undefined;
let anatomyObserver: IntersectionObserver | undefined;
let socialProofObserver: IntersectionObserver | undefined;
let faqObserver: IntersectionObserver | undefined;
let summaryPreviewTimers: ReturnType<typeof window.setTimeout>[] = [];
let mindMapTimers: ReturnType<typeof window.setTimeout>[] = [];

type SectionVisibilityHandlers = {
  onEnter: () => void;
  onExit: () => void;
  enterRatio?: number;
  exitRatio?: number;
};

const observeSectionVisibility = (
  element: HTMLElement | null,
  { onEnter, onExit, enterRatio = 0.2, exitRatio = 0.05 }: SectionVisibilityHandlers,
) => {
  if (!element || !("IntersectionObserver" in window)) {
    onEnter();
    return undefined;
  }

  let isInView = false;
  const thresholds = Array.from(new Set([0, exitRatio, enterRatio, 0.45, 0.6])).sort((a, b) => a - b);
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= enterRatio) {
        if (!isInView) {
          isInView = true;
          onEnter();
        }
        return;
      }

      if (isInView && (!entry.isIntersecting || entry.intersectionRatio <= exitRatio)) {
        isInView = false;
        onExit();
      }
    },
    { threshold: thresholds },
  );

  observer.observe(element);
  return observer;
};

const updateHeaderScroll = () => {
  isHeaderScrolled.value = window.scrollY > 10;
};

const clearHeroTypewriterTimer = () => {
  if (heroTypewriterTimer) {
    window.clearTimeout(heroTypewriterTimer);
    heroTypewriterTimer = undefined;
  }
};

const clearSummaryPreviewTimers = () => {
  summaryPreviewTimers.forEach((timer) => window.clearTimeout(timer));
  summaryPreviewTimers = [];
};

const clearMindMapTimers = () => {
  mindMapTimers.forEach((timer) => window.clearTimeout(timer));
  mindMapTimers = [];
};

const queueSummaryPreviewTimer = (callback: () => void, delay: number) => {
  const timer = window.setTimeout(() => {
    summaryPreviewTimers = summaryPreviewTimers.filter((queuedTimer) => queuedTimer !== timer);
    callback();
  }, delay);

  summaryPreviewTimers.push(timer);
};

const queueMindMapTimer = (callback: () => void, delay: number) => {
  const timer = window.setTimeout(() => {
    mindMapTimers = mindMapTimers.filter((queuedTimer) => queuedTimer !== timer);
    callback();
  }, delay);

  mindMapTimers.push(timer);
};

const setAnatomyVideoPlaybackRate = () => {
  if (anatomyVideoRef.value) {
    anatomyVideoRef.value.playbackRate = 1.35;
  }
};

const playVideoPreview = (video: HTMLVideoElement | null, playbackRate = 1) => {
  if (!video) {
    return;
  }

  video.muted = true;
  video.playbackRate = playbackRate;

  try {
    video.currentTime = 0;
  } catch {
    // The video may not have metadata yet; it will still start at the first frame.
  }

  void video.play().catch(() => undefined);
};

const resetVideoPreview = (video: HTMLVideoElement | null) => {
  if (!video) {
    return;
  }

  video.pause();

  try {
    video.currentTime = 0;
  } catch {
    // Ignore seek errors while metadata is still loading.
  }
};

const playHeroVideoPreview = () => {
  isHeroVideoSectionInView.value = true;
  playVideoPreview(heroVideoRef.value);
};

const resetHeroVideoPreview = () => {
  isHeroVideoSectionInView.value = false;
  resetVideoPreview(heroVideoRef.value);
};

const playAnatomyVideoPreview = () => {
  isAnatomySectionInView.value = true;
  playVideoPreview(anatomyVideoRef.value, 1.35);
};

const resetAnatomyVideoPreview = () => {
  isAnatomySectionInView.value = false;
  resetVideoPreview(anatomyVideoRef.value);
};

const startMindMapDemo = () => {
  clearMindMapTimers();
  mindMapPhase.value = "idle";

  const sequence: Array<[MindMapPhase, number]> = [
    ["first", 1000],
    ["focus-def", 3000],
    ["def-expanded", 4500],
    ["focus-term", 6000],
    ["term-expanded", 7000],
    ["full", 8500],
    ["collapse", 10000],
  ];

  sequence.forEach(([phase, delay]) => {
    queueMindMapTimer(() => {
      mindMapPhase.value = phase;
    }, delay);
  });

  queueMindMapTimer(startMindMapDemo, 11000);
};

const playMindMapDemo = () => {
  if (isMindMapSectionInView.value) {
    return;
  }

  isMindMapSectionInView.value = true;
  startMindMapDemo();
};

const resetMindMapDemo = () => {
  isMindMapSectionInView.value = false;
  clearMindMapTimers();
  mindMapPhase.value = "idle";
};

const playWhiteboardVideoPreview = () => {
  isWhiteboardSectionInView.value = true;
  playVideoPreview(whiteboardVideoRef.value);
};

const resetWhiteboardVideoPreview = () => {
  isWhiteboardSectionInView.value = false;
  resetVideoPreview(whiteboardVideoRef.value);
};

const resetSummaryPreviewDemo = () => {
  clearSummaryPreviewTimers();
  isSummarySectionInView.value = false;
  isSummaryPreviewReady.value = false;
  isSummaryPreviewDemoActive.value = false;
  isSummaryPreviewPressing.value = false;
  isSummaryPreviewScrubbing.value = false;
};

const updateSummaryCursorTarget = () => {
  if (!summaryCardRef.value || !summaryButtonRef.value) {
    return false;
  }

  const cardRect = summaryCardRef.value.getBoundingClientRect();
  const buttonRect = summaryButtonRef.value.getBoundingClientRect();
  const cursorHotspotX = 7;
  const cursorHotspotY = 4;
  const targetX = buttonRect.right - cardRect.left - cursorHotspotX - 7;
  const targetY = buttonRect.top - cardRect.top - cursorHotspotY + 4;

  summaryCursorStyle.value = {
    left: `${Math.max(0, targetX)}px`,
    top: `${Math.max(0, targetY)}px`,
  };

  return true;
};

const handleSummaryLayoutChange = () => {
  if (isSummaryPreviewDemoActive.value || isSummaryPreviewPressing.value || isSummaryPreviewScrubbing.value) {
    return;
  }

  updateSummaryCursorTarget();
};

const handleSummaryThumbnailError = () => {
  if (summaryThumbnailSrc.value !== summaryThumbnailFallback) {
    summaryThumbnailSrc.value = summaryThumbnailFallback;
  }
};

const showSummaryPreview = () => {
  isSummaryPreviewReady.value = true;
  isSummaryPreviewScrubbing.value = false;
  isSummaryPreviewPressing.value = false;
};

const startSummaryPreviewProcessing = () => {
  if (isSummaryPreviewReady.value || isSummaryPreviewScrubbing.value) {
    return;
  }

  clearSummaryPreviewTimers();
  updateSummaryCursorTarget();
  isSummaryPreviewPressing.value = true;
  isSummaryPreviewScrubbing.value = true;

  queueSummaryPreviewTimer(() => {
    isSummaryPreviewPressing.value = false;
  }, 180);

  queueSummaryPreviewTimer(() => {
    showSummaryPreview();
  }, 1400);
};

const startHeroTypewriter = () => {
  clearHeroTypewriterTimer();

  const restartExamPrompt = () => {
    let characterIndex = 0;
    let examIndex = 0;

    heroPromptMode.value = "exam";
    heroTypedPrompt.value = "";
    heroRotatingExam.value = heroExamOptions[0];
    heroExamRotationKey.value += 1;

    const typePrefix = () => {
      characterIndex = Math.min(heroExamPromptPrefix.length, characterIndex + 1);
      heroTypedPrompt.value = heroExamPromptPrefix.slice(0, characterIndex);

      if (characterIndex < heroExamPromptPrefix.length) {
        heroTypewriterTimer = window.setTimeout(typePrefix, 46);
        return;
      }

      const rotateExam = () => {
        if (examIndex < heroExamOptions.length - 1) {
          examIndex += 1;
          heroRotatingExam.value = heroExamOptions[examIndex];
          heroExamRotationKey.value += 1;
          heroTypewriterTimer = window.setTimeout(rotateExam, 900);
          return;
        }

        heroTypewriterTimer = window.setTimeout(typeSecondPrompt, 1400);
      };

      heroTypewriterTimer = window.setTimeout(rotateExam, 950);
    };

    heroTypewriterTimer = window.setTimeout(typePrefix, 260);
  };

  const typeSecondPrompt = () => {
    let characterIndex = 0;
    let isDeleting = false;

    heroPromptMode.value = "question";
    heroTypedPrompt.value = "";

    const tick = () => {
      let delay = 46;

      if (isDeleting) {
        characterIndex = Math.max(0, characterIndex - 1);
        heroTypedPrompt.value = heroSecondPrompt.slice(0, characterIndex);
        delay = characterIndex === 0 ? 360 : 28;

        if (characterIndex === 0) {
          heroTypewriterTimer = window.setTimeout(restartExamPrompt, delay);
          return;
        }
      } else {
        characterIndex = Math.min(heroSecondPrompt.length, characterIndex + 1);
        heroTypedPrompt.value = heroSecondPrompt.slice(0, characterIndex);
        delay = characterIndex === heroSecondPrompt.length ? 1800 : 46;

        if (characterIndex === heroSecondPrompt.length) {
          isDeleting = true;
        }
      }

      heroTypewriterTimer = window.setTimeout(tick, delay);
    };

    heroTypewriterTimer = window.setTimeout(tick, 220);
  };

  restartExamPrompt();
};

const replayPlanStepDemo = (index: number) => {
  if (index === 0) {
    planDemoReplayKey.value += 1;
  } else if (index === 1) {
    planSourceDemoReplayKey.value += 1;
  } else if (index === 2) {
    planQuestionDemoReplayKey.value += 1;
  }
};

const clearPlanStepTimers = () => {
  if (planProgressAnimationFrame !== undefined) {
    window.cancelAnimationFrame(planProgressAnimationFrame);
    planProgressAnimationFrame = undefined;
  }

  if (planStepFallbackTimer) {
    window.clearTimeout(planStepFallbackTimer);
    planStepFallbackTimer = undefined;
  }

  if (planStepAdvanceTimer) {
    window.clearTimeout(planStepAdvanceTimer);
    planStepAdvanceTimer = undefined;
  }
};

const startPlanStepProgress = (index: number) => {
  if (!arePlanStepsActive.value) {
    return;
  }

  clearPlanStepTimers();
  activePlanStepRun += 1;
  const runId = activePlanStepRun;
  const duration = planStepDurations[index] ?? 6200;
  const startedAt = window.performance.now();
  planStepProgress.value = 0;

  const tick = (now: number) => {
    if (runId !== activePlanStepRun) {
      return;
    }

    planStepProgress.value = Math.min(((now - startedAt) / duration) * 100, 98);
    planProgressAnimationFrame = window.requestAnimationFrame(tick);
  };

  planProgressAnimationFrame = window.requestAnimationFrame(tick);
  planStepFallbackTimer = window.setTimeout(() => {
    finishPlanStep(index, runId);
  }, duration + 1800);
};

const showPlanStep = (index: number) => {
  if (!arePlanStepsActive.value) {
    return;
  }

  currentPlanStep.value = index;
  replayPlanStepDemo(index);
  startPlanStepProgress(index);
};

const finishPlanStep = (index: number, runId = activePlanStepRun) => {
  if (!arePlanStepsActive.value) {
    return;
  }

  if (index !== currentPlanStep.value || runId !== activePlanStepRun) {
    return;
  }

  clearPlanStepTimers();
  planStepProgress.value = 100;

  planStepAdvanceTimer = window.setTimeout(() => {
    const nextPlanStep = (currentPlanStep.value + 1) % planSteps.length;
    showPlanStep(nextPlanStep);
  }, 300);
};

const handlePlanDemoMessage = (event: MessageEvent) => {
  if (event.origin !== window.location.origin) {
    return;
  }

  if (!arePlanStepsActive.value) {
    return;
  }

  if (event.data?.type !== "plan-demo-complete" || typeof event.data.step !== "number") {
    return;
  }

  finishPlanStep(event.data.step);
};

const selectPlanStep = (index: number) => {
  if (!arePlanStepsActive.value) {
    return;
  }

  showPlanStep(index);
};

const playSummaryPreviewDemo = () => {
  if (isSummaryPreviewDemoActive.value || isSummaryPreviewReady.value || summaryPreviewTimers.length > 0) {
    return;
  }

  isSummarySectionInView.value = true;
  updateSummaryCursorTarget();
  isSummaryPreviewReady.value = false;
  isSummaryPreviewDemoActive.value = false;
  isSummaryPreviewPressing.value = false;
  isSummaryPreviewScrubbing.value = false;

  queueSummaryPreviewTimer(() => {
    updateSummaryCursorTarget();
    isSummaryPreviewDemoActive.value = true;
  }, 650);

  queueSummaryPreviewTimer(() => {
    startSummaryPreviewProcessing();
  }, 1500);
};

const playPlanStepsDemo = () => {
  if (arePlanStepsActive.value) {
    return;
  }

  arePlanStepsActive.value = true;
  currentPlanStep.value = 0;
  planStepProgress.value = 0;
  showPlanStep(0);
};

const resetPlanStepsDemo = () => {
  arePlanStepsActive.value = false;
  currentPlanStep.value = 0;
  planStepProgress.value = 0;
  activePlanStepRun += 1;
  clearPlanStepTimers();
};

const onboardingSteps = [
  {
    id: "profile",
    title: "Profile",
    heading: "Tell us about yourself",
    description: "Start with the basic details we need to personalize your study workspace.",
  },
  {
    id: "exam",
    title: "Exam",
    heading: "Select your exam",
    description: "Choose a common medical exam path or add your own exam resource.",
  },
  {
    id: "schedule",
    title: "Schedule",
    heading: "Set your timeline",
    description: "Add your exam date and study days so the plan fits your real week.",
  },
  {
    id: "account",
    title: "Account",
    heading: "Save your personalized plan",
    description: "Create an account next so your plan and progress are saved.",
  },
];

const examOptions = ["USMLE Step 1", "USMLE Step 2 CK", "COMLEX", "NCLEX", "PANCE", "Shelf Exam"];
const studyDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const languageOptions = ["English", "Arabic", "Spanish", "French", "German", "Turkish", "Portuguese", "Other"];

const onboardingForm = reactive({
  name: "",
  email: "",
  role: "",
  language: "",
  exam: "",
  customExam: "",
  examDate: "",
  studyDays: [] as string[],
});

const onboardingProgress = computed(() => {
  return (onboardingStep.value / (onboardingSteps.length - 1)) * 100;
});

const isOnboardingStepValid = computed(() => {
  switch (onboardingStep.value) {
    case 0:
      return onboardingForm.name.trim() !== "" && onboardingForm.email.trim() !== "" && onboardingForm.language !== "";
    case 1:
      return onboardingForm.exam !== "" || onboardingForm.customExam.trim() !== "";
    case 2:
      return onboardingForm.examDate !== "" && onboardingForm.studyDays.length > 0;
    default:
      return true;
  }
});

const goToOnboardingStep = (index: number) => {
  if (index <= onboardingStep.value) {
    onboardingStep.value = index;
  }
};

const nextOnboardingStep = () => {
  if (onboardingStep.value < onboardingSteps.length - 1 && isOnboardingStepValid.value) {
    onboardingStep.value += 1;
  }
};

const previousOnboardingStep = () => {
  if (onboardingStep.value > 0) {
    onboardingStep.value -= 1;
  }
};

const submitOnboarding = () => {
  if (!isOnboardingStepValid.value) {
    return;
  }

  if (onboardingStep.value < onboardingSteps.length - 1) {
    nextOnboardingStep();
    return;
  }

  isOnboardingSubmitting.value = true;
  window.setTimeout(() => {
    window.location.href = "/signup";
  }, 500);
};

onMounted(() => {
  if (isOnboardingRoute.value) {
    return;
  }

  updateHeaderScroll();
  startHeroTypewriter();
  setAnatomyVideoPlaybackRate();
  window.addEventListener("scroll", updateHeaderScroll, { passive: true });
  window.addEventListener("resize", handleSummaryLayoutChange, { passive: true });
  window.addEventListener("message", handlePlanDemoMessage);
  updateSummaryCursorTarget();

  heroVideoObserver = observeSectionVisibility(heroVideoSectionRef.value, {
    onEnter: playHeroVideoPreview,
    onExit: resetHeroVideoPreview,
    enterRatio: 0.25,
    exitRatio: 0.05,
  });

  planStepsObserver = observeSectionVisibility(planStepsSectionRef.value, {
    onEnter: playPlanStepsDemo,
    onExit: resetPlanStepsDemo,
    enterRatio: 0.2,
    exitRatio: 0.05,
  });

  summaryPreviewObserver = observeSectionVisibility(featuresSectionRef.value, {
    onEnter: playSummaryPreviewDemo,
    onExit: resetSummaryPreviewDemo,
    enterRatio: 0.35,
    exitRatio: 0.08,
  });

  mindMapObserver = observeSectionVisibility(mindMapSectionRef.value, {
    onEnter: playMindMapDemo,
    onExit: resetMindMapDemo,
    enterRatio: 0.25,
    exitRatio: 0.05,
  });

  whiteboardObserver = observeSectionVisibility(whiteboardSectionRef.value, {
    onEnter: playWhiteboardVideoPreview,
    onExit: resetWhiteboardVideoPreview,
    enterRatio: 0.25,
    exitRatio: 0.05,
  });

  anatomyObserver = observeSectionVisibility(anatomySectionRef.value, {
    onEnter: playAnatomyVideoPreview,
    onExit: resetAnatomyVideoPreview,
    enterRatio: 0.25,
    exitRatio: 0.05,
  });

  socialProofObserver = observeSectionVisibility(socialProofSectionRef.value, {
    onEnter: () => {
      isSocialProofSectionInView.value = true;
    },
    onExit: () => {
      isSocialProofSectionInView.value = false;
    },
    enterRatio: 0.18,
    exitRatio: 0.05,
  });

  faqObserver = observeSectionVisibility(faqSectionRef.value, {
    onEnter: () => {
      isFaqSectionInView.value = true;
    },
    onExit: () => {
      isFaqSectionInView.value = false;
    },
    enterRatio: 0.18,
    exitRatio: 0.05,
  });

});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateHeaderScroll);
  window.removeEventListener("resize", handleSummaryLayoutChange);
  window.removeEventListener("message", handlePlanDemoMessage);
  clearHeroTypewriterTimer();
  clearSummaryPreviewTimers();
  clearMindMapTimers();
  clearPlanStepTimers();

  if (summaryPreviewObserver) {
    summaryPreviewObserver.disconnect();
  }

  if (planStepsObserver) {
    planStepsObserver.disconnect();
  }

  if (heroVideoObserver) {
    heroVideoObserver.disconnect();
  }

  if (mindMapObserver) {
    mindMapObserver.disconnect();
  }

  if (whiteboardObserver) {
    whiteboardObserver.disconnect();
  }

  if (anatomyObserver) {
    anatomyObserver.disconnect();
  }

  if (socialProofObserver) {
    socialProofObserver.disconnect();
  }

  if (faqObserver) {
    faqObserver.disconnect();
  }

});

const testimonialColumns = [
  [
    {
      text: "Medical Student AI is a smart and innovative tool that integrates medical education and AI. The question bank offers high yield concepts and explanations (with great book references) tested on the USMLE. Using this tool along with 3rd and 4th year rotations is a great approach to active learning. The AI aspect of this tool allowed me to ask questions and have feedback right away.",
      name: "Fatima",
      role: "Medical Student",
      rating: 5,
      initials: "FA",
    },
  ],
  [
    {
      text: "As a resident, this has been an absolute game changer. Its a very hands-on, tool that I've used on the go, on rounds and to even double check facts when i doubt myself. It is super fast, easy to use and even back with references to support the data. In all, I've reduced the time spent trying to search stuff the conventional way and now use this tool which has bolstered my knowledge and confidence in clinical decision making.",
      name: "Nosa Ohonba",
      role: "Resident",
      rating: 5,
      initials: "NO",
      image: "/images/testimonials/nosa-ohonba.png",
    },
    {
      text: "Having easy access to a wide range of questions which could be tailored to my preferences! Also the explanations were top tier. I am a tutor for USMLE exams and these explanations made myself understand the depth of my knowledge.",
      name: "Ronaldo Huggins",
      role: "USMLE Tutor",
      rating: 5,
      initials: "RH",
      image: "/images/testimonials/ronaldo-huggins.png",
    },
  ],
  [
    {
      text: "The Medical Student AI website is an excellent tool for medical students and residents wanting to learn or go over pharmacology concepts. The best thing about this tool is that it provides references after giving you the information. The question bank is also helpful because you can use it to test your knowledge and learn more if you get the question wrong.",
      name: "Alice Nassar",
      role: "Medical Student",
      rating: 5,
      initials: "AN",
      image: "/images/testimonials/alice-nassar.png",
    },
  ],
];

const faqItems = [
  {
    question: "Is the information credible?",
    answer: "MedicalStudent.ai is built for medical education workflows and helps you study from your own trusted sources, uploaded materials, and exam-focused references.",
  },
  {
    question: "What exams can I prepare for?",
    answer: "You can prepare for USMLE, PLAB, MCCQE, NCLEX, COMLEX, shelf-style exams, finals, clinical rotations, and targeted topic refreshers.",
  },
  {
    question: "How is MedicalStudent AI different from ChatGPT?",
    answer: "MedicalStudent AI is designed around medical study workflows like building a plan, summarizing lectures, reviewing sources, and keeping answers focused on exam preparation.",
  },
  {
    question: "How does the study plan become personalized?",
    answer: "The workflow adapts around your target topics, progress, missed questions, and the time you have available.",
  },
  {
    question: "Does this replace medical advice or clinical judgment?",
    answer: "No. MedicalStudent.ai is for education and study support. Always verify clinical decisions with qualified professionals and approved references.",
  },
  {
    question: "Can I review on mobile?",
    answer: "Yes. MedicalStudent.ai supports focused study sessions across responsive web and mobile use.",
  },
];

const openFaqIndex = ref<number | null>(0);

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index;
};
</script>

<style>
@font-face {
  font-family: "TT Commons Pro";
  src: url("/fonts/TTCommonsPro-Rg.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "TT Commons Pro";
  src: url("/fonts/TTCommonsPro-Md.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "TT Commons Pro";
  src: url("/fonts/TTCommonsPro-Bd.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "Futura Now Headline";
  src: url("/fonts/FuturaNowHeadlineMedium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "Futura Now Headline";
  src: url("/fonts/FuturaNowHeadlineBold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: block;
}

:root {
  --deep-blue: #06141d;
  --ink-blue: #0a2430;
  --header-height: 76px;
}

* {
  box-sizing: border-box;
}

html,
body,
#__nuxt {
  min-height: 100%;
  overflow-x: hidden;
}

body {
  margin: 0;
  font-family: var(--brand-body-font);
  color: var(--deep-blue);
  background: #ffffff;
}

a {
  color: inherit;
  text-decoration: none;
}

.landing-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #ffffff;
}

.onboarding-page {
  --onboarding-white: #ffffff;
  --onboarding-text-muted: rgba(51, 58, 63, 0.64);
  --onboarding-text-soft: rgba(51, 58, 63, 0.42);
  --onboarding-border: rgba(51, 58, 63, 0.14);
  --onboarding-neutral: rgba(51, 58, 63, 0.1);
  --onboarding-disabled-bg: rgba(51, 58, 63, 0.16);
  --onboarding-disabled-text: rgba(51, 58, 63, 0.42);
  min-height: 100vh;
  overflow-x: hidden;
  padding: clamp(12px, 2vw, 24px) clamp(18px, 3vw, 34px) clamp(10px, 2vw, 18px);
  color: var(--brand-tech-charcoal);
  font-family: var(--brand-body-font);
  background:
    radial-gradient(circle at 50% 42%, rgba(27, 209, 131, 0.18) 0%, rgba(27, 209, 131, 0.09) 28%, transparent 56%),
    linear-gradient(135deg, rgba(27, 166, 209, 0.1) 0%, var(--brand-cloud-grey) 44%, rgba(27, 209, 131, 0.1) 100%);
}

.onboarding-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1120px, 100%);
  margin: 0 auto;
}

.onboarding-login {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  color: var(--brand-tech-charcoal);
  background: rgba(245, 247, 250, 0.72);
  font-size: 15px;
  font-weight: 700;
}

.onboarding-login:hover,
.onboarding-login:focus-visible {
  color: var(--brand-tech-charcoal);
}

.onboarding-shell {
  display: grid;
  place-items: center;
  width: min(720px, 100%);
  min-height: calc(100svh - 74px);
  margin: 0 auto;
  padding: clamp(10px, 2.4vh, 20px) 0;
}

.onboarding-card {
  width: min(540px, 100%);
  justify-self: center;
  overflow: hidden;
  border: 1px solid var(--onboarding-border);
  border-radius: 8px;
  background: var(--onboarding-white);
  box-shadow:
    0 22px 64px rgba(27, 209, 131, 0.18),
    0 10px 34px rgba(51, 58, 63, 0.08);
  animation: previewEnter 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.onboarding-progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding: 14px 18px 9px;
}

.onboarding-progress-step {
  display: grid;
  justify-items: center;
  gap: 5px;
  min-width: 0;
  padding: 0;
  border: 0;
  color: var(--onboarding-text-soft);
  background: transparent;
  cursor: pointer;
  font: inherit;
}

.onboarding-progress-step:disabled {
  cursor: default;
}

.onboarding-progress-step span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--onboarding-neutral);
  color: var(--onboarding-text-muted);
  font-size: 11px;
  font-weight: 700;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.onboarding-progress-step strong {
  overflow: hidden;
  width: 100%;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.onboarding-progress-step.is-active,
.onboarding-progress-step.is-complete {
  color: var(--brand-tech-charcoal);
}

.onboarding-progress-step.is-active span,
.onboarding-progress-step.is-complete span {
  color: var(--onboarding-white);
  background: var(--brand-vital-green);
}

.onboarding-progress-step.is-active span {
  box-shadow: 0 0 0 5px rgba(27, 209, 131, 0.18);
}

.onboarding-progress-bar {
  height: 3px;
  margin: 0 18px;
  overflow: hidden;
  background: var(--onboarding-neutral);
}

.onboarding-progress-bar span {
  display: block;
  height: 100%;
  background: var(--brand-vital-green);
  transition: width 260ms ease;
}

.onboarding-step-panel {
  min-height: 248px;
  padding: 22px 28px 0;
}

.onboarding-step-heading {
  margin-bottom: 16px;
}

.onboarding-step-heading h2 {
  margin: 0;
  color: var(--brand-tech-charcoal);
  font-family: var(--brand-heading-font);
  font-size: clamp(24px, 2.6vw, 32px);
  font-weight: 700;
  line-height: 1;
}

.onboarding-step-heading > span {
  display: block;
  margin-top: 8px;
  color: var(--onboarding-text-muted);
  font-family: var(--brand-heading-font);
  font-size: 14px;
  line-height: 1.36;
}

.onboarding-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 14px;
}

.onboarding-field {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.onboarding-field-full {
  grid-column: 1 / -1;
}

.onboarding-field > span {
  color: var(--brand-tech-charcoal);
  font-size: 13px;
  font-weight: 700;
}

.onboarding-field input,
.onboarding-field select,
.onboarding-field textarea {
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--onboarding-border);
  border-radius: 14px;
  color: var(--brand-tech-charcoal);
  background: var(--onboarding-white);
  accent-color: var(--brand-vital-green);
  font: inherit;
  font-size: 14px;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.onboarding-field input,
.onboarding-field select {
  padding: 0 12px;
}

.onboarding-field textarea {
  min-height: 72px;
  resize: vertical;
  padding: 12px;
  line-height: 1.4;
}

.onboarding-field input:focus,
.onboarding-field select:focus,
.onboarding-field textarea:focus {
  border-color: var(--brand-vital-green);
  outline: 3px solid rgba(27, 209, 131, 0.2);
}

.onboarding-option-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.onboarding-option-grid.compact {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.onboarding-option,
.onboarding-chip {
  display: flex;
  align-items: center;
  min-width: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 14px;
  color: var(--brand-tech-charcoal);
  background: var(--onboarding-white);
  cursor: pointer;
  font-weight: 700;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.onboarding-option {
  min-height: 40px;
  padding: 0 12px;
}

.onboarding-chip {
  min-height: 34px;
  justify-content: center;
  padding: 0 12px;
  font-size: 13px;
}

.onboarding-option input,
.onboarding-chip input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.onboarding-option span,
.onboarding-chip span {
  overflow-wrap: anywhere;
}

.onboarding-option:hover,
.onboarding-chip:hover,
.onboarding-option.is-selected,
.onboarding-chip.is-selected {
  border-color: var(--brand-vital-green);
  color: var(--onboarding-white);
  background: var(--brand-vital-green);
}

.onboarding-option.is-selected,
.onboarding-chip.is-selected {
  transform: translateY(-1px);
}

.onboarding-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.onboarding-summary {
  display: grid;
  gap: 10px;
}

.summary-card {
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: var(--brand-cloud-grey);
}

.summary-card span {
  color: var(--onboarding-text-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.summary-card strong {
  color: var(--brand-tech-charcoal);
  font-size: 15px;
  line-height: 1.25;
}

.onboarding-summary p {
  margin: 2px 0 0;
  color: var(--onboarding-text-muted);
  font-size: 14px;
  line-height: 1.38;
}

.onboarding-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 28px 20px;
}

.onboarding-primary,
.onboarding-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  min-width: 112px;
  padding: 0 18px;
  border-radius: 14px;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    opacity 180ms ease;
}

.onboarding-primary {
  border: 1px solid var(--brand-vital-green);
  color: var(--onboarding-white);
  background: var(--brand-vital-green);
}

.onboarding-primary:hover,
.onboarding-primary:focus-visible {
  border-color: var(--brand-vital-green);
  background: var(--brand-vital-green);
}

.onboarding-secondary {
  border: 1px solid var(--brand-tech-charcoal);
  color: var(--brand-tech-charcoal);
  background: transparent;
}

.onboarding-primary:disabled,
.onboarding-secondary:disabled {
  cursor: not-allowed;
  opacity: 1;
}

.onboarding-primary:disabled {
  border-color: var(--onboarding-disabled-bg);
  color: var(--onboarding-disabled-text);
  background: var(--onboarding-disabled-bg);
}

.onboarding-secondary:disabled {
  border-color: var(--onboarding-border);
  color: var(--onboarding-disabled-text);
  background: rgba(245, 247, 250, 0.58);
}

.onboarding-page .brand-link:focus-visible,
.onboarding-page .onboarding-login:focus-visible,
.onboarding-page .onboarding-primary:focus-visible,
.onboarding-page .onboarding-secondary:focus-visible,
.onboarding-page .onboarding-progress-step:focus-visible {
  outline-color: var(--brand-vital-green);
}

.onboarding-step-enter-active,
.onboarding-step-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.onboarding-step-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.onboarding-step-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.hero-section {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  min-height: 100svh;
  overflow: hidden;
  padding: calc(var(--header-height) + clamp(76px, 12svh, 122px)) clamp(20px, 4vw, 48px) clamp(112px, 18svh, 190px);
  background:
    radial-gradient(circle at 5% 0%, rgba(11, 26, 34, 0.86) 0%, rgba(11, 26, 34, 0.34) 24%, transparent 47%),
    radial-gradient(circle at 96% 0%, rgba(11, 26, 34, 0.78) 0%, rgba(11, 26, 34, 0.32) 22%, transparent 46%),
    linear-gradient(
      155deg,
      #0c5574 0%,
      #106987 13%,
      #177c8d 25%,
      #209498 36%,
      #2eafa3 49%,
      #4fc8b5 62%,
      #80ddca 74%,
      #b8ece3 86%,
      #fefdfd 100%
    );
}

.hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(180deg, rgba(11, 26, 34, 0.42) 0%, transparent 30%),
    linear-gradient(180deg, transparent 72%, #ffffff 100%);
  pointer-events: none;
}

.hero-section::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  z-index: -1;
  height: 24%;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.82) 68%, #ffffff 100%);
  pointer-events: none;
}

.site-header {
  position: fixed;
  top: clamp(14px, 2.4vw, 22px);
  left: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  min-width: 0;
  padding: 0 clamp(18px, 4vw, 48px);
  background: transparent;
  pointer-events: none;
  animation: enterDown 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, 775px);
  height: 64px;
  min-width: 0;
  padding: 8px 10px 8px 24px;
  border: 1px solid rgba(6, 20, 29, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.93);
  box-shadow:
    0 18px 46px rgba(6, 20, 29, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(18px);
  pointer-events: auto;
  transition:
    width 220ms ease,
    padding 220ms ease,
    border-color 220ms ease,
    background-color 220ms ease,
    box-shadow 220ms ease,
    backdrop-filter 220ms ease;
}

.site-header.is-scrolled .site-nav {
  width: min(100%, 700px);
  border-color: rgba(6, 20, 29, 0.12);
  background: rgba(255, 255, 255, 0.96);
  box-shadow:
    0 16px 42px rgba(6, 20, 29, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.brand-link {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  width: 130px;
  min-width: 0;
}

.brand-logo {
  display: block;
  width: 100%;
  height: auto;
}

.header-links {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  gap: clamp(14px, 1.7vw, 24px);
  padding: 0 18px;
}

.header-links a {
  color: rgba(6, 20, 29, 0.82);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.header-links a:hover,
.header-links a:focus-visible {
  color: var(--deep-blue);
  transform: translateY(-1px);
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  min-width: 0;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.nav-link,
.nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: 8px;
  white-space: nowrap;
}

.nav-link {
  padding: 0 10px;
  color: rgba(6, 20, 29, 0.76);
}

.nav-link:hover,
.nav-link:focus-visible {
  color: var(--deep-blue);
}

.nav-button {
  min-width: 126px;
  padding: 0 22px;
  border: 1px solid var(--vital-green);
  border-radius: 8px;
  color: #ffffff;
  background: var(--vital-green);
  box-shadow:
    0 10px 24px rgba(27, 209, 131, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
  text-transform: uppercase;
}

.nav-button:hover,
.nav-button:focus-visible {
  border-color: #17b973;
  background: #17b973;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  flex: 1;
  grid-template-columns: minmax(300px, 0.85fr) minmax(420px, 1.15fr);
  align-items: center;
  justify-content: space-between;
  gap: clamp(40px, 7vw, 88px);
  min-width: 0;
  min-height: 0;
  width: min(1140px, 100%);
  margin: 0 auto;
  text-align: left;
}

.hero-copy {
  justify-self: start;
  width: min(540px, 100%);
  min-width: 0;
}

.hero-copy h1 {
  max-width: 28rem;
  margin: 0;
  color: #ffffff;
  font-family: "Futura Now Headline", "Avenir Next", Avenir, "Century Gothic", Futura, "Trebuchet MS", sans-serif;
  font-size: clamp(40px, 3.75vw, 48px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  text-wrap: balance;
  overflow-wrap: break-word;
  text-shadow: 0 18px 46px rgba(6, 20, 29, 0.24);
  animation: enterUp 620ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both;
}

.hero-subheadline {
  max-width: 460px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-family: "Helvetica Neue", Arial, "TT Commons Pro", sans-serif;
  font-size: clamp(16px, 1.35vw, 18px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0;
  overflow-wrap: break-word;
  text-wrap: balance;
  text-shadow: 0 10px 28px rgba(6, 20, 29, 0.2);
  animation: enterUp 620ms cubic-bezier(0.16, 1, 0.3, 1) 190ms both;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 44px;
  margin-top: 16px;
  padding: 0 28px;
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 8px;
  color: var(--deep-blue);
  background: rgba(255, 255, 255, 0.96);
  box-shadow:
    0 18px 42px rgba(6, 20, 29, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  animation: enterUp 620ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both;
  transition:
    background-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.hero-cta::before {
  content: "";
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vital-green);
  box-shadow: 0 0 14px rgba(27, 209, 131, 0.62);
}

.hero-cta:hover,
.hero-cta:focus-visible {
  background: #ffffff;
  box-shadow:
    0 22px 50px rgba(6, 20, 29, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.hero-cta svg {
  width: 17px;
  height: 17px;
}

.hero-cta path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero-chatbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  justify-self: end;
  width: min(560px, 100%);
  min-height: 68px;
  margin: clamp(18px, 4svh, 42px) 0 0;
  padding: 8px 8px 8px 26px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 14px;
  color: var(--ink-blue);
  background: rgba(255, 255, 255, 0.94);
  box-shadow:
    0 24px 60px rgba(6, 20, 29, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  animation: enterUp 620ms cubic-bezier(0.16, 1, 0.3, 1) 410ms both;
}

.hero-chat-placeholder {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: rgba(6, 20, 29, 0.66);
  font-size: clamp(15px, 1.5vw, 18px);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.2;
  text-align: left;
  white-space: nowrap;
}

.hero-chat-rotating-word {
  display: inline-block;
  color: rgba(6, 20, 29, 0.78);
  font-weight: 700;
  animation: chatWordRotate 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-chat-cursor {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin-left: 3px;
  background: rgba(6, 20, 29, 0.68);
  vertical-align: -0.14em;
  animation: cursorBlink 900ms steps(1) infinite;
}

.hero-chat-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 56px;
  height: 52px;
  border-radius: 12px;
  color: #ffffff;
  background: var(--deep-blue);
  box-shadow:
    0 14px 28px rgba(6, 20, 29, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.hero-chat-submit svg {
  width: 23px;
  height: 23px;
}

.hero-chat-submit path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero-trusted {
  position: absolute;
  left: max(clamp(20px, 4vw, 48px), calc((100vw - 1140px) / 2));
  bottom: clamp(28px, 5.5svh, 64px);
  z-index: 1;
  display: grid;
  gap: 14px;
  width: min(680px, calc(100% - 40px));
  color: rgba(6, 20, 29, 0.52);
  animation: enterUp 620ms cubic-bezier(0.16, 1, 0.3, 1) 520ms both;
}

.hero-trusted-title {
  margin: 0;
  color: rgba(6, 20, 29, 0.56);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  line-height: 1;
  text-transform: uppercase;
}

.hero-trusted-list {
  position: relative;
  display: flex;
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
}

.hero-trusted-track {
  display: flex;
  align-items: center;
  width: max-content;
  min-width: max-content;
  animation: trustedLogoScroll 18s linear infinite;
}

.hero-trusted-item {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 10px;
  min-width: clamp(212px, 19vw, 260px);
  padding-right: clamp(22px, 3vw, 42px);
  color: rgba(6, 20, 29, 0.5);
}

.hero-trusted-item span {
  max-width: 150px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.08;
}

.hero-trusted-item img {
  display: block;
  flex: 0 0 auto;
  width: auto;
  max-width: 48px;
  height: clamp(20px, 1.8vw, 26px);
  object-fit: contain;
  opacity: 0.6;
  filter: grayscale(1) brightness(0.48) contrast(0.88);
}

.hero-video-section {
  padding: clamp(46px, 7vw, 88px) clamp(20px, 4vw, 48px);
  background: #ffffff;
}

.hero-video-shell {
  width: min(1040px, 100%);
  margin: 0 auto;
}

.hero-video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(6, 20, 29, 0.1);
  border-radius: 14px;
  background: #06141d;
  box-shadow: 0 28px 80px rgba(6, 20, 29, 0.18);
  object-fit: cover;
}

.section-shell {
  width: min(1228px, calc(100% - clamp(40px, 10vw, 160px)));
  margin: 0 auto;
}

.feature-steps-section {
  padding: clamp(48px, 6vw, 76px) 0;
  background: #ffffff;
}

.feature-steps-shell h2 {
  margin: 0 0 clamp(24px, 3.5vw, 36px);
  color: var(--deep-blue);
  font-family: "Futura Now Headline", "Avenir Next", Avenir, "Century Gothic", Futura, "Trebuchet MS", sans-serif;
  font-size: clamp(26px, 2.7vw, 34px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: 0;
  text-align: center;
  text-wrap: balance;
}

.feature-steps-grid {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
  align-items: center;
  gap: clamp(24px, 4vw, 52px);
}

.feature-steps-list {
  display: grid;
  gap: clamp(14px, 2vw, 22px);
}

.feature-step {
  display: flex;
  align-items: center;
  width: 100%;
  gap: clamp(14px, 2.2vw, 22px);
  padding: 0;
  border: 0;
  border-radius: 8px;
  color: rgba(6, 20, 29, 0.44);
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
  opacity: 0.45;
  transition:
    color 260ms ease,
    opacity 260ms ease,
    transform 260ms ease;
}

.feature-step:hover,
.feature-step:focus-visible,
.feature-step.is-active {
  color: var(--deep-blue);
  opacity: 1;
}

.feature-step.is-active {
  transform: translateX(4px);
}

.feature-step-marker {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: clamp(30px, 2.6vw, 36px);
  height: clamp(30px, 2.6vw, 36px);
  border: 2px solid rgba(6, 20, 29, 0.18);
  border-radius: 50%;
  color: rgba(6, 20, 29, 0.58);
  background: #ffffff;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  transition:
    border-color 260ms ease,
    background-color 260ms ease,
    color 260ms ease,
    transform 260ms ease;
}

.feature-step.is-active .feature-step-marker {
  border-color: var(--deep-blue);
  color: #ffffff;
  background: var(--deep-blue);
  transform: scale(1.08);
}

.feature-step-copy {
  display: grid;
  flex: 1;
  min-width: 0;
  gap: 5px;
}

.feature-step-copy strong {
  color: currentColor;
  font-size: clamp(18px, 1.6vw, 23px);
  font-weight: 700;
  line-height: 1.12;
}

.feature-step-copy > span:not(.feature-step-progress) {
  color: rgba(6, 20, 29, 0.58);
  font-size: clamp(14px, 1.1vw, 16px);
  line-height: 1.36;
}

.feature-step-progress {
  display: block;
  overflow: hidden;
  width: min(220px, 100%);
  height: 3px;
  margin-top: 5px;
  background: rgba(6, 20, 29, 0.08);
}

.feature-step-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--scholars-sky), var(--vital-green));
  transition: width 100ms linear;
}

.feature-visual {
  position: relative;
  min-height: clamp(240px, 34vw, 400px);
  overflow: hidden;
  border: 1px solid rgba(6, 20, 29, 0.1);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(27, 166, 209, 0.08), rgba(27, 209, 131, 0.1)),
    #ffffff;
  box-shadow: 0 20px 54px rgba(6, 20, 29, 0.08);
}

.feature-visual-panel {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  padding: clamp(18px, 2.8vw, 30px);
  opacity: 0;
  transform: translateY(80px) rotateX(-14deg);
  transform-origin: center top;
  pointer-events: none;
  transition:
    opacity 420ms ease,
    transform 520ms cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-visual-panel.is-active {
  opacity: 1;
  transform: translateY(0) rotateX(0);
}

.feature-visual-panel.has-demo {
  display: block;
  padding: 0;
}

.getting-started-demo-embed {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #f4f6f8;
}

.getting-started-demo-embed iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.visual-toolbar {
  display: flex;
  gap: 7px;
}

.visual-toolbar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(6, 20, 29, 0.22);
}

.visual-content {
  align-self: end;
  padding: clamp(20px, 3vw, 32px);
  border: 1px solid rgba(6, 20, 29, 0.09);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(14px);
}

.visual-content p {
  margin: 0;
  color: rgba(27, 209, 131, 0.9);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.visual-content h3 {
  margin: 10px 0 0;
  color: var(--deep-blue);
  font-size: clamp(24px, 2.4vw, 34px);
  line-height: 1;
}

.visual-card-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.visual-card-stack span {
  padding: 9px 12px;
  border: 1px solid rgba(6, 20, 29, 0.1);
  border-radius: 8px;
  color: rgba(6, 20, 29, 0.68);
  background: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.feature-preview-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  margin-top: 18px;
  padding: 0 18px;
  border: 1px solid var(--deep-blue);
  border-radius: 8px;
  color: #ffffff;
  background: var(--deep-blue);
  font-size: 14px;
  font-weight: 700;
}

.features-section {
  position: relative;
  overflow: hidden;
  min-height: clamp(560px, 76svh, 760px);
  padding: clamp(70px, 8vw, 112px) 0;
  color: #ffffff;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 18%),
    radial-gradient(circle at 78% 16%, rgba(27, 166, 209, 0.18), transparent 32%),
    radial-gradient(circle at 48% 100%, rgba(27, 209, 131, 0.16), transparent 36%),
    #151515;
}

.features-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      56deg,
      rgba(27, 166, 209, 0.12) 0,
      rgba(27, 166, 209, 0.12) 1px,
      transparent 1px,
      transparent 8px
    );
  opacity: 0.26;
  pointer-events: none;
}

.features-section::after {
  content: "";
  position: absolute;
  right: -8vw;
  bottom: -22vw;
  width: 72vw;
  height: 44vw;
  border-radius: 50%;
  background: linear-gradient(90deg, rgba(27, 166, 209, 0.28), rgba(27, 209, 131, 0.22));
  filter: blur(90px);
  opacity: 0.72;
  pointer-events: none;
}

.features-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(280px, 0.84fr) minmax(380px, 1.16fr);
  align-items: center;
  gap: clamp(42px, 7vw, 96px);
}

.features-anatomy-shell {
  grid-template-columns: minmax(300px, 0.64fr) minmax(560px, 1.36fr);
  gap: clamp(34px, 5vw, 72px);
}

.features-mindmap-shell {
  grid-template-columns: minmax(420px, 0.72fr) minmax(560px, 1.28fr);
  gap: clamp(34px, 4vw, 56px);
}

.features-mindmap-shell .features-copy h2 {
  font-size: clamp(46px, 4.8vw, 66px);
}

.features-mindmap-shell .features-copy h2 span {
  white-space: nowrap;
}

.features-copy {
  max-width: 500px;
  animation: enterUp 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.features-kicker {
  margin: 0;
  color: rgba(245, 247, 250, 0.86);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  line-height: 1;
  text-transform: uppercase;
}

.features-copy h2 {
  display: grid;
  gap: 3px;
  margin: 18px 0 0;
  color: rgba(245, 247, 250, 0.94);
  font-family: "Futura Now Headline", "Avenir Next", Avenir, "Century Gothic", Futura, "Trebuchet MS", sans-serif;
  font-size: clamp(46px, 5.3vw, 72px);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 0.98;
  text-wrap: balance;
}

.features-copy h2 span {
  display: block;
}

.features-description {
  max-width: 390px;
  margin: 22px 0 0;
  color: rgba(245, 247, 250, 0.82);
  font-size: clamp(14px, 1vw, 16px);
  font-weight: 500;
  line-height: 1.42;
}

.features-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-width: 168px;
  min-height: 48px;
  margin-top: 28px;
  padding: 0 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: rgba(245, 247, 250, 0.96);
  background: rgba(22, 22, 22, 0.86);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.features-cta:hover,
.features-cta:focus-visible {
  border-color: rgba(27, 209, 131, 0.44);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.36);
  transform: translateY(-1px);
}

.features-cta > span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1bd183;
  box-shadow: 0 0 18px rgba(27, 209, 131, 0.72);
}

.features-summary-card {
  position: relative;
  display: grid;
  justify-self: end;
  width: min(100%, 470px);
  min-height: 335px;
  overflow: hidden;
  padding: clamp(16px, 2vw, 20px);
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: 16px;
  color: rgba(6, 20, 29, 0.66);
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    17px 28px 20px rgba(0, 0, 0, 0.05),
    8px 12px 15px rgba(0, 0, 0, 0.09),
    2px 3px 8px rgba(0, 0, 0, 0.1);
  animation: featureCardEnter 820ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
}

.features-summary-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(27, 166, 209, 0.1), transparent 42%),
    radial-gradient(circle at 100% 0, rgba(27, 209, 131, 0.12), transparent 34%);
  pointer-events: none;
}

.features-section:not(.is-in-view) .features-copy,
.features-section:not(.is-in-view) .features-summary-card {
  animation: none;
  opacity: 0;
  transform: translateY(28px);
}

.features-section.is-in-view .features-copy {
  animation: enterUp 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.features-section.is-in-view .features-summary-card {
  animation: featureCardEnter 820ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
}

.features-anatomy-card {
  aspect-ratio: 172 / 97;
  min-height: 0;
  padding: 0;
  width: min(100%, 720px);
  background: #081017;
}

.features-anatomy-card::before {
  z-index: 1;
}

.features-anatomy-video {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.features-whiteboard-card {
  background: #eef3f7;
  color: #172033;
}

.features-whiteboard-card::before {
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(8, 16, 23, 0.02), rgba(8, 16, 23, 0.08)),
    radial-gradient(circle at 18% 12%, rgba(27, 209, 131, 0.14), transparent 28%);
}

.features-whiteboard-video {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.features-mindmap-card {
  background: #f6f8fb;
  color: #182232;
}

.features-mindmap-card::before {
  content: none;
}

.mindmap-demo {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  background:
    radial-gradient(circle at 55% 46%, rgba(27, 209, 131, 0.06), transparent 34%),
    linear-gradient(180deg, #ffffff 0 74px, #eef2f6 74px 100%);
}

.mindmap-demo-header {
  position: absolute;
  z-index: 8;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 74px;
  padding: 0 22px;
  border-bottom: 1px solid rgba(20, 36, 54, 0.08);
  background: rgba(255, 255, 255, 0.92);
}

.mindmap-demo-header strong {
  overflow: hidden;
  color: #172033;
  font-size: clamp(13px, 1.15vw, 16px);
  font-weight: 800;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mindmap-demo-header span {
  margin-top: 6px;
  color: rgba(23, 32, 51, 0.58);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.mindmap-controls {
  position: absolute;
  z-index: 9;
  top: 92px;
  left: 20px;
  display: grid;
  gap: 10px;
}

.mindmap-controls span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(20, 36, 54, 0.12);
  border-radius: 50%;
  color: #425066;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 5px 16px rgba(20, 36, 54, 0.08);
}

.mindmap-controls svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mindmap-viewport {
  position: absolute;
  inset: 74px 0 0;
  overflow: hidden;
}

.mindmap-world {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 960px;
  height: 540px;
  transform: translate(-50%, -50%) translate(94px, 0) scale(1.08);
  transform-origin: 50% 50%;
  transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
}

.features-mindmap-card.is-first .mindmap-world {
  transform: translate(-50%, -50%) translate(-8px, -2px) scale(0.66);
}

.features-mindmap-card.is-focus-def .mindmap-world,
.features-mindmap-card.is-def-expanded .mindmap-world {
  transform: translate(-50%, -50%) translate(-96px, 108px) scale(1.02);
}

.features-mindmap-card.is-focus-term .mindmap-world {
  transform: translate(-50%, -50%) translate(-96px, 72px) scale(0.96);
}

.features-mindmap-card.is-term-expanded .mindmap-world {
  transform: translate(-50%, -50%) translate(-126px, 30px) scale(0.88);
}

.features-mindmap-card.is-full .mindmap-world {
  transform: translate(-50%, -50%) translate(-6px, -4px) scale(0.60);
}

.features-mindmap-card.is-collapse .mindmap-world {
  transform: translate(-50%, -50%) translate(94px, 0) scale(1.08);
}

.mindmap-lines {
  position: absolute;
  inset: 0;
  overflow: visible;
}

.mindmap-link {
  fill: none;
  stroke: #28c9f2;
  stroke-width: 2.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  pathLength: 1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition:
    opacity 180ms ease,
    stroke-dashoffset 520ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mindmap-node {
  position: absolute;
  left: var(--x);
  top: var(--y);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 160px;
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid rgba(20, 36, 54, 0.10);
  border-radius: 8px;
  color: #172033;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(20, 36, 54, 0.12);
  font-size: 9.5px;
  font-weight: 800;
  line-height: 1.14;
  opacity: 0;
  transform: translate(-18px, 0) scale(0.88);
  transform-origin: left center;
  transition:
    opacity 300ms ease,
    border-color 240ms ease,
    box-shadow 240ms ease,
    transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mindmap-node > span {
  flex: 0 0 auto;
  color: rgba(23, 32, 51, 0.54);
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}

.mindmap-root {
  width: 170px;
  min-height: 48px;
  border-color: rgba(40, 201, 242, 0.58);
  background: #b9f6ff;
  box-shadow: 0 12px 26px rgba(40, 201, 242, 0.20);
  opacity: 1;
  transform: translate(0, 0) scale(1);
}

.mindmap-root strong {
  display: block;
  font-size: 9px;
  line-height: 1.15;
}

.mindmap-root span {
  display: block;
  margin-top: 4px;
  color: rgba(23, 32, 51, 0.62);
  font-size: 8px;
  font-weight: 700;
}

.child-node {
  width: 142px;
  min-height: 30px;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 8.6px;
  transform: translate(-12px, 0) scale(0.86);
}

.features-mindmap-card.is-first .first-node,
.features-mindmap-card.is-focus-def .first-node,
.features-mindmap-card.is-def-expanded .first-node,
.features-mindmap-card.is-focus-term .first-node,
.features-mindmap-card.is-term-expanded .first-node,
.features-mindmap-card.is-full .first-node,
.features-mindmap-card.is-first .first-link,
.features-mindmap-card.is-focus-def .first-link,
.features-mindmap-card.is-def-expanded .first-link,
.features-mindmap-card.is-focus-term .first-link,
.features-mindmap-card.is-term-expanded .first-link,
.features-mindmap-card.is-full .first-link {
  opacity: 1;
  stroke-dashoffset: 0;
  transform: translate(0, 0) scale(1);
  transition-delay: var(--delay);
}

.features-mindmap-card.is-focus-def .first-node:first-of-type,
.features-mindmap-card.is-def-expanded .first-node:first-of-type,
.features-mindmap-card.is-focus-term .first-node:nth-of-type(3),
.features-mindmap-card.is-term-expanded .first-node:nth-of-type(3) {
  border-color: rgba(40, 201, 242, 0.74);
  box-shadow: 0 10px 24px rgba(40, 201, 242, 0.20);
}

.features-mindmap-card.is-def-expanded .def-child,
.features-mindmap-card.is-focus-term .def-child,
.features-mindmap-card.is-term-expanded .def-child,
.features-mindmap-card.is-full .def-child,
.features-mindmap-card.is-def-expanded .def-link,
.features-mindmap-card.is-focus-term .def-link,
.features-mindmap-card.is-term-expanded .def-link,
.features-mindmap-card.is-full .def-link {
  opacity: 1;
  stroke-dashoffset: 0;
  transform: translate(0, 0) scale(1);
  transition-delay: var(--delay);
}

.features-mindmap-card.is-term-expanded .term-child,
.features-mindmap-card.is-full .term-child,
.features-mindmap-card.is-term-expanded .term-link,
.features-mindmap-card.is-full .term-link {
  opacity: 1;
  stroke-dashoffset: 0;
  transform: translate(0, 0) scale(1);
  transition-delay: var(--delay);
}

.features-mindmap-card.is-collapse .mindmap-node:not(.mindmap-root),
.features-mindmap-card.is-collapse .mindmap-link {
  opacity: 0;
  stroke-dashoffset: 1;
  transform: translate(-12px, 0) scale(0.9);
  transition-delay: 0ms;
}

.features-summary-layer,
.features-summary-overview,
.features-card-header,
.features-summary-meta,
.features-summary-copy,
.features-summary-list {
  position: relative;
  z-index: 1;
}

.features-summary-layer {
  grid-area: 1 / 1;
  min-width: 0;
  transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.features-summary-before {
  display: flex;
  flex-direction: column;
  opacity: 1;
}

.features-summary-card.is-summarized .features-summary-before {
  opacity: 0;
  pointer-events: none;
}

.features-summary-after {
  pointer-events: none;
}

.features-summary-card.is-summarized .features-summary-after {
  pointer-events: auto;
}

.features-summary-overview {
  opacity: 0;
  transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.features-summary-card.is-summarized .features-summary-overview {
  opacity: 1;
}

.features-source-preview {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 0;
  overflow: hidden;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.92);
  background: #081017;
}

.features-source-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.features-video-overlay {
  position: absolute;
  inset: auto 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #ffffff;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.65));
}

.features-video-overlay span {
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.features-video-overlay svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.features-video-scrubber {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.24);
}

.features-video-scrubber span {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--vital-green);
  box-shadow: 0 0 16px rgba(27, 209, 131, 0.7);
  transform: scaleX(0.012);
  transform-origin: left center;
}

.features-summary-card.is-scrubbing .features-video-scrubber span {
  animation: summaryVideoScrub 1350ms ease-in-out forwards;
}

.features-video-title-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin-top: 18px;
}

.features-video-source-pill {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 7px;
  color: var(--deep-blue);
  background: rgba(27, 209, 131, 0.14);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}

.features-summary-before .features-card-title h3 {
  white-space: normal;
}

.features-summary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: fit-content;
  min-height: 42px;
  margin-top: auto;
  padding: 0 18px;
  border: 1px solid rgba(6, 20, 29, 0.1);
  border-radius: 8px;
  color: var(--deep-blue);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 30px rgba(6, 20, 29, 0.12);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
  transition:
    background-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.features-summary-action span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vital-green);
  box-shadow: 0 0 16px rgba(27, 209, 131, 0.7);
}

.features-summary-action:hover,
.features-summary-action:focus-visible {
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(6, 20, 29, 0.16);
  transform: translateY(-1px);
}

.features-summary-card.is-auto-pressing .features-summary-action {
  box-shadow: 0 8px 22px rgba(6, 20, 29, 0.14);
  transform: scale(0.96);
}

.features-demo-cursor {
  position: absolute;
  left: calc(100% - 86px);
  top: calc(100% - 78px);
  z-index: 3;
  display: inline-flex;
  width: 30px;
  height: 30px;
  color: var(--deep-blue);
  opacity: 0;
  pointer-events: none;
  transform: translate(160px, -118px) rotate(-10deg);
  filter: drop-shadow(0 10px 16px rgba(6, 20, 29, 0.28));
}

.features-demo-cursor svg {
  display: block;
  width: 100%;
  height: 100%;
}

.features-demo-cursor path {
  fill: #ffffff;
  stroke: var(--deep-blue);
  stroke-width: 1.8;
  stroke-linejoin: round;
}

.features-summary-card.is-demo-active .features-demo-cursor {
  animation: summaryCursorMove 850ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
}

.features-summary-card.is-auto-pressing .features-demo-cursor {
  animation: none;
  opacity: 1;
  transform: translate(0, 0) scale(0.9) rotate(-10deg);
}

.features-card-header {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.features-card-thumb {
  display: block;
  width: 72px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid rgba(6, 20, 29, 0.08);
  border-radius: 7px;
  background: #081017;
}

.features-card-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.features-card-title {
  min-width: 0;
}

.features-card-title h3 {
  margin: 0;
  overflow: hidden;
  color: var(--deep-blue);
  font-size: clamp(14px, 1.25vw, 16px);
  font-weight: 700;
  line-height: 1.18;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.features-card-title p {
  margin: 5px 0 0;
  overflow: hidden;
  color: rgba(6, 20, 29, 0.5);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.features-summary-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(6, 20, 29, 0.08);
}

.features-summary-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 8px;
  color: #0f9f64;
  background: rgba(27, 209, 131, 0.14);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
}

.features-summary-pill span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vital-green);
}

.features-summary-time {
  margin-left: auto;
  color: rgba(6, 20, 29, 0.48);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.features-summary-time strong {
  color: #0f9f64;
  font-size: 14px;
}

.features-summary-copy {
  margin: 16px 0 0;
  color: rgba(6, 20, 29, 0.6);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.42;
}

.features-summary-list {
  display: grid;
  gap: 13px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.features-summary-list li {
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr);
  align-items: baseline;
  gap: 12px;
  opacity: 0;
  transition: opacity 190ms cubic-bezier(0.16, 1, 0.3, 1);
}

.features-summary-card.is-summarized .features-summary-list li {
  opacity: 1;
}

.features-summary-list time {
  color: #0f9f64;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
}

.features-summary-list span {
  color: rgba(6, 20, 29, 0.58);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.38;
}

.features-summary-list strong {
  color: var(--deep-blue);
  font-weight: 700;
}

.social-proof-section {
  position: relative;
  overflow: hidden;
  padding: clamp(54px, 7vw, 84px) 0;
  background: #ffffff;
}

.social-proof-section::before,
.faq-section::before {
  content: none;
}

.testimonials-shell {
  position: relative;
}

.testimonials-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  animation: enterUp 820ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.testimonials-heading h2 {
  max-width: 560px;
  margin: 0;
  color: var(--deep-blue);
  font-family: "Futura Now Headline", "Avenir Next", Avenir, "Century Gothic", Futura, "Trebuchet MS", sans-serif;
  font-size: clamp(26px, 2.8vw, 34px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: 0;
  text-wrap: balance;
}

.testimonials-heading p {
  max-width: 520px;
  margin: 14px 0 0;
  color: rgba(6, 20, 29, 0.62);
  font-size: clamp(16px, 1.35vw, 19px);
  line-height: 1.36;
}

.section-kicker {
  margin: 0;
  color: rgba(27, 209, 131, 0.92);
  font-size: 15px;
  font-weight: 700;
}

.testimonials-columns {
  display: flex;
  justify-content: center;
  gap: 18px;
  max-height: 520px;
  margin-top: clamp(26px, 4vw, 36px);
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
}

.testimonial-column {
  flex: 0 1 300px;
  min-width: 0;
  overflow: hidden;
}

.testimonial-column-2 .testimonial-scroll {
  animation-duration: 38s;
}

.testimonial-column-3 .testimonial-scroll {
  animation-duration: 34s;
}

.testimonial-scroll {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 18px;
  background: #ffffff;
  animation: testimonialsScroll 30s linear infinite;
}

.social-proof-section:not(.is-in-view) .testimonials-heading {
  animation: none;
  opacity: 0;
  transform: translateY(28px);
}

.social-proof-section:not(.is-in-view) .testimonial-scroll {
  animation-name: none;
  transform: translateY(0);
}

.social-proof-section.is-in-view .testimonials-heading {
  animation: enterUp 820ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.social-proof-section.is-in-view .testimonial-scroll {
  animation-name: testimonialsScroll;
}

.testimonial-card {
  width: 100%;
  padding: clamp(20px, 2.4vw, 28px);
  border: 1px solid rgba(6, 20, 29, 0.1);
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(6, 20, 29, 0.08);
}

.testimonial-card p {
  margin: 0;
  color: var(--deep-blue);
  font-size: 15.5px;
  font-weight: 500;
  line-height: 1.38;
}

.testimonial-card footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.testimonial-avatar {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(27, 166, 209, 0.22);
  border-radius: 50%;
  color: var(--deep-blue);
  background: linear-gradient(135deg, rgba(27, 166, 209, 0.16), rgba(27, 209, 131, 0.18));
  font-size: 12px;
  font-weight: 700;
  overflow: hidden;
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-card strong {
  display: block;
  color: var(--deep-blue);
  font-size: 15px;
  line-height: 1.2;
}

.testimonial-card footer span span {
  display: block;
  margin-top: 2px;
  color: rgba(6, 20, 29, 0.58);
  font-size: 14px;
  line-height: 1.2;
}

.faq-section {
  position: relative;
  overflow: hidden;
  padding: clamp(54px, 7vw, 84px) 0;
  background: #ffffff;
}

.faq-shell {
  position: relative;
  z-index: 1;
  display: block;
}

.faq-header {
  max-width: 560px;
  margin: 0 auto 32px;
  text-align: center;
  animation: enterUp 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.faq-header h2 {
  max-width: 560px;
  margin: 0;
  color: var(--deep-blue);
  font-family: "Futura Now Headline", "Avenir Next", Avenir, "Century Gothic", Futura, "Trebuchet MS", sans-serif;
  font-size: clamp(26px, 2.8vw, 34px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: 0;
  text-wrap: balance;
}

.faq-header p {
  max-width: 480px;
  margin: 10px auto 0;
  color: rgba(6, 20, 29, 0.62);
  font-size: 15px;
  line-height: 1.5;
}

.faq-list {
  display: grid;
  gap: 8px;
  max-width: 620px;
  margin: 0 auto;
}

.faq-item {
  overflow: hidden;
  border: 1px solid rgba(6, 20, 29, 0.1);
  border-radius: 8px;
  background: #ffffff;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.faq-item:hover,
.faq-item.is-open {
  border-color: rgba(6, 20, 29, 0.16);
  background: linear-gradient(135deg, #ffffff, rgba(245, 247, 250, 0.74));
  box-shadow: 0 14px 34px rgba(6, 20, 29, 0.06);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
  padding: 15px 20px;
  border: 0;
  border-radius: 8px;
  color: rgba(6, 20, 29, 0.72);
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  text-align: left;
  transition: color 180ms ease;
}

.faq-item.is-open .faq-question {
  color: var(--deep-blue);
}

.faq-chevron {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: rgba(6, 20, 29, 0.5);
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.faq-chevron svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.faq-item.is-open .faq-chevron {
  color: var(--vital-green);
  transform: rotate(180deg) scale(1.08);
}

.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 220ms ease,
    opacity 180ms ease;
}

.faq-item.is-open .faq-answer {
  grid-template-rows: 1fr;
  opacity: 1;
}

.faq-answer-inner {
  min-height: 0;
  overflow: hidden;
}

.faq-answer p {
  margin: 0;
  padding: 0 20px 16px;
  color: rgba(6, 20, 29, 0.62);
  font-size: 14.5px;
  line-height: 1.55;
}

.faq-contact {
  max-width: 420px;
  margin: 34px auto 0;
  padding: 18px;
  text-align: center;
  animation: enterUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 180ms both;
}

.faq-section:not(.is-in-view) .faq-header,
.faq-section:not(.is-in-view) .faq-contact {
  animation: none;
  opacity: 0;
  transform: translateY(28px);
}

.faq-section.is-in-view .faq-header {
  animation: enterUp 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.faq-section.is-in-view .faq-contact {
  animation: enterUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 180ms both;
}

.faq-contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: var(--deep-blue);
}

.faq-contact-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.faq-contact-title {
  margin: 10px 0 0;
  color: var(--deep-blue);
  font-size: 15px;
  font-weight: 700;
}

.faq-contact-copy {
  margin: 6px 0 0;
  color: rgba(6, 20, 29, 0.58);
  font-size: 14px;
  line-height: 1.4;
}

.faq-contact-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  margin-top: 18px;
  padding: 0 18px;
  border: 1px solid var(--deep-blue);
  border-radius: 8px;
  color: #ffffff;
  background: var(--deep-blue);
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.nav-link:focus-visible,
.nav-button:focus-visible,
.hero-cta:focus-visible,
.faq-question:focus-visible,
.faq-contact-button:focus-visible,
.header-links a:focus-visible,
.feature-step:focus-visible,
.feature-preview-button:focus-visible,
.features-cta:focus-visible,
.brand-link:focus-visible,
.onboarding-login:focus-visible,
.onboarding-primary:focus-visible,
.onboarding-secondary:focus-visible,
.onboarding-progress-step:focus-visible {
  outline: 2px solid var(--deep-blue);
  outline-offset: 4px;
}

@media (max-width: 860px) {
  :root {
    --header-height: 68px;
  }

  .hero-section {
    padding: calc(var(--header-height) + clamp(58px, 10svh, 92px)) clamp(18px, 5vw, 36px) clamp(96px, 16svh, 150px);
  }

  .site-header {
    top: 12px;
    padding: 0 clamp(14px, 4vw, 28px);
  }

  .site-nav,
  .site-header.is-scrolled .site-nav {
    width: 100%;
    height: 58px;
    padding: 8px 10px 8px 18px;
  }

  .brand-link {
    width: clamp(112px, 26vw, 132px);
  }

  .header-links {
    display: none;
  }

  .header-actions {
    gap: 8px;
    font-size: 14px;
  }

  .nav-link,
  .nav-button {
    min-height: 40px;
  }

  .nav-button {
    min-width: 112px;
    padding: 0 16px;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
  }

  .hero-copy {
    width: min(560px, 100%);
  }

  .hero-copy h1 {
    max-width: 28rem;
    margin: 0 auto;
    font-size: clamp(36px, 8vw, 48px);
    line-height: 1;
  }

  .hero-subheadline {
    max-width: 500px;
    margin: 12px auto 0;
    font-size: clamp(16px, 2.8vw, 18px);
    line-height: 1.5;
  }

  .hero-cta {
    min-height: 44px;
    margin-top: 16px;
    padding: 0 26px;
  }

  .hero-chatbox {
    justify-self: auto;
    width: min(620px, 100%);
    min-height: 62px;
    margin-top: 28px;
    padding: 7px 7px 7px 22px;
  }

  .hero-chat-submit {
    width: 52px;
    height: 48px;
    border-radius: 11px;
  }

  .hero-trusted {
    position: relative;
    left: auto;
    bottom: auto;
    align-self: flex-start;
    width: min(680px, 100%);
    margin-top: auto;
    padding-top: clamp(32px, 6svh, 56px);
    text-align: left;
  }

  .section-shell {
    width: min(100% - 36px, 720px);
  }

  .onboarding-shell {
    min-height: auto;
    padding: 40px 0;
  }

  .onboarding-card {
    justify-self: center;
  }

  .feature-steps-grid {
    grid-template-columns: 1fr;
  }

  .feature-visual {
    order: -1;
    min-height: 340px;
  }

  .features-section {
    min-height: auto;
  }

  .features-shell {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .features-copy {
    max-width: 620px;
  }

  .features-mindmap-shell .features-copy h2 {
    font-size: clamp(40px, 9vw, 56px);
  }

  .features-mindmap-shell .features-copy h2 span {
    white-space: normal;
  }

  .features-summary-card {
    width: min(560px, 100%);
    justify-self: start;
  }

  .features-mindmap-card {
    aspect-ratio: 4 / 3;
  }

  .features-mindmap-card .mindmap-world,
  .features-mindmap-card.is-first .mindmap-world,
  .features-mindmap-card.is-focus-def .mindmap-world,
  .features-mindmap-card.is-def-expanded .mindmap-world,
  .features-mindmap-card.is-focus-term .mindmap-world,
  .features-mindmap-card.is-term-expanded .mindmap-world,
  .features-mindmap-card.is-full .mindmap-world,
  .features-mindmap-card.is-collapse .mindmap-world {
    transform: translate(-50%, -50%) scale(0.44);
  }

  .faq-shell {
    grid-template-columns: 1fr;
  }

  .testimonials-columns {
    max-height: none;
    flex-wrap: wrap;
    overflow: visible;
    mask-image: none;
  }

  .testimonial-column {
    flex-basis: min(310px, 48%);
  }

  .testimonial-column-3 {
    flex-basis: min(640px, 100%);
  }

  .testimonial-scroll {
    animation: none;
    transform: none;
  }

  .testimonial-scroll > [aria-hidden="true"] {
    display: none;
  }

}

@media (max-width: 560px) {
  :root {
    --header-height: 64px;
  }

  .hero-section {
    min-height: 100svh;
    padding: calc(var(--header-height) + clamp(42px, 8svh, 68px)) 18px clamp(82px, 16svh, 130px);
  }

  .site-header {
    top: 10px;
    padding: 0 14px;
  }

  .site-nav,
  .site-header.is-scrolled .site-nav {
    height: 54px;
    padding: 8px 8px 8px 14px;
  }

  .brand-link {
    width: 104px;
  }

  .header-actions {
    gap: 6px;
    font-size: 13px;
  }

  .nav-link {
    display: none;
  }

  .nav-button {
    min-width: 100px;
    min-height: 36px;
    padding: 0 14px;
    font-size: 12px;
  }

  .hero-content {
    align-items: center;
    min-height: auto;
  }

  .hero-copy h1 {
    max-width: 100%;
    font-size: clamp(32px, 9vw, 40px);
    line-height: 1;
  }

  .hero-subheadline {
    margin-top: 12px;
    font-size: clamp(15px, 4vw, 17px);
    line-height: 1.5;
  }

  .hero-cta {
    min-height: 44px;
    margin-top: 16px;
    padding: 0 24px;
    font-size: 12px;
  }

  .hero-chatbox {
    width: 100%;
    min-height: 54px;
    margin-top: 22px;
    gap: 8px;
    padding: 6px 6px 6px 14px;
  }

  .hero-chat-placeholder {
    font-size: clamp(10px, 2.8vw, 14px);
  }

  .hero-chat-submit {
    width: 44px;
    height: 40px;
    border-radius: 10px;
  }

  .hero-chat-submit svg {
    width: 19px;
    height: 19px;
  }

  .hero-trusted {
    width: 100%;
    gap: 14px;
    padding-top: 28px;
  }

  .hero-trusted-title {
    font-size: 10px;
    letter-spacing: 0.12em;
  }

  .hero-trusted-track {
    animation-duration: 15s;
  }

  .hero-trusted-item {
    gap: 8px;
    min-width: 184px;
    padding-right: 22px;
  }

  .hero-trusted-item span {
    max-width: 112px;
    font-size: 9px;
  }

  .hero-trusted-item img {
    max-width: 42px;
    height: 20px;
  }

  .social-proof-section,
  .feature-steps-section,
  .features-section,
  .faq-section {
    padding: 44px 0;
  }

  .hero-video-section {
    padding: 36px 18px;
  }

  .hero-video {
    border-radius: 10px;
  }

  .section-shell {
    width: calc(100% - 36px);
  }

  .onboarding-page {
    padding: 10px 16px 16px;
  }

  .onboarding-header .brand-link {
    width: 92px;
  }

  .onboarding-shell {
    min-height: calc(100svh - 58px);
    padding: 10px 0;
  }

  .onboarding-progress {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px 6px;
    padding: 12px 14px 8px;
  }

  .onboarding-progress-step strong {
    display: none;
  }

  .onboarding-step-panel {
    min-height: 274px;
    padding: 18px 16px 0;
  }

  .onboarding-fields,
  .onboarding-option-grid,
  .onboarding-option-grid.compact {
    grid-template-columns: 1fr;
  }

  .onboarding-actions {
    padding: 14px 16px 16px;
  }

  .onboarding-primary,
  .onboarding-secondary {
    min-width: 0;
    flex: 1;
  }

  .feature-steps-shell h2 {
    font-size: clamp(24px, 7vw, 30px);
  }

  .feature-steps-grid {
    gap: 22px;
  }

  .feature-visual {
    min-height: 260px;
  }

  .visual-content {
    padding: 18px;
  }

  .visual-content h3 {
    font-size: 26px;
  }

  .feature-step {
    gap: 14px;
  }

  .feature-step-copy strong {
    font-size: 18px;
  }

  .feature-step-copy > span:not(.feature-step-progress) {
    font-size: 14px;
  }

  .features-section {
    min-height: auto;
  }

  .features-shell {
    gap: 28px;
  }

  .features-copy h2 {
    font-size: clamp(40px, 12vw, 52px);
  }

  .features-description {
    margin-top: 18px;
    font-size: 15px;
  }

  .features-cta {
    width: 100%;
  }

  .features-summary-card {
    padding: 16px;
    border-radius: 12px;
  }

  .features-anatomy-card {
    min-height: 0;
    padding: 0;
  }

  .features-mindmap-card {
    min-height: 320px;
  }

  .features-mindmap-card .mindmap-demo-header {
    height: 64px;
    padding: 0 16px;
  }

  .features-mindmap-card .mindmap-viewport {
    inset: 64px 0 0;
  }

  .features-mindmap-card .mindmap-controls {
    top: 78px;
    left: 14px;
    gap: 8px;
  }

  .features-mindmap-card .mindmap-controls span {
    width: 28px;
    height: 28px;
  }

  .features-mindmap-card .mindmap-controls svg {
    width: 15px;
    height: 15px;
  }

  .features-mindmap-card .mindmap-world,
  .features-mindmap-card.is-first .mindmap-world,
  .features-mindmap-card.is-focus-def .mindmap-world,
  .features-mindmap-card.is-def-expanded .mindmap-world,
  .features-mindmap-card.is-focus-term .mindmap-world,
  .features-mindmap-card.is-term-expanded .mindmap-world,
  .features-mindmap-card.is-full .mindmap-world,
  .features-mindmap-card.is-collapse .mindmap-world {
    transform: translate(-50%, -50%) scale(0.34);
  }

  .features-card-header {
    grid-template-columns: 60px minmax(0, 1fr);
  }

  .features-card-thumb {
    width: 60px;
  }

  .features-summary-meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .features-summary-time {
    margin-left: 0;
  }

  .features-summary-list li {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 9px;
  }

  .testimonials-heading h2,
  .faq-header h2 {
    font-size: clamp(24px, 7vw, 30px);
    line-height: 1.02;
  }

  .testimonials-heading p,
  .faq-header p {
    font-size: 15px;
  }

  .testimonials-columns {
    flex-direction: column;
    max-height: none;
    overflow: visible;
    mask-image: none;
  }

  .testimonial-column {
    flex: 0 0 auto;
    width: 100%;
  }

  .testimonial-column-2 {
    display: block;
  }

  .testimonial-card,
  .faq-contact {
    padding: 18px;
  }

  .testimonial-card p {
    font-size: 15px;
  }

  .faq-question {
    padding: 16px;
    font-size: 16px;
  }

  .faq-answer p {
    padding: 0 16px 16px;
    font-size: 15px;
  }
}

@keyframes enterDown {
  from {
    opacity: 0;
    transform: translateY(-18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes enterUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cursorBlink {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes chatWordRotate {
  from {
    opacity: 0;
    transform: translateY(0.55em);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes trustedLogoScroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes featureCardEnter {
  from {
    opacity: 0;
    transform: translateY(26px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes summaryCursorMove {
  0% {
    opacity: 0;
    transform: translate(160px, -118px) rotate(-10deg);
  }

  18% {
    opacity: 1;
  }

  82% {
    opacity: 1;
    transform: translate(0, 0) rotate(-10deg);
  }

  100% {
    opacity: 1;
    transform: translate(0, 0) rotate(-10deg);
  }
}

@keyframes summaryVideoScrub {
  from {
    transform: scaleX(0.012);
  }

  to {
    transform: scaleX(1);
  }
}

@keyframes testimonialsScroll {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-50%);
  }
}

@keyframes surfaceReveal {
  from {
    opacity: 0.42;
  }

  to {
    opacity: 1;
  }
}

@keyframes glowDriftPrimary {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(-34px, -22px, 0) scale(1.08);
  }
}

@keyframes glowDriftSecondary {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(24px, 18px, 0) scale(1.06);
  }
}

@keyframes gridFloat {
  from {
    background-position: 0 0, 0 0;
    transform: translate3d(0, 0, 0);
  }

  to {
    background-position: 42px 42px, 42px 42px;
    transform: translate3d(-18px, -14px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }

  .testimonial-scroll {
    transform: none !important;
  }
}
</style>
