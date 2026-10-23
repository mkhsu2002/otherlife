// Original ambient score; no external audio, account or network request.
export function ambientScore() {
  const duration = 72,
    notes = [];
  const chords = [
    [48, 55, 60, 64, 71],
    [45, 52, 57, 60, 67],
    [41, 48, 53, 57, 64],
    [43, 50, 55, 60, 62],
  ];
  const melodies = [
    [72, 76, 79],
    [69, 72, 76],
    [69, 72, 76],
    [67, 74, 79],
  ];
  const hz = (n) => 440 * 2 ** ((n - 69) / 12);
  for (let bar = 0; bar < 8; bar++) {
    const start = bar * 8,
      shape = chords[bar % 4];
    shape.forEach((m, i) =>
      notes.push({
        time: start + i * 0.16,
        duration: 7.5,
        frequency: hz(m),
        gain: i === 0 ? 0.037 : 0.022,
        type: "sine",
      }),
    );
    melodies[bar % 4].forEach((midi, i) =>
      notes.push({
        time: start + 1.3 + i * 2,
        duration: 3.8,
        frequency: hz(midi),
        gain: 0.023,
        type: "triangle",
      }),
    );
  }
  return { duration, notes };
}
export function scheduleNote(context, destination, note, offset) {
  const oscillator = context.createOscillator(),
    gain = context.createGain();
  oscillator.type = note.type;
  oscillator.frequency.value = note.frequency;
  const start = offset + note.time,
    end = start + note.duration;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(note.gain, start + 1.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, end - 0.1);
  gain.gain.linearRampToValueAtTime(0, end);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(start);
  oscillator.stop(end);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
  return oscillator;
}
export function createMusicController({
  AudioContextClass,
  document: doc,
  timers = globalThis,
  onChange = () => {},
}) {
  let context = null,
    master = null,
    filter = null,
    delay = null,
    feedback = null,
    wet = null,
    wanted = false,
    volume = 0.25,
    timer = null,
    scheduled = [],
    generation = 0;
  const state = () => ({
    enabled: wanted,
    playing: !!(wanted && context?.state === "running" && !doc.hidden),
    volume,
    supported: !!AudioContextClass,
  });
  const report = () => onChange(state());
  function stopSchedule() {
    if (timer !== null) timers.clearTimeout(timer);
    timer = null;
    for (const node of scheduled) {
      try {
        node.stop();
      } catch {}
    }
    scheduled = [];
  }
  function loop() {
    if (!wanted || doc.hidden || context.state !== "running") return;
    const score = ambientScore(),
      start = context.currentTime + 0.08;
    scheduled = score.notes.map((note) =>
      scheduleNote(context, filter, note, start),
    );
    timer = timers.setTimeout(loop, (score.duration - 1) * 1000);
  }
  async function setEnabled(enabled) {
    const attempt = ++generation;
    wanted = !!enabled;
    if (!wanted) {
      stopSchedule();
      if (context) await context.suspend();
      report();
      return;
    }
    if (!AudioContextClass) {
      wanted = false;
      report();
      throw Error("Audio unavailable");
    }
    try {
      if (!context) {
        context = new AudioContextClass();
        master = context.createGain();
        master.gain.value = volume * 4;
        filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1800;
        delay = context.createDelay(3);
        delay.delayTime.value = 0.65;
        feedback = context.createGain();
        feedback.gain.value = 0.22;
        wet = context.createGain();
        wet.gain.value = 0.25;
        filter.connect(master);
        filter.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);
        wet.connect(master);
        master.connect(context.destination);
      }
      if (!doc.hidden) {
        await context.resume();
        if (attempt !== generation || !wanted) {
          if (!wanted) await context.suspend();
          return;
        }
        stopSchedule();
        loop();
      }
      report();
    } catch (error) {
      if (attempt === generation) {
        wanted = false;
        stopSchedule();
        report();
      }
      throw error;
    }
  }
  function setVolume(value) {
    if (!Number.isFinite(value)) return;
    volume = Math.max(0, Math.min(1, value));
    if (master)
      master.gain.setTargetAtTime(volume * 4, context.currentTime, 0.08);
    report();
  }
  async function visibility() {
    if (!context || !wanted) return;
    const attempt = ++generation;
    stopSchedule();
    try {
      if (doc.hidden) await context.suspend();
      else {
        await context.resume();
        if (attempt === generation && wanted && !doc.hidden) loop();
      }
      report();
    } catch {
      wanted = false;
      report();
    }
  }
  doc.addEventListener("visibilitychange", visibility);
  return {
    state,
    setEnabled,
    setVolume,
    async destroy() {
      generation++;
      wanted = false;
      stopSchedule();
      doc.removeEventListener("visibilitychange", visibility);
      if (context) await context.close();
      report();
    },
  };
}
export function installMusicControls({
  translate,
  document: doc = document,
  window: win = window,
  storage,
}) {
  const preferences = storage || {
    getItem: (key) => win.localStorage.getItem(key),
    setItem: (key, value) => win.localStorage.setItem(key, value),
  };
  const toggle = doc.querySelector("#musicToggle"),
    slider = doc.querySelector("#musicVolume"),
    status = doc.querySelector("#musicStatus");
  const controller = createMusicController({
    AudioContextClass: win.AudioContext || win.webkitAudioContext,
    document: doc,
    onChange: render,
  });
  function render(state = controller.state()) {
    doc
      .querySelector(".music-controls")
      .setAttribute("aria-label", translate("背景音樂"));
    toggle.textContent = translate(state.enabled ? "音樂：開" : "音樂：關");
    toggle.setAttribute("aria-pressed", String(state.enabled));
    toggle.setAttribute(
      "aria-label",
      translate(state.enabled ? "關閉背景音樂" : "開啟背景音樂"),
    );
    doc.querySelector("#musicVolumeLabel").textContent = translate("音量");
    slider.setAttribute("aria-label", translate("音樂音量"));
    slider.value = Math.round(state.volume * 100);
    status.textContent = translate(
      state.enabled && !state.playing ? "背景音樂已暫停" : "",
    );
  }
  try {
    const raw = preferences.getItem("earthlife-music-volume");
    if (raw !== null && Number.isFinite(Number(raw)))
      controller.setVolume(Number(raw));
  } catch {}
  toggle.onclick = async () => {
    try {
      await controller.setEnabled(!controller.state().enabled);
    } catch {
      status.textContent = translate("此裝置暫時無法播放音樂，請稍後再試。");
    }
  };
  slider.oninput = () => {
    controller.setVolume(Number(slider.value) / 100);
    try {
      preferences.setItem(
        "earthlife-music-volume",
        String(controller.state().volume),
      );
    } catch {}
  };
  render();
  return { ...controller, render };
}
