/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://fejuvkmoyznpultwrdlb.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_IGBvWC9uJxGez53cR6H9Hg_T4DzqY0J";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   BASIC ELEMENTS
===================================================== */

const bgm =
    document.getElementById("bgm");

const musicButton =
    document.getElementById("musicButton");

const musicIcon =
    document.getElementById("musicIcon");


const invitation =
    document.getElementById("invitation");


let isPlaying = false;







/* =====================================================
   RSVP
===================================================== */

const rsvpModal =
    document.getElementById("rsvpModal");

const rsvpForm =
    document.getElementById("rsvpForm");

const rsvpCloseButton =
    document.getElementById("rsvpCloseButton");

const rsvpLaterButton =
    document.getElementById("rsvpLaterButton");

const guestCount =
    document.getElementById("guestCount");

const guestCountDisplay =
    document.getElementById("guestCountDisplay");

const guestMinus =
    document.getElementById("guestMinus");

const guestPlus =
    document.getElementById("guestPlus");

const guestCountField =
    document.getElementById("guestCountField");


let currentGuestCount = 1;


/* =====================================================
   RSVP OPEN
===================================================== */

function openRsvpModal() {

    rsvpModal.classList.add(
        "active"
    );


    rsvpModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
   RSVP REOPEN BUTTON
===================================================== */

const openRsvpButton =
    document.getElementById(
        "openRsvpButton"
    );


if (openRsvpButton) {

    openRsvpButton.addEventListener(
        "click",
        function () {

            openRsvpModal();

        }
    );

}

/* =====================================================
   RSVP CLOSE
===================================================== */

function closeRsvpModal() {

    rsvpModal.classList.remove(
        "active"
    );


    rsvpModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* X */

rsvpCloseButton.addEventListener(
    "click",
    closeRsvpModal
);


/* 나중에 작성 */

rsvpLaterButton.addEventListener(
    "click",
    closeRsvpModal
);

/* =====================================================
   RSVP AUTO OPEN ON SCROLL
===================================================== */

let rsvpAutoOpened = false;


window.addEventListener(
    "scroll",
    function () {

        /*
           이번 방문에서 이미 한 번
           자동으로 띄웠으면 다시 안 띄움
        */

        if (rsvpAutoOpened) {
            return;
        }


        /*
           이미 참석 여부를 제출한 사람은
           자동 팝업을 다시 띄우지 않음
        */

        const alreadySubmitted =
            localStorage.getItem(
                "weddingRsvpSubmitted"
            );


        if (
            alreadySubmitted === "true"
        ) {
            return;
        }


        /*
           페이지를 250px 이상 스크롤하면
           RSVP 팝업 표시
        */

        if (
            window.scrollY > 250
        ) {

            rsvpAutoOpened = true;

            openRsvpModal();

        }

    }
);



/* =====================================================
   GUEST COUNT
===================================================== */

guestMinus.addEventListener(
    "click",
    function () {

        if (currentGuestCount > 1) {

            currentGuestCount--;

            updateGuestCount();

        }

    }
);


guestPlus.addEventListener(
    "click",
    function () {

        /*
           최대 10명
        */

        if (currentGuestCount < 10) {

            currentGuestCount++;

            updateGuestCount();

        }

    }
);


function updateGuestCount() {

    guestCountDisplay.textContent =
        currentGuestCount;

    guestCount.value =
        currentGuestCount;

}


/* =====================================================
   ATTENDANCE
===================================================== */

const attendanceRadios =
    document.querySelectorAll(
        'input[name="attendance"]'
    );


attendanceRadios.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                if (
                    radio.value === "불참"
                    &&
                    radio.checked
                ) {

                    guestCountField.style.display =
                        "none";

                }

                if (
                    radio.value === "참석"
                    &&
                    radio.checked
                ) {

                    guestCountField.style.display =
                        "block";

                }

            }
        );

    }
);

/* =====================================================
   RSVP SUBMIT → SUPABASE
===================================================== */

rsvpForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const formData =
            new FormData(rsvpForm);


        const attendance =
            formData.get("attendance");


        const submitButton =
            rsvpForm.querySelector(
                ".rsvp-submit"
            );


        /*
           중복 터치 방지
        */

        submitButton.disabled =
            true;

        submitButton.textContent =
            "전달 중...";


        const rsvpData = {

            guest_name:
                formData.get(
                    "guestName"
                ),

            guest_side:
                formData.get(
                    "guestSide"
                ),

            attendance:
                attendance,

            guest_count:
                attendance === "참석"
                    ? Number(
                        formData.get(
                            "guestCount"
                        )
                    )
                    : 0,

            message:
                formData.get(
                    "guestMessage"
                ) || null

        };


        /*
           Supabase에 저장
        */

        const {
            error
        } =
            await supabaseClient

                .from(
                    "wedding_rsvp"
                )

                .insert(
                    rsvpData
                );


        /*
           실패
        */

        if (error) {

    console.error(
        "RSVP 저장 오류:",
        error
    );

    alert(
        "저장 실패\n\n"
        + "message: "
        + error.message
        + "\n\ncode: "
        + error.code
    );

    submitButton.disabled = false;

    submitButton.textContent =
        "참석 여부 전달하기";

    return;
}


        /*
           성공
        */

        alert(
            "참석 여부가 전달되었습니다.\n감사합니다."
        );


        /*
           이 브라우저에서 응답 완료 표시
        */

        localStorage.setItem(
            "weddingRsvpSubmitted",
            "true"
        );


        /*
           폼 초기화
        */

        rsvpForm.reset();


        currentGuestCount =
            1;


        updateGuestCount();


        guestCountField.style.display =
            "block";


        /*
           팝업 닫기
        */

        closeRsvpModal();


        submitButton.disabled =
            false;

        submitButton.textContent =
            "참석 여부 전달하기";

    }
);

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

