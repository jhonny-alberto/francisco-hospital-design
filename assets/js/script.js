/**
 * This is script for index page
 */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

(function ($) {
  $(document).ready(function () {
    // Function to add and remove the page transition screen
    const loader = document.querySelector(".loader");
    // Horizontal Page Transition
    function loaderIn() {
      // GSAP tween to stretch the loading screen across the whole screen
      return gsap.fromTo(
        loader,
        {
          rotation: 10,
          scaleX: 0,
          scaleY: 1,
          xPercent: -5,
        },
        {
          duration: 0.8,
          xPercent: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          ease: "Power4.inOut",
          transformOrigin: "left center",
        }
      );
    }
    function loaderAway(container) {
      // GSAP tween to hide the loading screen
      return gsap
        .timeline({ delay: 1 })
        .add("load")
        .to(loader, {
          duration: 0.8,
          scaleX: 0,
          scaleY: 1,
          xPercent: 5,
          rotation: -10,
          transformOrigin: "right center",
          ease: "Power4.inOut",
        })
        .call(contentAnimation, [container], "load");
    }
    // Vertical Page Transition
    function loaderDown() {
      // GSAP tween to stretch the loading screen across the whole screen
      return gsap.fromTo(
        loader,
        {
          xPercent: 0,
          skewY: 0,
          scaleY: 0,
          scaleX: 1,
          rotation: 0,
          transformOrigin: "left bottom",
        },
        {
          duration: 0.8,
          xPercent: 0,
          skewY: "10deg",
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          ease: "Power4.inOut",
          transformOrigin: "left bottom",
        }
      );
    }
    function loaderUp(container) {
      // GSAP tween to hide the loading screen
      return gsap
        .timeline({ delay: 1 })
        .add("load")
        .to(loader, {
          duration: 0.8,
          xPercent: 0,
          skewY: 0,
          scaleX: 1,
          scaleY: 0,
          rotation: 0,
          transformOrigin: "left top",
          ease: "Power4.inOut",
        })
        .call(contentAnimation, [container], "load");
    }
    // Function to animate the content of each page
    function contentAnimation() {
      // Reload scripts
      initCursor();
      initScroll();
      initSlider();
      initAnimations();
      initPopup();
      if ($(".page-map").length > 0) {
        initMap();
      }
    }
    //
    function initLoader() {
      if ($(".page-single-story").length > 0) {
        gsap.set(loader, {
          skewY: 0,
          scaleY: 0,
          yPercent: -50,
          transformOrigin: "left bottom",
          autoAlpha: 1,
          backgroundColor: "#0a17a9",
        });
      } else {
        gsap.set(loader, {
          scaleX: 0,
          rotation: 10,
          xPercent: -5,
          yPercent: -50,
          transformOrigin: "left center",
          autoAlpha: 1,
          backgroundColor: "#00b176",
        });
      }
    }

    // Init Barba

    if ($(".barba-wrapper").length > 0) {
      initLoader();

      barba.hooks.before(() => {
        document.querySelector("html").classList.add("is-transitioning");
      });
      barba.hooks.after(() => {
        document.querySelector("html").classList.remove("is-transitioning");
        initLoader();
      });

      barba.init({
        transitions: [
          {
            async leave(data) {
              await loaderIn();
              data.current.container.remove();
            },
            async enter(data) {
              await loaderAway(data.next.container);
            },
          },
          {
            name: "story-story",
            from: {
              namespace: "story",
            },
            to: {
              namespace: "story",
            },
            async leave(data) {
              await loaderDown();
              data.current.container.remove();
            },
            async enter(data) {
              await loaderUp(data.next.container);
            },
          },
        ],
      });
    }

    // CURSOR
    initCursor();
    function initCursor() {
      let cursor = $(".cursor"),
        follower = $(".cursor-follower");
      cursor.removeAttr("class");
      cursor.addClass("cursor");
      follower.removeAttr("class");
      follower.addClass("cursor-follower");
      let posX = 0,
        posY = 0;
      let mouseX = 0,
        mouseY = 0;
      TweenMax.to({}, 0.016, {
        repeat: -1,
        onRepeat: function () {
          posX += (mouseX - posX) / 9;
          posY += (mouseY - posY) / 9;

          TweenMax.set(follower, {
            css: {
              left: posX - 12,
              top: posY - 12,
            },
          });

          TweenMax.set(cursor, {
            css: {
              left: mouseX,
              top: mouseY,
            },
          });
        },
      });
      $(document).on("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
      // Change cursor on links
      $(document).on("mouseenter", "a, button", function () {
        cursor.addClass("active");
        follower.addClass("active");
      });
      $(document).on("mouseleave", "a, button", function () {
        cursor.removeClass("active");
        follower.removeClass("active");
      });
      // Change cursor colors
      $(document).on("mouseenter", ".change-cursor", function () {
        let color = $(this).attr("data-color");
        cursor.addClass(color);
        follower.addClass(color);
      });
      $(document).on("mouseleave", ".change-cursor", function () {
        let color = $(this).attr("data-color");
        cursor.removeClass(color);
        follower.removeClass(color);
      });
    }

    // Init scroller
    initScroll();
    function initScroll() {
      const scroller = document.querySelector("scroll");
      if (scroller) {
        const bodyScrollBar = Scrollbar.init(scroller, {
          damping: 0.1,
        });
        ScrollTrigger.scrollerProxy("scroll", {
          scrollTop(value) {
            if (arguments.length) {
              bodyScrollBar.scrollTop = value;
            }
            return bodyScrollBar.scrollTop;
          },
        });
        bodyScrollBar.track.xAxis.element.remove();
        bodyScrollBar.addListener(ScrollTrigger.update);
        ScrollTrigger.defaults({ scroller: scroller });
        bodyScrollBar.addListener((status) => {
          $(window).trigger("scroll");
        });
        // Scroll To links
        $(document).on(
          "click touchend",
          ".sidebar a, .btn-scroll-link",
          function (e) {
            let target = $(this).attr("href");
            const targetEl = document.querySelector(target);
            const targetRect = targetEl.getBoundingClientRect();
            e.preventDefault();
            var topY =
              $(target).offset().top - $(".scroll-content").offset().top - 100;
            gsap.to(bodyScrollBar, {
              duration: 1,
              scrollTo: {
                y: topY,
                autoKill: true,
              },
              offsetY: 80,
              ease: "power4",
            });
          }
        );
      }
    }
    initSlider();
    // Init Slider
    function initSlider() {
      $carousel = $(".slick-carousel");
      function setSlideVisibility() {
        //Find the visible slides i.e. where aria-hidden="false"
        var visibleSlides = $carousel.find(
          '.slick-slide__item[aria-hidden="false"]'
        );
        //Make sure all of the visible slides have an opacity of 1
        $(visibleSlides).each(function () {
          $(this).css("opacity", 1);
        });
        //Set the opacity of the first and last partial slides.
        $(visibleSlides).first().prev().css("opacity", 0);
      }
      $carousel.slick({
        arrows: false,
        dots: false,
        infinite: true,
        speed: 300,
        slidesToScroll: 1,
        variableWidth: true,
      });
      // Show half
      setSlideVisibility();
      $carousel.each(function () {
        $(this).slick("slickGoTo", 0);
        $(this).on("afterChange", function () {
          let $parent = $(this).closest(".slider-wrapper");
          let $curNum = $parent.find(".current-num");
          $curNum.text($(this).slick("slickCurrentSlide") + 1);
          setSlideVisibility();
        });
      });
      $(".btn-slider").on("click", function () {
        let $wrapper = $(this).closest(".slider-wrapper");
        let $slider = $wrapper.find(".slick-carousel");
        if ($(this).hasClass(".prev")) {
          $slider.slick("slickPrev");
        } else {
          $slider.slick("slickNext");
        }
      });
    }
    // Animations
    initAnimations();
    function initAnimations() {}

    // Init Popup
    initPopup();
    function initPopup() {
      // Show splash screen only once
      if (
        $(".splash-screen").length > 0 &&
        !localStorage.getItem("splash_shown")
      ) {
        $(".splash-screen").css({ display: "flex" });
        localStorage.setItem("splash_shown", true);
      }
      // Init popup
      if ($(".popup").length > 0) {
        $(".popup-close").on("click", function () {
          let popup = $(this).closest(".popup");
          $(popup).removeClass("active");
        });
        $(".btn-popup").on("click", function () {
          let popup = $(this).attr("data-target");
          $(popup).addClass("active");
        });
      }
    }

    // Init Components
    initComponents();
    function initComponents() {
      // Init hamburger
      $(".hamburger-btn").on("click", function () {
        $(".nav-menu").css("left", 0);
      });
      // Init hamburger close
      $(".hamburger-close-btn").on("click", function () {
        $(".nav-menu").css("left", "-100vw");
      });
      // Init Accordion
      $(".accordion-item__title").on("click", function () {
        let $accordion = $(this).closest(".accordion-item");
        $accordion.toggleClass("active");
      });
    }
  });
})(jQuery);
