<template>
  <div class="demo-preview-frame" :class="`is-${variant}`">
    <iframe
      :src="src"
      :title="title"
      allow="autoplay"
      loading="lazy"
      tabindex="-1"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string;
    title: string;
    variant?: "landing" | "inline" | "expanded";
  }>(),
  {
    variant: "inline",
  },
);
</script>

<style scoped>
.demo-preview-frame {
  position: relative;
  overflow: hidden;
  background: #f4f6f8;
}

.demo-preview-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.demo-preview-frame.is-landing {
  position: absolute;
  inset: 0;
}

.demo-preview-frame.is-inline {
  height: clamp(300px, 52vw, 360px);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 14px 34px rgb(24 24 27 / 8%);
}

.demo-preview-frame.is-expanded {
  width: min(90vw, 1280px);
  height: min(86vh, 820px);
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 8px;
  box-shadow: 0 28px 90px rgb(0 0 0 / 34%);
}

@media (max-width: 520px) {
  .demo-preview-frame.is-inline {
    height: clamp(260px, 68vw, 330px);
  }

  .demo-preview-frame.is-expanded {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 0;
  }
}
</style>
