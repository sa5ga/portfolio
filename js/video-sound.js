(function initVideoControls() {
  const figures = document.querySelectorAll(".case-study__figure--video");

  figures.forEach((figure) => {
    const video = figure.querySelector("video");
    if (!video) return;

    video.pause();
    video.volume = 1;

    let lastVolume = 1;
    let isSeeking = false;
    let idleTimer = null;
    const IDLE_MS = 3000;

    function showUi() {
      figure.classList.add("is-ui-visible");
    }

    function hideUi() {
      if (figure.classList.contains("is-controls-visible")) return;
      figure.classList.remove("is-ui-visible");
      const active = document.activeElement;
      if (active && figure.contains(active) && typeof active.blur === "function") {
        active.blur();
      }
    }

    function clearIdleTimer() {
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
        idleTimer = null;
      }
    }

    function resetIdleTimer() {
      showUi();
      clearIdleTimer();
      if (!figure.matches(":hover")) return;
      idleTimer = window.setTimeout(hideUi, IDLE_MS);
    }

    function pinControls() {
      figure.classList.add("is-controls-visible");
      showUi();
      clearIdleTimer();
    }

    function unpinControls() {
      figure.classList.remove("is-controls-visible");
      if (figure.matches(":hover")) resetIdleTimer();
      else hideUi();
    }

    const controls = document.createElement("div");
    controls.className = "case-study__video-controls";

    const centerToggle = document.createElement("button");
    centerToggle.type = "button";
    centerToggle.className = "case-study__video-center-toggle is-paused";
    centerToggle.setAttribute("aria-label", "Play video");
    centerToggle.innerHTML = `
      <svg class="case-study__video-center-icon case-study__video-center-icon--play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7L8 5z"/>
      </svg>
      <svg class="case-study__video-center-icon case-study__video-center-icon--pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/>
      </svg>
    `;

    const bar = document.createElement("div");
    bar.className = "case-study__video-bar";
    bar.innerHTML = `
      <button type="button" class="case-study__video-bar-toggle is-paused" aria-label="Play video">
        <svg class="case-study__video-bar-icon case-study__video-bar-icon--play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7L8 5z"/>
        </svg>
        <svg class="case-study__video-bar-icon case-study__video-bar-icon--pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/>
        </svg>
      </button>
      <span class="case-study__video-time">0:00 / 0:00</span>
      <div class="case-study__video-progress">
        <input
          type="range"
          class="case-study__video-seek"
          min="0"
          max="1000"
          value="0"
          step="1"
          aria-label="Seek through video"
          aria-valuemin="0"
          aria-valuemax="1000"
          aria-valuenow="0"
        >
      </div>
      <div class="case-study__video-volume">
        <button type="button" class="case-study__video-sound is-muted" aria-label="Unmute video" aria-pressed="false">
          <svg class="case-study__video-sound-icon case-study__video-sound-icon--muted" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 9l-6 6M17 9l6 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
          </svg>
          <svg class="case-study__video-sound-icon case-study__video-sound-icon--low" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
          </svg>
          <svg class="case-study__video-sound-icon case-study__video-sound-icon--high" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            <path d="M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
          </svg>
        </button>
        <input
          type="range"
          class="case-study__video-volume-range"
          min="0"
          max="100"
          value="100"
          step="1"
          aria-label="Volume"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="100"
        >
      </div>
    `;

    controls.appendChild(centerToggle);
    controls.appendChild(bar);
    figure.appendChild(controls);

    const barToggle = bar.querySelector(".case-study__video-bar-toggle");
    const soundButton = bar.querySelector(".case-study__video-sound");
    const seekInput = bar.querySelector(".case-study__video-seek");
    const volumeInput = bar.querySelector(".case-study__video-volume-range");
    const timeEl = bar.querySelector(".case-study__video-time");

    function formatTime(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    function isPlaying() {
      return !video.paused && !video.ended;
    }

    function syncToggleButtons() {
      const playing = isPlaying();
      figure.classList.toggle("is-playing", playing);
      figure.classList.toggle("is-paused", !playing);
      centerToggle.classList.toggle("is-paused", !playing);
      centerToggle.classList.toggle("is-playing", playing);
      barToggle.classList.toggle("is-paused", !playing);
      barToggle.classList.toggle("is-playing", playing);
      barToggle.setAttribute(
        "aria-label",
        playing ? "Pause video" : "Play video"
      );
      centerToggle.setAttribute(
        "aria-label",
        playing ? "Pause video" : "Play video"
      );
    }

    function syncSoundButton() {
      const muted = video.muted || video.volume === 0;
      soundButton.classList.toggle("is-muted", muted);
      soundButton.classList.toggle("is-low", !muted && video.volume <= 0.5);
      soundButton.classList.toggle("is-high", !muted && video.volume > 0.5);
      soundButton.setAttribute("aria-pressed", muted ? "false" : "true");
      soundButton.setAttribute(
        "aria-label",
        muted ? "Unmute video" : "Mute video"
      );
      volumeInput.value = String(Math.round((muted ? 0 : video.volume) * 100));
      volumeInput.setAttribute("aria-valuenow", volumeInput.value);
    }

    function syncProgress() {
      const duration = video.duration;
      const current = video.currentTime;
      timeEl.textContent = `${formatTime(current)} / ${formatTime(duration)}`;

      if (!isSeeking && Number.isFinite(duration) && duration > 0) {
        const value = Math.round((current / duration) * 1000);
        seekInput.value = String(value);
        seekInput.setAttribute("aria-valuenow", String(value));
      }
    }

    function playVideo() {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          syncSoundButton();
          video.play().catch(() => {});
        });
      }
    }

    function pauseVideo() {
      video.pause();
    }

    function togglePlayPause() {
      if (isPlaying()) pauseVideo();
      else playVideo();
    }

    function seekToRatio(ratio) {
      if (!Number.isFinite(video.duration)) return;
      video.currentTime = Math.max(0, Math.min(video.duration, ratio * video.duration));
      syncProgress();
    }

    centerToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePlayPause();
    });

    barToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePlayPause();
    });

    soundButton.addEventListener("click", (event) => {
      event.stopPropagation();

      if (video.muted || video.volume === 0) {
        video.muted = false;
        video.volume = lastVolume > 0 ? lastVolume : 1;
        if (video.paused) playVideo();
      } else {
        lastVolume = video.volume;
        video.muted = true;
        video.volume = 0;
      }

      syncSoundButton();
    });

    volumeInput.addEventListener("input", (event) => {
      event.stopPropagation();
      const level = Number(volumeInput.value) / 100;
      video.volume = level;

      if (level === 0) {
        video.muted = true;
      } else {
        video.muted = false;
        lastVolume = level;
      }

      syncSoundButton();
    });

    seekInput.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      isSeeking = true;
      pinControls();
    });

    seekInput.addEventListener("input", (event) => {
      event.stopPropagation();
      const ratio = Number(seekInput.value) / 1000;
      if (Number.isFinite(video.duration)) {
        timeEl.textContent = `${formatTime(ratio * video.duration)} / ${formatTime(video.duration)}`;
      }
      seekInput.setAttribute("aria-valuenow", seekInput.value);
    });

    seekInput.addEventListener("change", (event) => {
      event.stopPropagation();
      seekToRatio(Number(seekInput.value) / 1000);
      isSeeking = false;
    });

    seekInput.addEventListener("pointerup", () => {
      isSeeking = false;
    });

    volumeInput.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      pinControls();
    });

    window.addEventListener("pointerup", () => {
      if (isSeeking) isSeeking = false;
      unpinControls();
    });

    figure.addEventListener("mouseenter", resetIdleTimer);
    figure.addEventListener("mousemove", resetIdleTimer);
    figure.addEventListener("mouseleave", () => {
      clearIdleTimer();
      hideUi();
    });

    figure.addEventListener(
      "touchstart",
      (event) => {
        if (event.target.closest("button, input")) return;
        resetIdleTimer();
      },
      { passive: true }
    );

    controls.addEventListener("focusin", resetIdleTimer);

    figure.addEventListener("click", (event) => {
      if (event.target.closest("button, input, .case-study__video-bar")) return;
      togglePlayPause();
    });

    bar.addEventListener("click", (event) => event.stopPropagation());

    video.addEventListener("play", syncToggleButtons);
    video.addEventListener("pause", syncToggleButtons);
    video.addEventListener("ended", syncToggleButtons);
    video.addEventListener("timeupdate", syncProgress);
    video.addEventListener("loadedmetadata", syncProgress);
    video.addEventListener("durationchange", syncProgress);
    video.addEventListener("volumechange", syncSoundButton);

    syncToggleButtons();
    syncSoundButton();
    syncProgress();
  });
})();
