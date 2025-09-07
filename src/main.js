// Configuración de notas y escalas
const order = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const enharmonics = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };
const semitone = note => order.indexOf(enharmonics[note] || note);

const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
const blackKeys = ["C#", "D#", "F#", "G#", "A#"];
const blackKeyOffsets = [1, 2, 4, 5, 6];

const startOctave = 2;
const numOctaves = 2;
const targetOctave = 2;

// Patrones de escalas (intervalos en semitonos)
const scalePatterns = {
  mayor: [2, 2, 1, 2, 2, 2, 1],
  mayor_armonica: [2, 2, 1, 2, 1, 3, 1],
  menor_melodica: [2, 1, 2, 2, 2, 2, 1],
  menor_armonica: [2, 1, 2, 2, 1, 3, 1],
  jonico: [2, 2, 1, 2, 2, 2, 1],
  dorico: [2, 1, 2, 2, 2, 1, 2],
  frigio: [1, 2, 2, 2, 1, 2, 2],
  lidio: [2, 2, 2, 1, 2, 2, 1],
  mixolidio: [2, 2, 1, 2, 2, 1, 2],
  eolico: [2, 1, 2, 2, 1, 2, 2],
  locrio: [1, 2, 2, 1, 2, 2, 2],
  jonico_b6: [2, 2, 1, 2, 1, 3, 1],
  locrio_s2s6: [2, 1, 2, 1, 3, 1, 2],
  mixolidio_b2_s2_no4: [1, 2, 1, 3, 1, 2, 2],
  dorico_s4_s7: [2, 1, 3, 1, 2, 2, 1],
  mixolidio_b2: [1, 3, 1, 2, 2, 1, 2],
  lidio_s2_s5: [3, 1, 2, 2, 1, 2, 1],
  locrio_b7: [1, 2, 2, 1, 2, 1, 3],
  eolico_s7: [2, 1, 2, 2, 1, 3, 1],
  locrio_s6: [1, 2, 2, 1, 3, 1, 2],
  jonico_aumentado: [2, 2, 1, 3, 1, 2, 1],
  dorico_s4: [2, 1, 3, 1, 2, 1, 2],
  mixolidio_b2b6: [1, 3, 1, 2, 1, 2, 2],
  lidio_s2: [3, 1, 2, 1, 2, 2, 1],
  locrio_b4b7: [1, 2, 1, 2, 2, 1, 3],
  dorico_s7: [2, 1, 2, 2, 2, 2, 1],
  dorico_b2: [1, 2, 2, 2, 2, 1, 2],
  lidio_aumentado: [2, 2, 2, 2, 1, 2, 1],
  lidio_dominante: [2, 2, 2, 1, 2, 1, 2],
  mixolidio_b6: [2, 2, 1, 2, 1, 2, 2],
  locrio_s2: [2, 1, 2, 1, 2, 2, 2],
  alterado: [1, 2, 1, 2, 2, 2, 2],
  pentatonica_mayor: [2, 2, 3, 2, 3],
  pentatonica_dominante: [2, 2, 3, 3, 2],
  blues: [3, 2, 1, 1, 3, 2],
  por_tonos: [2, 2, 2, 2, 2, 2],
  disminuida_HW: [1, 2, 1, 2, 1, 2, 1, 2],
  disminuida_WH: [2, 1, 2, 1, 2, 1, 2, 1]
};

// Escalas especiales que usan coloración diferente
const specialScales = [
  "pentatonica_mayor", "pentatonica_dominante", "blues", 
  "por_tonos", "disminuida_HW", "disminuida_WH"
];

// Etiquetas de acordes correspondientes
const chordLabels = {
  mayor: "maj9",
  mayor_armonica: "+maj9",
  menor_melodica: "m6(9)",
  menor_armonica: "m(maj9)",
  jonico: "maj9",
  dorico: "m9",
  frigio: "m11(no9)",
  lidio: "maj9(#11)",
  mixolidio: "13",
  eolico: "m11",
  locrio: "m7b5",
  jonico_b6: "+maj9",
  locrio_s2s6: "m7(b5)9",
  mixolidio_b2_s2_no4: "7(#9)b13",
  dorico_s4_s7: "m(maj9)#11",
  mixolidio_b2: "13(b9)",
  lidio_s2_s5: "+maj7(#9)",
  locrio_b7: "dim7",
  eolico_s7: "m(maj9)",
  locrio_s6: "sus4(addb9)",
  jonico_aumentado: "+maj9",
  dorico_s4: "m9",
  mixolidio_b2b6: "7(b9)b13",
  lidio_s2: "maj7(#9)",
  locrio_b4b7: "dim7",
  dorico_s7: "m6(9)",
  dorico_b2: "m11(no9)",
  lidio_aumentado: "maj9(b5)",
  lidio_dominante: "9(#11)",
  mixolidio_b6: "9(b13)",
  locrio_s2: "m7(b5)9",
  alterado: "7alt",
  pentatonica_mayor: "6(9)",
  pentatonica_dominante: "9",
  blues: "m7",
  por_tonos: "+7",
  disminuida_HW: "13(b9)",
  disminuida_WH: "dim7"
};

// Variables globales
let allNoteIds = [];

