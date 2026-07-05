// ===================================================================
// BOOT SEQUENCE
// ===================================================================
const bootLines = [
  "TempleOS Tribute BIOS v1.0",
  "Copyright (C) -- fan project, no affiliation",
  "",
  "Detecting hardware.......... OK",
  "Ring 0 access............... GRANTED",
  "Loading HolyC runtime....... OK",
  "Mounting RedSea filesystem... OK",
  "Setting mode 640x480x16..... OK",
  "",
  "Booting tribute to Terry A. Davis",
  "\"An idiot admires complexity, a genius admires simplicity.\"",
  "",
  "Press any key to continue_"
];

const bootScreen = document.getElementById("boot-screen");
const bootTextEl = document.getElementById("boot-text");

function typeBootSequence() {
  let lineIndex = 0;
  let charIndex = 0;
  let output = "";

  function typeChar() {
    if (lineIndex >= bootLines.length) {
      return; // done
    }
    const currentLine = bootLines[lineIndex];

    if (charIndex < currentLine.length) {
      output += currentLine[charIndex];
      charIndex++;
      bootTextEl.textContent = output;
      setTimeout(typeChar, 14);
    } else {
      output += "\n";
      lineIndex++;
      charIndex = 0;
      bootTextEl.textContent = output;
      setTimeout(typeChar, 90);
    }
  }
  typeChar();
}

function dismissBoot() {
  if (bootScreen.classList.contains("hidden")) return;
  bootScreen.classList.add("hidden");
  setTimeout(() => bootScreen.remove(), 550);
}

typeBootSequence();
document.addEventListener("keydown", dismissBoot, { once: true });
bootScreen.addEventListener("click", dismissBoot, { once: true });
setTimeout(dismissBoot, 4800);

// ===================================================================
// CRT TOGGLE
// ===================================================================
const crtWrap = document.getElementById("crt-wrap");
const crtToggle = document.getElementById("crt-toggle");

crtToggle.addEventListener("click", () => {
  const isOn = crtWrap.classList.toggle("crt-on");
  crtWrap.classList.toggle("crt-off", !isOn);
  crtToggle.textContent = `CRT MODE: ${isOn ? "ON" : "OFF"}`;
  crtToggle.setAttribute("aria-pressed", String(isOn));
});

// ===================================================================
// ARCHITECTURE EXPLORER
// ===================================================================
const archData = {
  kernel: {
    title: "Kernel",
    body: "A single-address-space, ring-0-only kernel: every program runs with full hardware access and shares one flat memory space with the OS itself. There is no user/kernel separation and no memory protection between processes, a deliberate trade of safety for radical simplicity and speed."
  },
  holyc: {
    title: "HolyC",
    body: "Terry's own systems language, a hybrid of C syntax with a built-in JIT compiler and interpreter. Code could be typed at a prompt and run immediately, or compiled to native machine code with no separate build step. The shell itself was just HolyC."
  },
  graphics: {
    title: "Graphics",
    body: "A hand-written graphics library locked to 640x480 resolution and a 16-color VGA-style palette. Terry treated this constraint as fixed rather than a limitation to work around, citing it as instruction he believed came from God."
  },
  filesystem: {
    title: "RedSea Filesystem",
    body: "A custom filesystem built specifically for TempleOS, designed around the OS's single-user, single-address-space model rather than adapted from an existing standard."
  },
  oracle: {
    title: "The Oracle",
    body: "A built-in pseudo-random verse and phrase generator, pulling from a pool that included Bible passages. Terry used it as a source of input during development, describing it as a channel for divine guidance."
  },
  shell: {
    title: "DolDoc Shell / Editor",
    body: "TempleOS blurred the line between document, code editor, and terminal. DolDoc, its rich-text document format, could embed live, runnable HolyC and 3D graphics directly inside what looked like a text file."
  },
  compiler: {
    title: "JIT-Compiled Console",
    body: "The command line was not a separate shell scripting language layered on top of the OS; it was HolyC itself, compiled just-in-time. Typing a function call at the prompt ran real, compiled code immediately."
  }
};

const archDetail = document.getElementById("arch-detail");
const archNodes = document.querySelectorAll(".arch-node");

