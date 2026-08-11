
/* =====================================================
   BASIC ELEMENTS
===================================================== */

const bgm =
    document.getElementById("bgm");

const musicButton =
    document.getElementById("musicButton");

const musicIcon =
    document.getElementById("musicIcon");

const introScreen =
    document.getElementById("introScreen");

const invitation =
    document.getElementById("invitation");


let isPlaying = false;

let invitationStarted = false;



/* =====================================================
   OPENING SCREEN
===================================================== */

introScreen.addEventListener(
    "click",
    startInvitation
);


function startInvitation() {

    /*
       여러 번 터치하는 것 방지
    */

    if (invitationStarted) {
        return;
    }


    invitationStarted = true;



    /* =================================================
       BGM 시작
    ================================================= */

    bgm.play()
        .then(() => {

            isPlaying = true;

            musicIcon.textContent =
                "♪";

            musicButton.classList.remove(
                "off"
            );

        })
        .catch(() => {

            /*
               모바일 브라우저에서
               음악을 막더라도 청첩장은 열림
            */

            isPlaying = false;

            musicIcon.textContent =
                "🔇";

            musicButton.classList.add(
                "off"
            );

        });



    /* =================================================
       Opening 페이드 아웃
    ================================================= */

    introScreen.classList.add(
        "hide"
    );



    /* =================================================
       청첩장 페이드 인
    ================================================= */

    setTimeout(() => {

        invitation.classList.add(
            "show"
        );

    }, 250);



    /*
       opening이 완전히 사라진 후
       DOM 화면에서 숨김
    */

    setTimeout(() => {

        introScreen.style.display =
            "none";

    }, 1400);

}



/* =====================================================
   MUSIC ON / OFF
===================================================== */

musicButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();


        if (isPlaying) {

            bgm.pause();

            isPlaying = false;

            musicIcon.textContent =
                "🔇";

            musicButton.classList.add(
                "off"
            );

        } else {

            bgm.play()
                .then(() => {

                    isPlaying = true;

                    musicIcon.textContent =
                        "♪";

                    musicButton.classList.remove(
                        "off"
                    );

                })
                .catch(() => {

                    alert(
                        "음악을 재생할 수 없습니다."
                    );

                });

        }

    }
);



/* =====================================================
   COUNTDOWN
===================================================== */

const weddingDate =
    new Date(
        "2026-12-05T15:00:00+09:00"
    );


function updateCountdown() {

    const now =
        new Date();


    const difference =
        weddingDate.getTime()
        - now.getTime();



    if (difference <= 0) {

        document.getElementById(
            "days"
        ).textContent = "00";


        document.getElementById(
            "hours"
        ).textContent = "00";


        document.getElementById(
            "minutes"
        ).textContent = "00";


        document.getElementById(
            "seconds"
        ).textContent = "00";


        return;

    }



    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            difference /
            (1000 * 60 * 60)
        ) % 24;


    const minutes =
        Math.floor(
            difference /
            (1000 * 60)
        ) % 60;


    const seconds =
        Math.floor(
            difference /
            1000
        ) % 60;



    document.getElementById(
        "days"
    ).textContent =
        String(days).padStart(
            2,
            "0"
        );


    document.getElementById(
        "hours"
    ).textContent =
        String(hours).padStart(
            2,
            "0"
        );


    document.getElementById(
        "minutes"
    ).textContent =
        String(minutes).padStart(
            2,
            "0"
        );


    document.getElementById(
        "seconds"
    ).textContent =
        String(seconds).padStart(
            2,
            "0"
        );

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);

/* =====================================================
   PHOTO MODAL + SWIPE
===================================================== */

const galleryItems =
    document.querySelectorAll(".gallery-item");

const photoModal =
    document.getElementById("photoModal");

const modalImage =
    document.getElementById("modalImage");

const closeModal =
    document.getElementById("closeModal");


let savedScrollPosition = 0;

let currentImageIndex = 0;

let touchStartX = 0;
let touchEndX = 0;


/* 갤러리 이미지 목록 */
const galleryImages =
    Array.from(galleryItems).map(
        item => item.dataset.image
    );


/* =====================================================
   OPEN PHOTO
===================================================== */

galleryItems.forEach(
    function (item, index) {

        item.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                savedScrollPosition =
                    window.scrollY ||
                    document.documentElement.scrollTop;


                currentImageIndex =
                    index;


                showImage(
                    currentImageIndex
                );


                photoModal.classList.add(
                    "active"
                );


                photoModal.setAttribute(
                    "aria-hidden",
                    "false"
                );


                /* 뒤쪽 화면 고정 */
                document.body.style.position =
                    "fixed";

                document.body.style.top =
                    `-${savedScrollPosition}px`;

                document.body.style.left =
                    "0";

                document.body.style.right =
                    "0";

                document.body.style.width =
                    "100%";

            }
        );

    }
);


