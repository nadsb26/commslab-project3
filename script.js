// ---------- AUDIO ----------

// Background
const bg = new Audio("assets/audio/cafe-bg-ambiance.mp3");

// Sound effects
const doorbell = new Audio("assets/audio/doorbell.mp3");
const typing = new Audio("assets/audio/Keyboard typing.m4a");
const coffeeMachine = new Audio("assets/audio/coffee-machine.mp3");
const phoneTyping = new Audio("assets/audio/Phone typing.mp3");
const notification = new Audio("assets/audio/Notification.mp3");

// Scene 1 dialogue
const mel1 = new Audio("assets/audio/mel/mel1.mp3");
const mel2 = new Audio("assets/audio/mel/mel2.mp3");
const mel3 = new Audio("assets/audio/mel/mel3.mp3");

const lily1 = new Audio("assets/audio/lily/lily1.mp3");
const lily2 = new Audio("assets/audio/lily/lily2.mp3");
const lily3 = new Audio("assets/audio/lily/lily3.mp3");

const rory1 = new Audio("assets/audio/rory/rory1.mp3");

// Scene 2 dialogue
const mel4 = new Audio("assets/audio/mel/mel4.mp3");
const mel5 = new Audio("assets/audio/mel/mel5.mp3");
const mel6 = new Audio("assets/audio/mel/mel6.mp3");
const mel7 = new Audio("assets/audio/mel/mel7.mp3");
const mel8 = new Audio("assets/audio/mel/mel8.mp3");
const mel9 = new Audio("assets/audio/mel/mel9.mp3");
const mel10 = new Audio("assets/audio/mel/mel10.mp3");
const mel11 = new Audio("assets/audio/mel/mel11.mp3");
const mel12 = new Audio("assets/audio/mel/mel12.mp3");
const mel13 = new Audio("assets/audio/mel/mel13.mp3");

const jess1 = new Audio("assets/audio/jess/Jess1.mp3");
const jess2 = new Audio("assets/audio/jess/Jess2.mp3");
const jess3 = new Audio("assets/audio/jess/Jess3.mp3");
const jess4 = new Audio("assets/audio/jess/Jess4.mp3");
const jess5 = new Audio("assets/audio/jess/Jess5.mp3");
const jess6 = new Audio("assets/audio/jess/Jess6.mp3");

// Scene 3 dialogue
const mel14 = new Audio("assets/audio/mel/mel14.mp3");
const mel15 = new Audio("assets/audio/mel/mel15.mp3");
const mel16 = new Audio("assets/audio/mel/mel16.mp3");

const lily4 = new Audio("assets/audio/lily/lily4.mp3");


// Scene 4 dialogue
const mel17 = new Audio("assets/audio/mel/mel17.mp3");

const lily5 = new Audio("assets/audio/lily/lily5.mp3");
const lily6 = new Audio("assets/audio/lily/lily6.mp3");

const jess7 = new Audio("assets/audio/jess/Jess7.mp3");
const jess8 = new Audio("assets/audio/jess/Jess8.mp3");

// End screen music
const endMusic = new Audio("assets/audio/end.mp3");

// ---------- HELPERS ----------

// finds the clickable element for a character
function getClickTarget(charName) {
  return document.getElementById(charName + "Hotspot") || document.getElementById(charName);
}

// removes all click handlers from every character, so only the current character in the sequence can be clicked at any given time
function clearAllClicks() {
  const ids = ["melHotspot", "lilyHotspot", "roryHotspot", "jessHotspot", "phoneHotspot", "mel", "lily", "rory", "jess", "phoneImg"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.onclick = null;
      el.style.pointerEvents = "none";
    } 
  });
}

// removes the glow highlight from all characters
function clearAllGlows() {
  ["mel", "lily", "rory", "jess", "phoneImg"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("glow");
  });
}

// fades to black 
// used between scenes
function transition(callback) {
  const black = document.getElementById("blackScreen");
  black.style.opacity = "1";

  setTimeout(() => {
    callback();
    setTimeout(() => {
      black.style.opacity = "0";
    }, 250);
  }, 700);
}

// fades background ambience volume down for a set duration
function fadeBgVolume(targetVolume, durationMs) {
  const startVolume = bg.volume;
  const steps = 30;
  const stepTime = durationMs / steps;
  const volumeStep = (startVolume - targetVolume) / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    bg.volume = Math.max(0, bg.volume - volumeStep);
    if (currentStep >= steps)
        clearInterval(interval); 
  }, stepTime);
}

