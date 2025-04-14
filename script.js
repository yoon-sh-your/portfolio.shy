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
        // Hero Section Animations
        gsap.to(".hero h1", {
            rotateY: 0,
            opacity: 1,
            duration: 2,
            ease: "power3.out",
            delay: 0.5
        });
  
        // Intro Section Animations (Desktop)
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
        }
  
        // Interactive Section Animations
        const interSection = document.querySelector(".interactive");
        const slidesContainer = document.querySelector(".slides");
        const slider = document.querySelector(".slider");
        const slides = document.querySelectorAll(".slide");
  
        const interHeight = window.innerHeight * 4;
        const totalMove = slidesContainer.offsetWidth - slider.offsetWidth;
        const slideWidth = slider.offsetWidth;
  
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
  
        ScrollTrigger.create({
            trigger: interSection,
            start: "top top",
            end: `+=${interHeight}px`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const mainMove = progress * totalMove;
  
                gsap.set(slidesContainer, {
                    x: -mainMove,
                });
  
                const currentSlide = Math.floor(mainMove / slideWidth);
                const sliderProgress = (mainMove % slideWidth) / slideWidth;
  
                slides.forEach((slide, index) => {
                    const image = slide.querySelector("img");
                    if (image) {
                        if (index === currentSlide || index === currentSlide + 1) {
                            const relativeProgress =
                                index === currentSlide ? sliderProgress : sliderProgress - 1;
                            const parallaxAmount = relativeProgress * slideWidth * 0.25;
                            gsap.set(image, {
                                x: parallaxAmount,
                                scale: 1.35,
                            });
                        } else {
                            gsap.set(image, {
                                x: 0,
                                scale: 1.35,
                            });
                        }
                    }
                });
            }
        });
  
        // Portfolio Section 초기화
        initPortfolioSection();
    }
  
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
  
       
    }
  });