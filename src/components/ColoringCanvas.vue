<template>
  <nav class="navbar bg-body-tertiary shadow">
    <div class="container d-flex ">
      <span class="navbar-brand mb-0 h1" style="color: #dd389d;"><i class="bi bi-palette2"></i> Page Creator</span>
      <div class="dropdown">
        <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Datei
        </button>
        <ul class="dropdown-menu">
          <li><a @click="save" class="dropdown-item" href="#">Speichern</a></li>
          <li><a @click="load" class="dropdown-item" href="#">Öffnen</a></li>
        </ul>
      </div>
      <span class="flex-grow-1"></span>

      <button class="btn" @click="clearHistory">
        <i class="bi bi-trash"></i>Löschen
      </button>
      <button class="btn" @click="printPage"><i class="bi bi-printer"></i>Drucken</button>
      <button class="btn" @click="undoAction" :disabled="!canUndoRef"><i class="bi bi-caret-left"></i>Zurück</button>
      <button class="btn" @click="redoAction" :disabled="!canRedoRef">Vor<i class="bi bi-caret-right"></i></button>
      <div class="dropdown">
        <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Vorlagen
        </button>
        <ul class="dropdown-menu">
          <li v-for="item in templates" :key="item.id">
            <a class="dropdown-item" href="#" @click.prevent="selectTemplate(item)">
              {{ item.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="flex-grow-1 d-flex flex-row  text-bg-light   overflow-auto">
    <div class="w-100 h-100    " style="display: contents;">
      <svg ref="svgRef" width="210mm" height="297mm" viewBox="0 0 800 1100" xmlns="http://www.w3.org/2000/svg"
        class="shadow bg-white"></svg>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'

import firstDay from '../assets/first_day.svg?raw'
import froheWeihnachten from '../assets/frohe_weihnachten_2.svg?raw'
import happyBirthday from '../assets/happy_birthday.svg?raw'
import imGarten from '../assets/im_garten.svg?raw'

import {
  lastPositions,
  redo,
  undo,
  recordAction,
  loadHistory,
  clearHistory,
  canRedo,
  canUndo
} from '../services/history.js'

import { useFileService } from '../services/useFileService'
import '../services/dragService.js'
import '../services/fillService.js'
const { saveFile, openFile } = useFileService()

// deine Vorlagenliste
const templates = ref([
  { id: 1, name: "Erster Tag", datas: [firstDay] },
  { id: 2, name: "Frohe Weihnachten", datas: [froheWeihnachten] },
  { id: 3, name: "Geburtstag", datas: [happyBirthday] },
  { id: 4, name: "Im Garten", datas: [imGarten] },
])

function selectTemplate(template) {
  svgRef.value.innerHTML = "";
  console.log("Ausgewählte Vorlage:", template.name)

  template.datas.forEach(element => {
    loadSvgElement(element);
  });
  recordAction(svgRef.value.innerHTML);
}

const svgRef = ref(null)
const canUndoRef = ref(false)
const canRedoRef = ref(false)

async function save() {
  await saveFile(svgRef.value, 'bild.svg')
}

async function load() {
  const content = await openFile()
  if (content) loadSvgElement(content)
}

function undoAction() {
  svgRef.value.innerHTML = undo()
}

function redoAction() {
  svgRef.value.innerHTML = redo()
}

function loadSvgElement(svgRaw) {
  svgRef.value.innerHTML = "";
  const parser = new DOMParser()
  const svg = parser.parseFromString(svgRaw, 'image/svg+xml').documentElement

  // 2. Alle <g> mit allowDrag="true" auswählen
  const allowedGroups = svg.querySelectorAll('g[allowDrag="true"],g[allowdrag="true"]')

  // 3. In Ziel-SVG einfügen
  allowedGroups.forEach(group => {
    svgRef.value.appendChild(group)
  })

  setTimeout(() => {
    recordAction(svgRef.value.innerHTML);
  }, 500);
}

onMounted(() => {
  svgRef.value.innerHTML = "";

  window.addEventListener('dragend', () => {
    setTimeout(() => {
      recordAction(svgRef.value.innerHTML);
    }, 500);
  })

  window.addEventListener('filled', () => {
    setTimeout(() => {
      recordAction(svgRef.value.innerHTML);
    }, 500);
  })

  window.addEventListener('saved', () => {

  })

  window.addEventListener('historyChange', (data) => {
    canUndoRef.value = canUndo()
    canRedoRef.value = canRedo()
  })

  loadHistory()
  svgRef.value.innerHTML = lastPositions()
})

function printPage() {
  const svgData = new XMLSerializer().serializeToString(svgRef.value)
  const win = window.open('', '_blank')
  win.document.open()
  win.document.write(`
    <html>
      <head>
        <title>Drucken</title>
        <style>
          svg { width: 210mm; height: 297mm; }
          body { margin: 0; }
        </style>
      </head>
      <body>${svgData}</body>
    </html>
  `)
  win.document.close()
  win.onload = () => {
    win.focus()
    win.print()
    win.close()
  }
}

</script>

<style>
svg {
  display: block;
  width: 727px;
  height: 1056px;
  min-width: 727px;
  min-height: 1056px;
  margin: auto;
}

.navbar>.container>* {
  margin-right: 5px;
}
</style>