// shows the end screen with a fade-in, plays end music
function showEndScreen() {
  const endScreen = document.getElementById("endScreen");
  endScreen.classList.add("active");

  endMusic.loop = true;
  endMusic.volume = 0.7;
  endMusic.play();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      endScreen.classList.add("visible");
    });
  });
}

// opens the phone video popup, plays the video & syncs notification sound
// then closes the popup and calls onDone when the video ends
function showPhonePopup(notificationTime, onDone) {
  const popup = document.getElementById("phonePopup");
  const video = document.getElementById("phoneVideo");

  popup.classList.add("active");
  video.currentTime = 0;

  // play phone typing sfx immediately when popup opens
  phoneTyping.currentTime = 0;
  phoneTyping.play();

  let notifFired = false;

  video.ontimeupdate = () => {
    if (!notifFired && video.currentTime >= notificationTime) {
      notifFired = true;
      notification.currentTime = 0;
      notification.play();
    }
  };

  video.onended = () => {
    video.ontimeupdate = null;
    video.onended = null;
    popup.classList.remove("active");
    onDone();
  };

  // Play must be called in the same tick as the user gesture.
  // phone_click handler calls next() synchronously, so this is safe.
  video.play().catch(err => {
    console.warn("Video autoplay blocked:", err);
    // Fallback: show a tap-to-play message inside the popup
    const msg = document.createElement("div");
    msg.id = "tapToPlay";
    msg.textContent = "Tap to play";
    document.getElementById("phonePopupInner").appendChild(msg);
    msg.onclick = () => {
      msg.remove();
      video.play();
    };
  });

}

// ---------- SEQUENCE ----------
// this array defines the entire story, step by step

const scene = [
  // Scene 1
  { type: "sfx", audio: doorbell },

  { type: "char", char: "mel", audio: mel1 },
  { type: "char", char: "lily", audio: lily1 },
  { type: "char", char: "mel", audio: mel2 },
  { type: "char", char: "lily", audio: lily2 },

  { type: "sfx", audio: typing },

  { type: "char", char: "lily", audio: lily3 },
  { type: "char", char: "rory", audio: rory1 },
  { type: "char", char: "mel", audio: mel3 },

  // Transition
  { type: "transition" },
  {
    type: "scene_setup",
    fn: () => {
      // Hide Lily and Rory; show Jess for Scene 2
      document.getElementById("lilyWrap").style.display = "none";
      document.getElementById("roryWrap").style.display = "none";
      document.getElementById("jessWrap").style.display = "block";
    }
  },

  // Scene 2
  { type: "sfx", audio: doorbell },

  { type: "char", char: "mel", audio: mel4 },
  { type: "char", char: "jess", audio: jess1 },
  { type: "char", char: "mel", audio: mel5 },
  { type: "char", char: "jess", audio: jess2 },
  { type: "char", char: "mel", audio: mel6 },
  { type: "char", char: "mel", audio: mel7 },

  { type: "sfx", audio: coffeeMachine },

  { type: "char", char: "mel", audio: mel8 },
  { type: "char", char: "jess", audio: jess3 },
  { type: "char", char: "mel", audio: mel9 },
  { type: "char", char: "jess", audio: jess4 },
  { type: "char", char: "mel", audio: mel10 },
  { type: "char", char: "mel", audio: mel11 },
  { type: "char", char: "jess", audio: jess5 },
  { type: "char", char: "mel", audio: mel12 },
  { type: "char", char: "jess", audio: jess6 },
  { type: "char", char: "mel", audio: mel13 },

  // Transition
  { type: "transition" },
  {
    type: "scene_setup",
    fn: () => {
      // Hide Jess; bring Lily back for Scene 3
      document.getElementById("jessWrap").style.display = "none";
      document.getElementById("lilyWrap").style.display = "block";
    }
  },

  // Scene 3
  { type: "sfx", audio: doorbell},

  // show the phone on the counter 
  {
    type: "scene_setup",
    fn: () => {
      document.getElementById("phoneWrap").style.display = "block";
    }
  },

  { type: "char", char: "mel", audio: mel14},
  { type: "char", char: "lily", audio: lily4},
  { type: "char", char: "mel", audio: mel15},

  // click on phone to trigger the video popup
  { type: "phone_click_and_video", notificationTime: 14 },

  { type: "char", char: "mel", audio: mel16},

  // Transiton
  { type: "transition" },
  {
    type: "scene_setup",
    fn: () => {
      // show jess alongside lily for the proposal scene + hide phone
      document.getElementById("phoneWrap").style.display = "none";
      document.getElementById("jessWrap").style.display = "block";
    }
  },

  // Scene 4 - Proposal
  { type: "fade_bg", targetVolume: 0.08, durationMs: 1500 },

  { type: "char", char: "mel", audio: mel17},
  { type: "char", char: "lily", audio: lily5},

  { type: "pause", ms: 1200},

  { type: "char", char: "jess", audio: jess7},

  { type: "pause", ms: 2000},

  { type: "char", char: "jess", audio: jess8},
  { type: "char", char: "lily", audio: lily6},

  // fade to black, then show the end screen
  { type: "transition" },
  { type: "end_screen" }
];

