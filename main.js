// SpaceCongo - JavaScript Premium
class SpaceCongoApp {
  constructor() {
    this.init();
  }

  init() {
    // Initialisation progressive
    this.initNavigation();
    this.initAnimations();
    this.initForms();
    this.initScrollEffects();
    this.setActiveNav();

    // Optimisation des performances
    this.debounceEvents();

    console.log("SpaceCongo - Application initialisée");
  }

  // Navigation sobre et fluide
  initNavigation() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    const header = document.querySelector(".header");
    const navLinks = document.querySelectorAll(".nav-link");

    // Toggle menu mobile
    if (menuToggle) {
      menuToggle.addEventListener("click", (e) => {
        e.preventDefault();
        nav.classList.toggle("active");
        menuToggle.classList.toggle("active");
        document.body.style.overflow = nav.classList.contains("active")
          ? "hidden"
          : "";
      });
    }

    // Fermer le menu au clic sur un lien
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 1024) {
          nav.classList.remove("active");
          menuToggle.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });

    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener("click", (e) => {
      if (nav && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      // Ajouter/supprimer classe scroll
      if (currentScroll > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Cacher/afficher le header au scroll
      if (currentScroll > 200 && currentScroll > lastScroll) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScroll = currentScroll;
    });
  }

  // Animations fluides
  initAnimations() {
    // Animation au scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll(".card, .feature, .testimonial").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

    // Animation des compteurs
    this.animateCounters();
  }

  // Animation des compteurs
  animateCounters() {
    const counters = document.querySelectorAll("[data-counter]");

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-counter"));
      const duration = 2000;
      const step = target / (duration / 16); // 60fps

      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent =
          Math.floor(current) + (counter.textContent.includes("+") ? "+" : "");
      }, 16);
    });
  }

  // Formulaires élégants
  initForms() {
    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Désactiver le bouton
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading">Envoi en cours...</span>';

        try {
          // Simulation d'envoi
          await this.sleep(1500);

          // Succès
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Envoyé !';
          submitBtn.style.background = "var(--success)";

          // Réinitialiser après 2 secondes
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = "";
            form.reset();
          }, 2000);
        } catch (error) {
          // Erreur
          submitBtn.innerHTML = '<i class="fas fa-exclamation"></i> Erreur';
          submitBtn.style.background = "var(--error)";

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = "";
          }, 2000);
        }
      });

      // Validation en temps réel
      form.addEventListener("input", (e) => {
        if (e.target.matches("input, textarea, select")) {
          this.validateField(e.target);
        }
      });
    });
  }

  // Validation de champ
  validateField(field) {
    if (field.hasAttribute("required") && !field.value.trim()) {
      field.style.borderColor = "var(--error)";
      return false;
    }

    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        field.style.borderColor = "var(--error)";
        return false;
      }
    }

    field.style.borderColor = "var(--success)";
    return true;
  }

  // Effets de scroll
  initScrollEffects() {
    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");

        if (href === "#") return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          // Fermer le menu mobile
          const nav = document.querySelector(".nav");
          const menuToggle = document.querySelector(".menu-toggle");
          if (nav && nav.classList.contains("active")) {
            nav.classList.remove("active");
            menuToggle.classList.remove("active");
            document.body.style.overflow = "";
          }

          // Scroll fluide
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Navigation active
  setActiveNav() {
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href");
      link.classList.remove("active");

      if (
        linkPath === currentPath ||
        (currentPath === "" && linkPath === "index.html") ||
        (currentPath.includes(linkPath.replace(".html", "")) &&
          linkPath !== "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  // Debounce pour les événements
  debounceEvents() {
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    // Resize optimisé
    window.addEventListener(
      "resize",
      debounce(() => {
        this.handleResize();
      }, 250)
    );
  }

  // Gestion du resize
  handleResize() {
    const nav = document.querySelector(".nav");
    const menuToggle = document.querySelector(".menu-toggle");

    // Fermer le menu mobile si on passe en desktop
    if (window.innerWidth > 1024 && nav && nav.classList.contains("active")) {
      nav.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Utilitaires
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Chargement progressif des images
  lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Initialisation quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
  window.SpaceCongo = new SpaceCongoApp();
});

// Support pour les anciens navigateurs
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}

// Polyfill pour IntersectionObserver
if (!("IntersectionObserver" in window)) {
  // Charger le polyfill dynamiquement
  const script = document.createElement("script");
  script.src =
    "https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver";
  document.head.appendChild(script);
}