// Inicialización
function init() {
  buildKeyboard();
  setupEventListeners();
  render();
}

// Construir el teclado virtual
function buildKeyboard() {
  const whiteKeysContainer = document.getElementById("white-keys");
  const blackKeysContainer = document.getElementById("black-keys");
  const keyboardWrapper = document.querySelector(".keyboard-wrapper");
  
  allNoteIds = [];

  for (let octave = 0; octave < numOctaves; octave++) {
    // Teclas blancas
    whiteKeys.forEach((note, index) => {
      const noteId = note + (octave + startOctave);
      const keyElement = document.createElement("div");
      keyElement.className = "white-key";
      keyElement.dataset.note = noteId;
      whiteKeysContainer.appendChild(keyElement);

      // Crear indicador de nota
      const noteElement = document.createElement("div");
      noteElement.className = "note";
      noteElement.id = noteId;
      noteElement.style.left = `${(octave * 7 + index) * 33 + 16.5}px`;
      noteElement.style.top = "122px";
      keyboardWrapper.appendChild(noteElement);
      
      allNoteIds.push(noteId);
    });

    // Teclas negras
    blackKeys.forEach((note, index) => {
      const noteId = note + (octave + startOctave);
      const left = (octave * 7 + blackKeyOffsets[index]) * 33 - 11;
      
      const keyElement = document.createElement("div");
      keyElement.className = "black-key";
      keyElement.dataset.note = noteId;
      keyElement.style.left = `${left}px`;
      blackKeysContainer.appendChild(keyElement);

      // Crear indicador de nota
      const noteElement = document.createElement("div");
      noteElement.className = "note";
      noteElement.id = noteId;
      noteElement.style.left = `${left + 11.5}px`;
      noteElement.style.top = "62px";
      keyboardWrapper.appendChild(noteElement);
      
      allNoteIds.push(noteId);
    });
  }
}

// Construir escala a partir de la tónica y tipo
function buildScale(root, scaleType) {
  const rootSemitone = semitone(root);
  let currentSemitone = rootSemitone;
  const scale = [rootSemitone];
  
  scalePatterns[scaleType].forEach(interval => {
    currentSemitone = (currentSemitone + interval) % 12;
    scale.push(currentSemitone);
  });
  
  // Agregar octava
  scale.push(rootSemitone);
  return scale;
}

// Pintar las notas en el teclado
function paintNotes(semitones, colors) {
  // Limpiar todas las notas
  allNoteIds.forEach(noteId => {
    const noteElement = document.getElementById(noteId);
    if (noteElement) {
      noteElement.style.display = "none";
    }
    
    // Restaurar color de teclas negras
    const blackKey = document.querySelector(`.black-key[data-note="${noteId}"]`);
    if (blackKey) {
      blackKey.style.background = "var(--black-key)";
    }
  });

  if (!semitones.length) return;

  // Mostrar notas en ambas octavas
  semitones.forEach((semitone, index) => {
    const noteName = order[semitone];
    
    // Mostrar en octava 2 y 3
    [targetOctave, targetOctave + 1].forEach(octave => {
      const noteId = noteName + octave;
      const noteElement = document.getElementById(noteId);
      
      if (noteElement) {
        noteElement.style.display = "block";
        noteElement.style.background = colors[index];
        
        // Cambiar color de tecla negra si es necesario
        const blackKey = document.querySelector(`.black-key[data-note="${noteId}"]`);
        if (blackKey) {
          blackKey.style.background = "#555";
        }
      }
    });
  });
}

// Mostrar el nombre del acorde
function showChord(root, scaleType) {
  const chordDisplay = document.getElementById("chord-display");
  if (root && scaleType) {
    chordDisplay.textContent = `${root}${chordLabels[scaleType] || ""}`;
  } else {
    chordDisplay.textContent = "Selecciona tónica y escala";
  }
}

// Función principal de renderizado
function render() {
  const root = document.getElementById("tonic-select").value;
  const scaleType = document.getElementById("scale-type").value;
  
  if (!root || !scaleType) {
    paintNotes([], []);
    showChord("", "");
    return;
  }
  
  const scale = buildScale(root, scaleType);
  
  // Determinar colores según el tipo de escala
  const colors = scale.map((_, index) => {
    if (specialScales.includes(scaleType)) {
      return "var(--info)"; // Azul para escalas especiales
    }
    
    if (index === 0 || index === scale.length - 1) {
      return "var(--success)"; // Verde para fundamental
    }
    
    if ([2, 4, 6].includes(index)) {
      return "var(--info)"; // Azul para estructurales
    }
    
    // Verificar tensiones no disponibles (semitonos)
    if ([1, 3, 5].includes(index)) {
      const interval = (scale[index] - scale[index - 1] + 12) % 12;
      if (interval === 1) {
        return "var(--error)"; // Rojo para tensiones no disponibles
      }
    }
    
    return "var(--warning)"; // Naranja para tensiones disponibles
  });
  
  paintNotes(scale, colors);
  showChord(root, scaleType);
}

// Configurar event listeners
function setupEventListeners() {
  document.getElementById("tonic-select").addEventListener("change", render);
  document.getElementById("scale-type").addEventListener("change", render);
  
  // Prevenir zoom en iOS
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });
  
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}