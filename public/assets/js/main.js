(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".nav-mobile");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Obfuscated email: assembled at runtime from char codes so it never
     appears as plain text in the page source (deters basic scraper bots). */
  var userCodes = [99, 111, 110, 116, 97, 99, 116, 97, 110, 116, 104, 111, 110, 121, 115, 107, 111];
  var domainCodes = [105, 99, 108, 111, 117, 100, 46, 99, 111, 109];

  function fromCodes(codes) {
    return String.fromCharCode.apply(null, codes);
  }

  var email = fromCodes(userCodes) + "@" + fromCodes(domainCodes);

  document.querySelectorAll("[data-email-link]").forEach(function (el) {
    var subject = el.getAttribute("data-subject") || "";
    var mailto = "mailto:" + email + (subject ? "?subject=" + encodeURIComponent(subject) : "");
    el.setAttribute("href", mailto);
  });

  document.querySelectorAll("[data-email-text]").forEach(function (el) {
    el.textContent = email;
  });

  document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var done = function () {
        var toast = document.querySelector("[data-copy-toast]");
        if (toast) {
          toast.classList.add("is-visible");
          window.clearTimeout(btn._toastTimer);
          btn._toastTimer = window.setTimeout(function () {
            toast.classList.remove("is-visible");
          }, 2200);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          window.location.href = "mailto:" + email;
        });
      } else {
        window.location.href = "mailto:" + email;
      }
    });
  });

  /* Active nav link highlighting */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-links a, .nav-mobile a[href^='#']");

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              var match = link.getAttribute("href") === "#" + entry.target.id;
              link.style.color = match ? "var(--blue-600)" : "";
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* Current year in footer */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
