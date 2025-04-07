document.addEventListener("DOMContentLoaded", () => {
  const windowWidth = window.innerWidth;
  const wrapperWidth = 180;
  const finalPosition = windowWidth - wrapperWidth;
  const stepDistance = finalPosition / 6;
  const tl = gsap.timeline();


  tl.to(".count", {
    x: -900,
    duration:0.85,
    delay: 0.5,
    ease:"power4.inOut"
  })



    for (let i = 1; i <= 6; i++) {
      const xPosition = -900 + i * 180;
      tl.to(".count", {
        x: xPosition,
        duration: 0.85,
        ease: "power4.inOut",
        onStart:() =>{
          gsap.to(".count-wrapper", {
            x:stepDistance * i,
            duration : 0.85,
            ease: "power4.inOut"
          })
        }
      });
    }

    gsap.set(".revealer svg", {scale:0})

    const delays = [6, 6.5, 7];

document.querySelectorAll(".revealer svg").forEach((el, i) => {
  gsap.to(el, {
    scale: 45,
    duration: 1.5,
    ease: "power4.inOut",
    delay: delays[i],
    onComplete: () => {
      if (i === delays.length - 1) {
        document.querySelector(".loader").remove();
      }
    },
  });
});


  gsap.to(".header h1", {
    onStart: () => {
      gsap.to(".toggle-btn", {
        scale:1,
        duration:1,
        ease:"power4.inOut"
      })
      gsap.to(".line p", {
        y:0,
        duration:1,
        stagger:0.1,
        ease:"power3.out"
      })
    },
    rotateY: 0,
    opacity:1, 
    duration:2,
    ease: "power3.out",
    delay: 8
  })
});


// // interactive 
// document.addEventListener("DOMContentLoaded", () => {
//   gsap.registerPlugin(ScrollTrigger);

//   const lenis = new Lenis();

//   lenis.on("scroll", ScrollTrigger.update);

//   gsap.ticker.add((time) => {
//       lenis.raf(time * 1000);
//   });

//   gsap.ticker.lagSmoothing(0);

//  const interSection = document.querySelector(".interactive");
//  const slidesContainer = document.querySelector(".slides");
//  const slider = document.querySelector(".slider");
//  const slides = document.querySelectorAll(".slide");

//  const interHeight = window.innerHeight * 6;
//  const totalMove = slidesContainer.offsetWidth - slider.offsetWidth;
//  const slideWidth = slider.offsetWidth;

//  slides.forEach((slide) => {
//   const title = slide.querySelector(".title h1");

//   gsap.set(title, { y: -200 });
// });

// let currentVisibleIndex = null;
// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//       const currentIndex = Array.from(slides).indexOf(entry.target);
//       const titles = Array.from(slides).map((slide) =>
//           slide.querySelector(".title h1")
//       );

//       if (entry.intersectionRatio >= 0.25) {
//           currentVisibleIndex = currentIndex;

//           titles.forEach((title, index) => {
//               gsap.to(title, {
//                   y: index === currentIndex ? 0 : -200,
//                   duration: 0.5,
//                   ease: "power2.out",
//                   overwrite: true,
//               });
//           });
//       } else if (
//           entry.intersectionRatio < 0.25 &&
//           currentVisibleIndex === currentIndex
//       ) {
//           const prevIndex = currentIndex - 1;
//           currentVisibleIndex = prevIndex >= 0 ? prevIndex : null;

//           titles.forEach((title, index) => {
//               gsap.to(title, {
//                   y: index === prevIndex ? 0 : -200,
//                   duration: 0.5,
//                   ease: "power2.out",
//                   overwrite: true,
//               });
//           });
//       }
//   });
// },{
//   root:slider,
//   threshold: [0, 0.25],
// });
// slides.forEach((slide) => observer.observe(slide));

// ScrollTrigger.create({
//   trigger: interSection,
//   start: "top top",
//   end: `+=${interHeight}px`,
//   scrub:1,
//   pin:true,
//   pinSpacing:true,
//   onUpdate:(self) => {
//     const progress = self.progress;
//     const mainMove = progress * totalMove;

//     gsap.set(slidesContainer, {
//       x : -mainMove,
//     })

//     const currentSlide = Math.floor(mainMove / slideWidth);
//     const sliderProgress = (mainMove % slideWidth) / slideWidth;

//     slides.forEach((slide, index) => {
//       const image = slide.querySelector("img");
//       if(image){
//         if(index === currentSlide || index === currentSlide + 1){
//           const relativeProgress = 
//           index === currentSlide ? sliderProgress : sliderProgress - 1;
//           const parallaxAmount = relativeProgress * slideWidth * 0.25;
//           gsap.set(image,{
//             x : parallaxAmount,
//             scale: 1.35,
//           })
//         } else {
//           gsap.set(image,{
//             x : 0,
//             scale:1.35,
//           })
//         }
//       }
//     })
//   }
// })

// });