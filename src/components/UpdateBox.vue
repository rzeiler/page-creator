<template>
  <transition name="fade">
    <div v-if="show" class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
      <p>Eine neue Version ist verfügbar.</p>
      <button @click="reload" class="mt-2 bg-white text-blue-600 px-3 py-1 rounded">
        Neu laden
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { updateSW } from '../registerServiceWorker'

const show = ref(false)

onMounted(() => {
  window.addEventListener('pwa-update-available', () => {
    show.value = true
  })
})

function reload() {
  updateSW(true) // aktualisiert und lädt neu
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>