// ---------- ENGINE ----------
// reads the sequence array one step at a time and handles each type

let step = 0;

function next() {
  const cur = scene[step];
  if (!cur) return;

  clearAllClicks();
  clearAllGlows();

  // sfx: auto-plays and waits for sound to finish before continuing
  if (cur.type === "sfx") {
    cur.audio.currentTime = 0;
    cur.audio.onended = null;
    cur.audio.play();

    cur.audio.onended = () => {
      step++;
      next();
    };
    return;
  }

  // bg_sfx: starts looping in the background, continues forever
  if (cur.type === "bg_sfx") {
    cur.audio.currentTime = 0;
    cur.audio.loop = true;
    cur.audio.volume = 0.2;
    cur.audio.play();

    step++;
    next();
    return;
  }

  // transition: fade to black -> run callback -> fade back in
  if (cur.type === "transition") {
    transition(() => {
      step++;
      next();
    });
    return;
  }

  // scene_setup: runs custom functions to show/hide characters
  if (cur.type === "scene_setup") {
    cur.fn();
    step++;
    next();
    return;
  }

  // fade_bg: lowers background volume
  if (cur.type === "fade_bg") {
    fadeBgVolume(cur.targetVolume, cur.durationMs);
    step++;
    next();
    return;
  }

  // pause: waits a set time
  if (cur.type === "pause") {
    setTimeout(() => {
      step++;
      next();
    }, cur.ms);
    return;
  }

  // glows the character, waits for a click, plays their line then advances
  if (cur.type === "char") {
    const clickTarget = getClickTarget(cur.char);
    const visual = document.getElementById(cur.char);

    visual.classList.add("glow"); // highlights active speaker

    clickTarget.style.pointerEvents = "auto";
    clickTarget.onclick = () => {
      clickTarget.onclick = null; // prevents double clicks
      visual.classList.remove("glow");

      cur.audio.currentTime = 0;
      cur.audio.onended = null;
      cur.audio.play();

      cur.audio.onended = () => {
        step++;
        next(); // advance after line finishes playing 
      };
    };
    return;
  }

  // phone_click_and_video: glows the phone and waits for the player to click it
  // then, opens the phone screen recording & plays phoneTyping and notification sound
  // closes popup and continues when video ends
  if (cur.type === "phone_click_and_video") {
    const phoneImg = document.getElementById("phoneImg");
    const phoneHotspot = document.getElementById("phoneHotspot");

    phoneImg.classList.add("glow");

    phoneHotspot.style.pointerEvents = "auto";
    phoneHotspot.onclick = () => {
      phoneHotspot.onclick = null;
      phoneImg.classList.remove("glow");

      showPhonePopup(cur.notificationTime, () => {
        step++;
        next();
      });

      step++; 
    };
    return;
  }

  // end_screen: fades in the ending card with border and text, plays end music
  if (cur.type === "end_screen") {
    showEndScreen();
    return; 
  }
}

// ---------- START ----------
// clicking the "Open" sign hides the exterior, shows the interior, starts the background ambience, and kicks off the sequence

document.getElementById("openSign").onclick = () => {
  document.getElementById("exterior").style.display = "none";
  document.getElementById("interior").style.display = "block";

  bg.loop = true;
  bg.volume = 0.40;
  bg.play();

  next(); // begin step 0
};
