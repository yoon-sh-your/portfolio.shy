document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".title .zoom").forEach(zoomBtn => {
        zoomBtn.addEventListener("click", () => {
            if (document.querySelector(".pop_area")) return;
            
            const pictureWrap = zoomBtn.closest(".picture_wrap");
            if (!pictureWrap) return;
            
            const imgBox = pictureWrap.querySelector(".img_box");
            if (!imgBox) return;
            
            setTimeout(() => {
                // imgBox 복사
                const imgBoxClone = imgBox.cloneNode(true);
                imgBoxClone.style.transform = "scale(1)"; // 기본 스케일 설정
                imgBoxClone.style.transformOrigin = "center";
                imgBoxClone.style.display = "flex"; // 부모 컨테이너 영향을 방지
                imgBoxClone.style.justifyContent = "center";
                imgBoxClone.style.alignItems = "center";
                imgBoxClone.style.width = "100%";
                imgBoxClone.style.height = "100%";
                imgBoxClone.style.position = "relative";
                
                // 팝업 내부 요소 추가
                const popArea = document.querySelector(".pop_area .image-content");
                if (popArea) {
                    popArea.innerHTML = ""; // 기존 내용 삭제
                    popArea.appendChild(imgBoxClone);

                    document.body.classList.add("ovh");
                    const closeBtn = document.querySelector(".image_zoom_wrap .close");
                    if (closeBtn) {
                        closeBtn.addEventListener("click", () => {
                            document.body.classList.remove("ovh");
                        });
                    }
                    
                    // 확대/축소 버튼 이벤트 추가
                    const scaleUpBtn = document.querySelector(".scale_up");
                    const scaleDownBtn = document.querySelector(".scale_down");
                    let scale = 1;
                    
                    scaleUpBtn.addEventListener("click", () => {
                        if (scale < 2) {
                            scale += 0.5;
                            imgBoxClone.style.transform = `scale(${scale})`;
                        }
                    });
                    
                    scaleDownBtn.addEventListener("click", () => {
                        if (scale > 1) {
                            scale -= 0.5;
                            imgBoxClone.style.transform = `scale(${scale})`;
                        }
                    });
                }
            }, 0);
        });
    });
});