/* =====================================================
   SHOW IMAGE
===================================================== */

function showImage(index) {

    /*
       마지막 사진에서 다음으로 넘기면
       첫 사진으로
    */
    if (index >= galleryImages.length) {

        currentImageIndex = 0;

    }


    /*
       첫 사진에서 이전으로 넘기면
       마지막 사진으로
    */
    if (index < 0) {

        currentImageIndex =
            galleryImages.length - 1;

    }


    modalImage.src =
        galleryImages[currentImageIndex];

}


/* =====================================================
   NEXT / PREVIOUS
===================================================== */

function showNextImage() {

    currentImageIndex++;

    showImage(
        currentImageIndex
    );

}


function showPreviousImage() {

    currentImageIndex--;

    showImage(
        currentImageIndex
    );

}


/* =====================================================
   TOUCH START
===================================================== */

photoModal.addEventListener(
    "touchstart",
    function (event) {

        /*
           한 손가락 터치만 처리
        */
        if (
            event.touches.length !== 1
        ) {
            return;
        }


        touchStartX =
            event.touches[0].clientX;

        touchEndX =
            touchStartX;

    },
    {
        passive: true
    }
);


/* =====================================================
   TOUCH MOVE
===================================================== */

photoModal.addEventListener(
    "touchmove",
    function (event) {

        if (
            event.touches.length !== 1
        ) {
            return;
        }


        touchEndX =
            event.touches[0].clientX;

    },
    {
        passive: true
    }
);


/* =====================================================
   TOUCH END
===================================================== */

photoModal.addEventListener(
    "touchend",
    function (event) {

        /*
           X 버튼을 눌렀다면
           swipe 처리하지 않음
        */
        if (
            event.target.closest(
                "#closeModal"
            )
        ) {
            return;
        }


        const swipeDistance =
            touchEndX - touchStartX;


        /*
           너무 조금 움직인 경우
           일반 터치로 판단
        */
        const minimumSwipeDistance =
            50;


        /*
           왼쪽으로 스와이프
           → 다음 사진
        */
        if (
            swipeDistance <
            -minimumSwipeDistance
        ) {

            showNextImage();

            return;

        }


        /*
           오른쪽으로 스와이프
           → 이전 사진
        */
        if (
            swipeDistance >
            minimumSwipeDistance
        ) {

            showPreviousImage();

            return;

        }

    },
    {
        passive: true
    }
);


/* =====================================================
   CLOSE PHOTO
===================================================== */

function closePhotoModal() {

    photoModal.classList.remove(
        "active"
    );


    photoModal.setAttribute(
        "aria-hidden",
        "true"
    );


    modalImage.src = "";


    document.body.style.position =
        "";

    document.body.style.top =
        "";

    document.body.style.left =
        "";

    document.body.style.right =
        "";

    document.body.style.width =
        "";


    window.scrollTo(
        0,
        savedScrollPosition
    );

}


/* =====================================================
   X BUTTON
===================================================== */

closeModal.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        closePhotoModal();

    }
);


/* =====================================================
   PC KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !photoModal.classList.contains(
                "active"
            )
        ) {
            return;
        }


        if (
            event.key === "Escape"
        ) {

            closePhotoModal();

        }


        if (
            event.key === "ArrowRight"
        ) {

            showNextImage();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            showPreviousImage();

        }

    }
);



/* =====================================================
   GUEST PHOTO PREVIEW
===================================================== */

const photoUpload =
    document.getElementById(
        "photoUpload"
    );


const uploadPreview =
    document.getElementById(
        "uploadPreview"
    );


photoUpload.addEventListener(
    "change",
    function (event) {

        uploadPreview.innerHTML =
            "";


        const files =
            Array.from(
                event.target.files
            );


        files.forEach(
            function (file) {

                /*
                   사진이 아닌 파일 제외
                */

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (e) {

                        const img =
                            document.createElement(
                                "img"
                            );


                        img.src =
                            e.target.result;


                        img.alt =
                            "선택한 사진 미리보기";


                        uploadPreview.appendChild(
                            img
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }
);



/* =====================================================
   ACCOUNT COPY
===================================================== */

function copyAccount(account) {

    if (
        navigator.clipboard
        &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(account)
            .then(function () {

                alert(
                    "계좌번호가 복사되었습니다."
                );

            })
            .catch(function () {

                fallbackCopy(account);

            });

    } else {

        fallbackCopy(account);

    }

}



/* =====================================================
   ACCOUNT FALLBACK COPY
===================================================== */

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        alert(
            "계좌번호가 복사되었습니다."
        );

    } catch (error) {

        alert(
            "계좌번호 복사에 실패했습니다."
        );

    }


    document.body.removeChild(
        textarea
    );

}
