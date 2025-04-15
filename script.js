document.addEventListener("DOMContentLoaded", () => {
    // GSAP 및 Lenis 초기화 (공통)
    gsap.registerPlugin(ScrollTrigger);
  
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
  
    gsap.ticker.add((time) => {
        lenis.raf(time * 750);
    });
  
    gsap.ticker.lagSmoothing(0);
  
    // =============== Combined Website 코드 시작 =============== //
    
    // Loader Animation
    const windowWidth = window.innerWidth;
    const wrapperWidth = 180;
    const finalPosition = windowWidth - wrapperWidth;
    const stepDistance = finalPosition / 6;
    const tl = gsap.timeline();
  
    // 초기 카운터 애니메이션
    tl.to(".count", {
        x: -900,
        duration: 0.85,
        delay: 0.5,
        ease: "power4.inOut"
    });
  
    // 숫자 변경 애니메이션
    for (let i = 1; i <= 6; i++) {
        const xPosition = -900 + i * 180;
        tl.to(".count", {
            x: xPosition,
            duration: 0.85,
            ease: "power4.inOut",
            onStart: () => {
                gsap.to(".count-wrapper", {
                    x: stepDistance * i,
                    duration: 0.85,
                    ease: "power4.inOut"
                });
            }
        });
    }
  
    // Revealer 애니메이션
    gsap.set(".revealer svg", { scale: 0 });
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
                    initMainContent(); // 메인 컨텐츠 시작
                }
            },
        });
    });


  
    // 메인 컨텐츠 초기화 함수
    function initMainContent() {
     // 토글 버튼 초기화
    gsap.set(".toggle-btn", {
        opacity: 0,
        scale: 0,
        force3D: true,
    });

    const heroTl = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    heroTl
        .to(".hero h1", {
            rotateY: 0,
            opacity: 1,
            duration: 2
        })
        .to(".toggle-btn", {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power4.inOut",
            force3D: true
        }, "-=1.5");

    // 토글 버튼 z-index 유지
    gsap.set(".toggle-btn", {
        zIndex: 999999,
        force3D: true,
        clearProps: "transform" // transform 속성 초기화
    });

    // ScrollTrigger에서 토글 버튼 처리
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => {
            gsap.set(".toggle-btn", {
                zIndex: 999999,
                force3D: true,
                clearProps: "transform"
            });
        }
    });
}
// 여기에 토글 메뉴 초기화 코드 추가
const toggleBtn = document.querySelector('.toggle-btn');
const toggleMenu = document.querySelector('.toggle-menu');
let isMenuOpen = false;

// 초기 상태 설정
gsap.set(toggleMenu, {
    display: 'none',
    opacity: 0,
    zIndex: 99999
});

// 토글 버튼 클릭 이벤트
toggleBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        // 메뉴 열기
        gsap.to(toggleMenu, {
            display: 'block',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onStart: () => {
                toggleMenu.style.display = 'block';
            }
        });
    } else {
        // 메뉴 닫기
        gsap.to(toggleMenu, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                toggleMenu.style.display = 'none';
            }
        });
    }
});

// 메뉴 항목 클릭 시 자동으로 메뉴 닫기
const menuLinks = toggleMenu.querySelectorAll('a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        gsap.to(toggleMenu, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                toggleMenu.style.display = 'none';
            }
        });
    });
});