/* =====================================================
   NAVER WEDDING MAP
===================================================== */

function initWeddingMap() {

    const mapContainer =
        document.getElementById("map");

    if (!mapContainer) {
        return;
    }


    const weddingLat = 37.4821;
    const weddingLng = 127.0352;


    const weddingLocation =
        new naver.maps.LatLng(
            weddingLat,
            weddingLng
        );


    /* 지도 생성 */
    const map =
        new naver.maps.Map(
            "map",
            {
                center:
                    weddingLocation,

                zoom:
                    17,

                zoomControl:
                    false,

                mapDataControl:
                    false,

                scaleControl:
                    false
            }
        );


    /* =================================================
       커스텀 마커
    ================================================= */
 const marker =
    new naver.maps.Marker({

        position:
            weddingLocation,

        map:
            map,

        icon: {

            content: `
                <div class="simple-wedding-marker">

                    <div class="simple-marker-label">
                        ELTOWER
                    </div>

                    <div class="simple-marker-dot"></div>

                </div>
            `,

            anchor:
                new naver.maps.Point(
                    40,
                    44
                )
        }
    });   
    
}


/* =====================================================
   START MAP
===================================================== */

if (
    typeof naver !== "undefined"
    &&
    naver.maps
) {

    initWeddingMap();

}


/* =====================================================
   MAP APP BUTTONS
===================================================== */

const kakaoMapButton =
    document.getElementById("kakaoMapButton");

const naverMapButton =
    document.getElementById("naverMapButton");

const tmapButton =
    document.getElementById("tmapButton");


/*
   엘타워 위치
*/

const eltowerLat = 37.4821;
const eltowerLng = 127.0352;

const eltowerName =
    "양재 엘타워";

const eltowerAddress =
    "서울특별시 서초구 강남대로 213";


/* =====================================================
   KAKAO MAP
===================================================== */

kakaoMapButton.addEventListener(
    "click",
    function () {

        /*
           카카오맵 모바일웹 스킴

           앱이 설치돼 있으면
           카카오맵 실행을 시도함
        */

        const url =
            "https://m.map.kakao.com/scheme/look"
            + "?p="
            + eltowerLat
            + ","
            + eltowerLng;

        window.location.href = url;

    }
);


/* =====================================================
   NAVER MAP
===================================================== */

naverMapButton.addEventListener(
    "click",
    function () {

        const appURL =
            "nmap://search"
            + "?query="
            + encodeURIComponent(
                eltowerName
            )
            + "&appname="
            + encodeURIComponent(
                window.location.hostname
            );


        const webURL =
            "https://map.naver.com/p/search/"
            + encodeURIComponent(
                eltowerName
            );


        window.location.href =
            appURL;


        /*
           앱 실행이 안 되는 경우
           웹 네이버지도로 이동
        */

        setTimeout(
            function () {

                if (
                    !document.hidden
                ) {

                    window.location.href =
                        webURL;

                }

            },
            1200
        );

    }
);


/* =====================================================
   TMAP
===================================================== */

tmapButton.addEventListener(
    "click",
    function () {

        /*
           TMAP 목적지 검색
        */

        const url =
            "tmap://search"
            + "?name="
            + encodeURIComponent(
                eltowerName
            );

        window.location.href = url;

    }
);


/* =====================================================
   ACCOUNT ACCORDION
===================================================== */

const accountToggles =
    document.querySelectorAll(
        ".account-toggle"
    );


accountToggles.forEach(
    function (toggle) {

        toggle.addEventListener(
            "click",
            function () {

                const accountId =
                    toggle.dataset.account;


                const accountList =
                    document.getElementById(
                        accountId
                    );


                const arrow =
                    toggle.querySelector(
                        ".account-arrow"
                    );


                const isOpen =
                    accountList.classList.contains(
                        "open"
                    );


                /*
                   현재 항목 닫기
                */

                if (isOpen) {

                    accountList.classList.remove(
                        "open"
                    );

                    arrow.textContent =
                        "+";

                }


                /*
                   현재 항목 열기
                */

                else {

                    accountList.classList.add(
                        "open"
                    );

                    arrow.textContent =
                        "−";

                }

            }
        );

    }
);