function showArchDetail(key) {
  const data = archData[key];
  if (!data) return;

  archNodes.forEach(n => n.classList.toggle("active", n.dataset.node === key));

  archDetail.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.body}</p>
  `;
}

archNodes.forEach(node => {
  node.addEventListener("click", () => showArchDetail(node.dataset.node));
  node.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showArchDetail(node.dataset.node);
    }
  });
});

// ===================================================================
// ORACLE
// ===================================================================
const oracleLines = [
  "Random is a gift, not an error.",
  "Simplicity outlives cleverness.",
  "Build the thing only you can build.",
  "A tool used by one can still matter to many.",
  "Constraints are a kind of clarity.",
  "Write it yourself, and you will understand it fully.",
  "The machine remembers what the crowd forgets.",
  "Small and correct beats large and fragile.",
  "Every kernel starts as one person's certainty.",
  "What you build outlasts why people misunderstood it."
];

const oracleOutput = document.getElementById("oracle-output");
const oracleBtn = document.getElementById("oracle-btn");

oracleBtn.addEventListener("click", () => {
  const pick = oracleLines[Math.floor(Math.random() * oracleLines.length)];
  oracleOutput.textContent = `"${pick}"`;
});

// ===================================================================
// HYMN PLAYER
// ===================================================================
const hymnAudio = document.getElementById("hymn-audio");
const hymnToggle = document.getElementById("hymn-toggle");
const hymnBox = document.getElementById("hymn-box");
const iconPlay = document.getElementById("hymn-icon-play");
const iconPause = document.getElementById("hymn-icon-pause");
const hymnCurrent = document.getElementById("hymn-current");
const hymnDuration = document.getElementById("hymn-duration");

function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

hymnAudio.addEventListener("loadedmetadata", () => {
  hymnDuration.textContent = formatTime(hymnAudio.duration);
});

hymnAudio.addEventListener("timeupdate", () => {
  hymnCurrent.textContent = formatTime(hymnAudio.currentTime);
});

hymnAudio.addEventListener("ended", () => {
  hymnBox.classList.remove("playing");
  iconPlay.hidden = false;
  iconPause.hidden = true;
  hymnToggle.setAttribute("aria-pressed", "false");
});

hymnToggle.addEventListener("click", () => {
  if (hymnAudio.paused) {
    hymnAudio.play();
    hymnBox.classList.add("playing");
    iconPlay.hidden = true;
    iconPause.hidden = false;
    hymnToggle.setAttribute("aria-pressed", "true");
    hymnToggle.setAttribute("aria-label", "Pause hymn");
  } else {
    hymnAudio.pause();
    hymnBox.classList.remove("playing");
    iconPlay.hidden = false;
    iconPause.hidden = true;
    hymnToggle.setAttribute("aria-pressed", "false");
    hymnToggle.setAttribute("aria-label", "Play hymn");
  }
});

// ===================================================================
// MOBILE SIDEBAR NAV
// ===================================================================
const navToggle = document.getElementById("nav-toggle");
const sidebar = document.getElementById("site-sidebar");
const sidebarClose = document.getElementById("sidebar-close");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const sidebarLinks = document.querySelectorAll("#nav-links-mobile a");

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("open");
  sidebar.setAttribute("aria-hidden", "false");
  navToggle.setAttribute("aria-expanded", "true");
  sidebarClose.focus();
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
  sidebar.setAttribute("aria-hidden", "true");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.focus();
}

navToggle.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

sidebarLinks.forEach(link => {
  link.addEventListener("click", closeSidebar);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar.classList.contains("open")) {
    closeSidebar();
  }
});

// ---- Console simulator ----
(function () {
  const output = document.getElementById('console-output');
  const input = document.getElementById('console-input');
  if (!output || !input) return;

const commandHistory = [];

  const responses = {
    help: "Commands: help, whoami, date, credo, reboot, clear, ls, uptime, temple, man, neofetch, sudo, history, echo <text>, exit",
    whoami: "Ring 0. No user/kernel split. You are root by default.",
    date: () => new Date().toString(),
    credo: "\"Compilers are the highest of arts.\" \u2014 spirit of the project",
    ls: "kernel.c  holyc.c  redsea.fs  oracle.hc  doldoc.hc",
    reboot: "Rebooting... just kidding. This is a tribute page.",
    uptime: "System uptime: ~15 years (and counting).",
    temple: "\"This is a temple for God.\" \u2014 Terry A. Davis",
    man: "No man pages here. Terry wrote every layer himself \u2014 read the source instead.",
    sudo: "Nice try. In Ring 0, everyone is already root.",
    neofetch: () =>
      "TempleOS (tribute)\n" +
      "------------------\n" +
      "Resolution: 640x480x16\n" +
      "Kernel: Ring 0, single address space\n" +
      "Language: HolyC (JIT)\n" +
      "Filesystem: RedSea\n" +
      "Uptime: ~15 years",
    history: () =>
      commandHistory.length
        ? commandHistory.join('\n')
        : "No commands yet.",
    exit: "There is no escape from the Temple. Refresh to reboot.",
  };

  function printLine(text, cls) {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim();
    if (!raw) return;

    printLine('> ' + raw, 'console-echo');
    commandHistory.push(raw);

    const lower = raw.toLowerCase();
    const [cmd, ...args] = lower.split(' ');

    if (cmd === 'clear') {
      output.innerHTML = '';
    } else if (cmd === 'echo') {
      printLine(args.join(' ') || '');
    } else if (cmd in responses && args.length === 0) {
      const r = responses[cmd];
      printLine(typeof r === 'function' ? r() : r);
    } else {
      printLine(`Unknown command: "${raw}". Type 'help'.`, 'console-error');
    }
    input.value = '';
  });
})();