<template>
  <section id="whiteboard-feature" class="features-section" aria-labelledby="features-whiteboard-title">
    <div class="section-shell features-shell features-anatomy-shell features-mindmap-shell">
      <div class="features-copy">
        <p class="features-kicker">WHITEBOARD</p>
        <h2 id="features-whiteboard-title">
          <span>Sketch your ideas</span>
          <span>on a whiteboard</span>
        </h2>
        <p class="features-description">
          Draw, write, and connect shapes or lines while you study so complex ideas stay visual and easy to revisit.
        </p>
        <a class="features-cta" href="/onboarding">
          <span aria-hidden="true"></span>
          DISCOVER
        </a>
      </div>

      <article
        class="features-summary-card features-anatomy-card features-mindmap-card features-whiteboard-card"
        aria-label="MedicalStudent.ai whiteboard feature preview"
      >
        <div class="whiteboard-demo-embed" aria-hidden="true">
          <iframe
            :key="`whiteboard-open-demo-${whiteboardDemoReplayKey}`"
            :src="`/whiteboard-open-demo.html?v=multi-stage-1&play=${whiteboardDemoReplayKey}`"
            title="Open whiteboard demo animation"
            loading="lazy"
            tabindex="-1"
          ></iframe>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const whiteboardDemoReplayKey = ref(0);
let whiteboardDemoTimer: ReturnType<typeof window.setInterval> | undefined;

onMounted(() => {
  whiteboardDemoTimer = window.setInterval(() => {
    whiteboardDemoReplayKey.value += 1;
  }, 8600);
});

onBeforeUnmount(() => {
  if (whiteboardDemoTimer) {
    window.clearInterval(whiteboardDemoTimer);
  }
});
</script>

<style scoped>
#whiteboard-feature .features-copy h2 {
  font-size: clamp(40px, 4.05vw, 56px);
  line-height: 0.98;
}

#whiteboard-feature .features-description {
  max-width: 360px;
  font-size: clamp(13px, 0.9vw, 14px);
  line-height: 1.38;
}

.features-whiteboard-card {
  overflow: hidden;
  background: #fbfcfe;
  color: #172033;
}

.features-whiteboard-card::before {
  content: none;
}

.whiteboard-demo-embed {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  background: #eef3f7;
}

.whiteboard-demo-embed iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