// 현재 스크롤 위치에 따라 active 클래스 추가
window.addEventListener('scroll', () => {
    const sections = ['hero', 'interactive', 'scroll-port', 'my-skills', 'design'];
    const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
    });

    menuLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});


        if (window.innerWidth >= 900) {
            const videoContainer = document.querySelector(".video-container-desktop");
  
            const breakpoints = [
                { maxWidth: 1000, translateY: -135, movMultiplier: 450 },
                { maxWidth: 1100, translateY: -130, movMultiplier: 500 },
                { maxWidth: 1200, translateY: -125, movMultiplier: 550 },
                { maxWidth: 1300, translateY: -120, movMultiplier: 600 },
            ];
  
            const getInitialValues = () => {
                const width = window.innerWidth;
                for (const bp of breakpoints) {
                    if (width <= bp.maxWidth) {
                        return {
                            translateY: bp.translateY,
                            movementMultiplier: bp.movMultiplier,
                        };
                    }
                }
                return {
                    translateY: -110,
                    movementMultiplier: 650,
                };
            };
  
            const initialValues = getInitialValues();
            const animationState = {
                scrollProgress: 0,
                initialTranslateY: initialValues.translateY,
                currentTranslateY: initialValues.translateY,
                movementMultiplier: initialValues.movementMultiplier,
                scale: 0.25,
                targetMouseX: 0,
                currentMouseX: 0,
            };
  
            window.addEventListener("resize", () => {
                const newValues = getInitialValues();
                animationState.initialTranslateY = newValues.translateY;
                animationState.movementMultiplier = newValues.movementMultiplier;
  
                if (animationState.scrollProgress === 0) {
                    animationState.currentTranslateY = newValues.translateY;
                }
            });
  
            ScrollTrigger.create({
                trigger: ".intro",
                start: "top bottom",
                end: "bottom top",
                onEnter: () => {
                    gsap.set(".toggle-btn", {
                        zIndex: 999999,
                        force3D: true,
                        clearProps: "transform"
                    });
                }
            });
            gsap.timeline({
                scrollTrigger: {
                    trigger: ".intro",
                    start: "top bottom",
                    end: "top 10%",
                    scrub: true,
                    onUpdate: (self) => {
                        animationState.scrollProgress = self.progress;
  
                        animationState.currentTranslateY = gsap.utils.interpolate(
                            animationState.initialTranslateY,
                            0,
                            animationState.scrollProgress
                        );
  
                        animationState.scale = gsap.utils.interpolate(0.25, 1.3, animationState.scrollProgress);
                    },
                },
            });
  
            document.addEventListener("mousemove", (e) => {
                animationState.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            });
  
            const animate = () => {
                if (window.innerWidth < 900) return;
  
                const {
                    scale,
                    targetMouseX,
                    currentMouseX,
                    movementMultiplier,
                } = animationState;
  
                const scaleMovementMultiplier = (1 - scale) * movementMultiplier;
                const maxHorizontalMovement = scale < 0.95 ? targetMouseX * scaleMovementMultiplier : 0;
  
                animationState.currentMouseX = gsap.utils.interpolate(
                    currentMouseX,
                    maxHorizontalMovement,
                    0.05
                );
  
                videoContainer.style.transform = `translateY(${animationState.currentTranslateY}vh) translateX(${animationState.currentMouseX}px) scale(${scale})`;
  
                requestAnimationFrame(animate);
            };
  
            animate();

            // My Skills Section 애니메이션
const mySkillsSection = document.querySelector(".my-skills");

const revealMySkills = () => {
  // Animate progress bars
  const progressBars = mySkillsSection.querySelectorAll(".progress");
  progressBars.forEach((bar) => {
    const percentage = bar.getAttribute("data-percentage");
    setTimeout(() => {
      bar.style.width = `${percentage}%`;
    }, 100);
  });

  // Animate circles
  const circles = mySkillsSection.querySelectorAll(".circle");
  circles.forEach((circle) => {
    const percentage = parseInt(circle.getAttribute("data-percentage"), 10);
    let currentPercentage = 0;

    const animateCircle = () => {
      if (currentPercentage <= percentage) {
        const angle = currentPercentage * 3.6;
        circle.style.background = `conic-gradient(
          #00d9ff ${angle}deg,
          #1e2a38 0deg
        )`;
        currentPercentage++;
        requestAnimationFrame(animateCircle);
      }
    };

    requestAnimationFrame(animateCircle);
  });
};
ScrollTrigger.create({
    trigger: ".scroll-port",
    start: "top bottom",
    end: "bottom top",
    onEnter: () => {
        gsap.set(".toggle-btn", {
            zIndex: 999999,
            force3D: true,
            clearProps: "transform"
        });
    }
});
ScrollTrigger.create({
    trigger: ".outro",
    start: "top bottom",
    end: "bottom top",
    onEnter: () => {
        gsap.set(".toggle-btn", {
            zIndex: 999999,
            force3D: true,
            clearProps: "transform"
        });
    }
});
// IntersectionObserver로 스크롤 진입 시 애니메이션 실행
if (mySkillsSection) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealMySkills();
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4
  });

  observer.observe(mySkillsSection);
}




        }
  
        // Interactive Section Animations
        function initInteractiveSection() {
            const interSection = document.querySelector(".interactive");
            if (!interSection) return;
        
            const slidesContainer = document.querySelector(".slides");
            const slider = document.querySelector(".slider");
            const slides = document.querySelectorAll(".slide");
        
            // 슬라이드 컨테이너의 너비를 모든 슬라이드의 총 너비로 설정
            const totalSlides = slides.length; // 이제 4가 됨
            gsap.set(slidesContainer, {
                width: `${totalSlides * 100}%` // 400%가 됨
            });
        
            // 각 슬라이드의 너비를 전체 너비의 균등한 비율로 설정
            slides.forEach(slide => {
                gsap.set(slide, {
                    width: `${100 / totalSlides}%` // 25%가 됨
                });
            });
        
            const interHeight = window.innerHeight * 4; // 높이를 4배로 증가
            const totalMove = slidesContainer.offsetWidth - slider.offsetWidth;
            const slideWidth = slider.offsetWidth;
        
            // 초기 상태 설정
            gsap.set(slidesContainer, {
                x: window.innerWidth,
                opacity: 0
            });
        
            // 타이틀 초기 상태 설정
            slides.forEach((slide) => {
                const title = slide.querySelector(".title h1");
                gsap.set(title, { y: -200 });
            });
        
            let currentVisibleIndex = null;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const currentIndex = Array.from(slides).indexOf(entry.target);
                    const titles = Array.from(slides).map((slide) =>
                        slide.querySelector(".title h1")
                    );
        
                    if (entry.intersectionRatio >= 0.25) {
                        currentVisibleIndex = currentIndex;
                        titles.forEach((title, index) => {
                            gsap.to(title, {
                                y: index === currentIndex ? 0 : -200,
                                duration: 0.5,
                                ease: "power2.out",
                                overwrite: true,
                            });
                        });
                    } else if (
                        entry.intersectionRatio < 0.25 &&
                        currentVisibleIndex === currentIndex
                    ) {
                        const prevIndex = currentIndex - 1;
                        currentVisibleIndex = prevIndex >= 0 ? prevIndex : null;
                        titles.forEach((title, index) => {
                            gsap.to(title, {
                                y: index === prevIndex ? 0 : -200,
                                duration: 0.5,
                                ease: "power2.out",
                                overwrite: true,
                            });
                        });
                    }
                });
            }, {
                root: slider,
                threshold: [0, 0.25],
            });
        
            slides.forEach((slide) => observer.observe(slide));
        
            // 진입 애니메이션
            ScrollTrigger.create({
                trigger: interSection,
                start: "top bottom",
                end: "top center",
                onEnter: () => {
                    gsap.to(slidesContainer, {
                        x: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power3.out"
                    });
                },
                once: true
            });
        
            // 메인 슬라이드 애니메이션
            ScrollTrigger.create({
                trigger: interSection,
                start: "top top",
                end: `+=${interHeight}px`,
                pin: true,
                pinSpacing: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const mainMove = progress * totalMove;
        
                    gsap.set(slidesContainer, {
                        x: -mainMove
                    });
        
                    const currentSlide = Math.floor(mainMove / slideWidth);
                    const sliderProgress = (mainMove % slideWidth) / slideWidth;
        
                    slides.forEach((slide, index) => {
                        const image = slide.querySelector("img");
                        if (image) {
                            if (index === currentSlide || index === currentSlide + 1) {
                                const relativeProgress =
                                    index === currentSlide ? sliderProgress : sliderProgress - 1;
                                const parallaxAmount = relativeProgress * slideWidth * 0.15;
                                gsap.set(image, {
                                    x: parallaxAmount,
                                    scale: 1.15,
                                });
                            } else {
                                gsap.set(image, {
                                    x: 0,
                                    scale: 1,
                                });
                            }
                        }
                    });
                }
            });
        }
  
        // Portfolio Section 초기화
        initInteractiveSection()
        initPortfolioSection();

        initDesignSection();
        initModalInteraction(); // modalAni 함수 이름 변경
    })
  
    // =============== Portfolio Section 코드 시작 =============== //
    function initPortfolioSection() {
        // 텍스트를 스팬으로 분리하는 함수
        function splitTextIntoSpans(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                const [firstDigit, secondDigit] = element.innerText;
                element.innerHTML = `
                    <div class="digit-wrapper">
                        <span class="first">${firstDigit}</span>
                        <span class="second">${secondDigit}</span>
                    </div>
                `;
            });
        }
  
        // 갤러리를 채우는 함수
        const imagesPerProject = 6;
        const totalImages = 50;
        let imageIndex = 1;
  
        function populateGallery() {
            const imageContainers = document.querySelectorAll(".images");
            imageContainers.forEach((container) => {
                for (let j = 0; j < imagesPerProject; j++) {
                    if (imageIndex > totalImages) imageIndex = 1;
  
                    const imgContainer = document.createElement("div");
                    imgContainer.classList.add("img");
  
                    const img = document.createElement("img");
                    img.src = `./assets/img${imageIndex}.jpg`;
                    img.alt = `Project Image ${imageIndex}`;
  
                    imgContainer.appendChild(img);
                    container.appendChild(imgContainer);
  
                    imageIndex++;
                }
            });
        }
  
        // 초기화
        splitTextIntoSpans(".mask h1");
        populateGallery();
  
        // 이미지 프리뷰 설정
        const previewImg = document.querySelector(".preview-img img");
        const imgElements = document.querySelectorAll(".img img");
        
        // ScrollTrigger to change preview image on scroll
        imgElements.forEach((img) => {
            ScrollTrigger.create({
                trigger: img,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => (previewImg.src = img.src),
                onEnterBack: () => (previewImg.src = img.src),
            });
        });
        
        // 프로젝트 이름 및 인디케이터 설정
        const projects = document.querySelectorAll(".project");
        const indicator = document.querySelector(".indicator");
        const projectNames = ["Atilas Studio", "Nimbus", "Solara", "Quantum"];
        
        // 프로젝트 이름 동적 생성
        const projectNamesContainer = document.querySelector(".project-names");
        projectNamesContainer.innerHTML = `
            <div class="indicator">
                <div class="symbol"></div>
            </div>
            ${projectNames.map((name, i) => `
                <div class="name ${i === 0 ? 'active' : ''}">
                    <p>${name}</p>
                </div>
            `).join('')}
        `;
        
        const names = document.querySelectorAll(".name");
        const indicatorStep = 50;
        
        // 프로젝트 애니메이션 설정
        projects.forEach((project, index) => {
            ScrollTrigger.create({
                trigger: project,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => {
                    gsap.to(indicator, {
                        top: index * indicatorStep,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    names.forEach((name, i) => {
                        name.classList.toggle("active", i === index);
                    });
                },
                onLeaveBack: () => {
                    gsap.to(indicator, {
                        top: (index - 1) * indicatorStep,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    names.forEach((name, i) => {
                        name.classList.toggle("active", i === index - 1);
                    });
                }
            });
        });
        
        // Adjust opacity for .preview-img and .project-names based on .project .images last img
        const projectImages = document.querySelectorAll(".project .images img"); // Get all project images
        const lastImage = projectImages[projectImages.length - 1]; // Get the last image of each project
        
        ScrollTrigger.create({
            trigger: lastImage,
            start: "top bottom", // When the last image is in the viewport (adjust based on your desired trigger position)
            end: "bottom bottom", // End when the last image leaves the viewport (adjust based on your desired trigger position)
            onEnter: () => {
                // When the last image is in view, set opacity of .preview-img and .project-names to 0
                gsap.to(".preview-img", {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    onStart: () => {
                      document.querySelector(".project-names").style.display = "none";
                    }
                  });
                gsap.to(".project-names", {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    onStart: () => {
                      document.querySelector(".project-names").style.display = "none";
                    }
                  });
            },
            onLeaveBack: () => {
                // When scrolling back up, restore opacity of .preview-img and .project-names to 1
                gsap.to(".preview-img", {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    onStart: () => {
                      document.querySelector(".project-names").style.display = "block";
                    }
                  });
                gsap.to(".project-names", {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    onStart: () => {
                      document.querySelector(".project-names").style.display = "block";
                    }
                  });
            },
            start: "bottom+=2% top", // This makes the opacity change happen 5% after the element's bottom
        });
       
    }



    
  function designAni(){
    const stickySection = document.querySelector(".sticky");
    const stickyHeader = document.querySelector(".sticky-header");
    const cards = document.querySelectorAll(".card");
    const stickyHeight = window.innerHeight * 5;
    
    const transforms = [
      [
        [10, 50, -10, 10],
        [20, -20, -45, 20],
      ],
      [
        [0, 47.5, -10, 15],
        [-25, 15, -45, 30],
      ],
      [
        [0, 52.5, -10, 5],
        [15, -5, -40, 60],
      ],
      [
        [0, 50, 30, -80],
        [20, -10, 60, 5],
      ],
      [
        [0, 55, -15, 30],
        [25, -15, 60, 95],
      ],
      [
        [5, 40, -20, 25],
        [30, -25, -60, 80],
      ],
      [
        [10, 60, 0, -30],
        [35, -20, 90, 0],
      ]
    ];
    
    ScrollTrigger.create({
      trigger:stickySection,
      start:"top top",
      end:`+=${stickyHeight}px`,
      pin:true,
      pinSpacing:true,
      onUpdate: (self) => {
        const progress = self.progress;
    
        const maxTranslate = stickyHeader.offsetWidth - window.innerWidth;
        const translateX = -progress * maxTranslate;
    
        gsap.set(stickyHeader, { x: translateX });
    
        cards.forEach((card, index) => {
          const delay = index * 0.1125;
          const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));
      
          if (cardProgress > 0) {
              const cardStartX = 25;
              const cardEndX = -650;
              const yPos = transforms[index][0];
              const rotations = transforms[index][1];
    
              const cardX = gsap.utils.interpolate(
                cardStartX,
                cardEndX,
                cardProgress
            );
            
            const yProgress = cardProgress * 3;
            const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
            const yInterpolation = yProgress - yIndex;
    
            const cardY = gsap.utils.interpolate(
                yPos[yIndex],
                yPos[yIndex + 1],
                yInterpolation
            );
    
            const cardRotation = gsap.utils.interpolate(
              rotations[yIndex],
              rotations[yIndex + 1],
              yInterpolation
            );
    
            gsap.set(card,{
              xPercent: cardX, 
              yPercent: cardY,
              rotation: cardRotation,
              opacity:1,
            });
          } else {
            gsap.set(card, {opacity:0})
          }
      });
    },
    })
    
  }
function initDesignSection() {
    const designSection = document.querySelector(".design");
    if (!designSection) return;

    const stickySection = designSection.querySelector(".design-sticky");
    const stickyHeader = designSection.querySelector(".sticky-header");
    const cards = designSection.querySelectorAll(".card");
    const stickyHeight = window.innerHeight * 5;
    
    const transforms = [
        [[10, 50, -10, 10], [20, -20, -45, 20]],
        [[0, 47.5, -10, 15], [-25, 15, -45, 30]],
        [[0, 52.5, -10, 5], [15, -5, -40, 60]],
        [[0, 50, 30, -80], [20, -10, 60, 5]],
        [[0, 55, -15, 30], [25, -15, 60, 95]],
        [[5, 40, -20, 25], [30, -25, -60, 80]],
        [[10, 60, 0, -30], [35, -20, 90, 0]]
    ];
    
    ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: `+=${stickyHeight}px`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const maxTranslate = stickyHeader.offsetWidth - window.innerWidth;
            const translateX = -progress * maxTranslate;
            
            gsap.set(stickyHeader, { x: translateX });
            
            cards.forEach((card, index) => {
                const delay = index * 0.1125;
                const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));
                
                if (cardProgress > 0) {
                    const cardStartX = 25;
                    const cardEndX = -650;
                    const yPos = transforms[index][0];
                    const rotations = transforms[index][1];
                    
                    const cardX = gsap.utils.interpolate(cardStartX, cardEndX, cardProgress);
                    const yProgress = cardProgress * 3;
                    const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
                    const yInterpolation = yProgress - yIndex;
                    
                    const cardY = gsap.utils.interpolate(
                        yPos[yIndex],
                        yPos[yIndex + 1],
                        yInterpolation
                    );
                    
                    const cardRotation = gsap.utils.interpolate(
                        rotations[yIndex],
                        rotations[yIndex + 1],
                        yInterpolation
                    );
                    
                    gsap.set(card, {
                        xPercent: cardX,
                        yPercent: cardY,
                        rotation: cardRotation,
                        opacity: 1,
                    });
                } else {
                    gsap.set(card, { opacity: 0 });
                }
            });
        },
    });
}

  function initModalInteraction() {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".close");
    
    if (!modal || !modalImg || !closeBtn) return;

    document.querySelectorAll(".card img").forEach((img) => {
        img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = img.src;
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}


