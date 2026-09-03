/* =====================================================
   KAKAO INITIALIZE
===================================================== */

if (
    typeof Kakao !== "undefined"
    &&
    !Kakao.isInitialized()
) {

    Kakao.init(
        "abfc287ebd9ab8843aa5593b53cf52c2"
    );

}

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


let firstBgmStarted = false;


/* =====================================================
   PLAY
===================================================== */

async function playBgm() {

    try {

        await bgm.play();

        musicButton.classList.remove("off");

        musicIcon.textContent = "♪";

    } catch (error) {

        musicButton.classList.add("off");

    }
}


function pauseBgm() {

    bgm.pause();

    musicButton.classList.add("off");

    musicIcon.textContent = "♩";

}


/* =====================================================
   MUSIC BUTTON
===================================================== */

musicButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();
        event.stopPropagation();


        /*
           실제 오디오 상태 기준으로 판단
        */

        if (
            bgm.paused
        ) {

            playBgm();

        } else {

            pauseBgm();

        }

    }
);


/* =====================================================
   FIRST USER INTERACTION
===================================================== */

function startBgmOnFirstInteraction(event) {

    /*
       음악 버튼 터치는 제외
    */

    if (
        event.target.closest(
            "#musicButton"
        )
    ) {
        return;
    }


    if (
        firstBgmStarted
    ) {
        return;
    }


    firstBgmStarted = true;


    /*
       현재 정지 상태일 때만 재생
    */

    if (
        bgm.paused
    ) {

        playBgm();

    }


    document.removeEventListener(
        "touchstart",
        startBgmOnFirstInteraction
    );

    document.removeEventListener(
        "click",
        startBgmOnFirstInteraction
    );

}


/* 모바일 첫 터치 */

document.addEventListener(
    "touchstart",
    startBgmOnFirstInteraction,
    {
        passive: true
    }
);


/* PC 첫 클릭 */

document.addEventListener(
    "click",
    startBgmOnFirstInteraction
);

/* =====================================================
   RSVP
===================================================== */

const rsvpModal =
    document.getElementById(
        "rsvpModal"
    );

const rsvpForm =
    document.getElementById(
        "rsvpForm"
    );

const rsvpCloseButton =
    document.getElementById(
        "rsvpCloseButton"
    );

const rsvpLaterButton =
    document.getElementById(
        "rsvpLaterButton"
    );

const openRsvpButton =
    document.getElementById(
        "openRsvpButton"
    );


/* =====================================================
   RSVP OPEN
===================================================== */

function openRsvpModal() {

    if (!rsvpModal) {
        console.error(
            "rsvpModal을 찾을 수 없습니다."
        );

        return;
    }


    rsvpModal.classList.add(
        "active"
    );


    rsvpModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
   RSVP CLOSE
===================================================== */

function closeRsvpModal() {

    if (!rsvpModal) {
        return;
    }


    rsvpModal.classList.remove(
        "active"
    );


    rsvpModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =====================================================
   RSVP OPEN BUTTON
===================================================== */

if (openRsvpButton) {

    openRsvpButton.addEventListener(
        "click",
        function () {

            openRsvpModal();

        }
    );

}


/* =====================================================
   X BUTTON
===================================================== */

if (rsvpCloseButton) {

    rsvpCloseButton.addEventListener(
        "click",
        closeRsvpModal
    );

}


/* =====================================================
   LATER BUTTON
===================================================== */

if (rsvpLaterButton) {

    rsvpLaterButton.addEventListener(
        "click",
        closeRsvpModal
    );

}
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
            window.scrollY > 350
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
   PHOTO MODAL + SWIPE + COUNTER
===================================================== */

const galleryItems =
    document.querySelectorAll(
        ".gallery-item"
    );

const photoModal =
    document.getElementById(
        "photoModal"
    );

const modalImage =
    document.getElementById(
        "modalImage"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const prevPhotoButton =
    document.getElementById(
        "prevPhotoButton"
    );

const nextPhotoButton =
    document.getElementById(
        "nextPhotoButton"
    );

const photoCounter =
    document.getElementById(
        "photoCounter"
    );


let savedScrollPosition = 0;

let currentImageIndex = 0;

let touchStartX = 0;
let touchEndX = 0;


/* 사진 전체 목록 */

const galleryImages =
    Array.from(
        galleryItems
    ).map(
        function (item) {

            return item.dataset.image;

        }
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


                /*
                   배경 스크롤만 막기
                   body position: fixed는 사용하지 않음
                */
                document.documentElement.classList.add(
                    "photo-modal-open"
                );

                document.body.classList.add(
                    "photo-modal-open"
                );

            }
        );

    }
);


/* =====================================================
   SHOW IMAGE
===================================================== */

function showImage(index) {

    /*
       마지막 사진 다음 → 첫 사진
    */

    if (
        index >=
        galleryImages.length
    ) {

        currentImageIndex =
            0;

    }


    /*
       첫 사진 이전 → 마지막 사진
    */

    if (
        index < 0
    ) {

        currentImageIndex =
            galleryImages.length - 1;

    }


    modalImage.src =
        galleryImages[
            currentImageIndex
        ];


    /*
       사진 번호 업데이트
    */

    photoCounter.textContent =
        `${currentImageIndex + 1} / ${galleryImages.length}`;

}


/* =====================================================
   NEXT PHOTO
===================================================== */

function showNextImage() {

    currentImageIndex++;

    showImage(
        currentImageIndex
    );

}


/* =====================================================
   PREVIOUS PHOTO
===================================================== */

function showPreviousImage() {

    currentImageIndex--;

    showImage(
        currentImageIndex
    );

}


/* =====================================================
   ARROW BUTTON
===================================================== */

nextPhotoButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        showNextImage();

    }
);


prevPhotoButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        showPreviousImage();

    }
);


/* =====================================================
   SWIPE START
===================================================== */

photoModal.addEventListener(
    "touchstart",
    function (event) {

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
   SWIPE MOVE
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
   SWIPE END
===================================================== */

photoModal.addEventListener(
    "touchend",
    function (event) {

        if (
            event.target.closest(
                "#closeModal"
            )
        ) {
            return;
        }


        const swipeDistance =
            touchEndX -
            touchStartX;


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


    modalImage.src =
        "";


    document.documentElement.classList.remove(
    "photo-modal-open"
);

document.body.classList.remove(
    "photo-modal-open"
);

}


/* X */

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
            event.key ===
            "Escape"
        ) {

            closePhotoModal();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            showNextImage();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            showPreviousImage();

        }

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


/* =====================================================
   GALLERY MORE
===================================================== */

const galleryMoreButton =
    document.getElementById(
        "galleryMoreButton"
    );

const hiddenGalleryItems =
    document.querySelectorAll(
        ".gallery-hidden"
    );


if (galleryMoreButton) {

    galleryMoreButton.addEventListener(
        "click",
        function () {

            hiddenGalleryItems.forEach(
                function (item) {

                    item.classList.add(
                        "show"
                    );

                }
            );


            /*
               한 번 펼친 후
               더보기 버튼 숨기기
            */

            galleryMoreButton.style.display =
                "none";

        }
    );

}

/* =====================================================
   BLOCK IMAGE CONTEXT MENU
===================================================== */




/* =====================================================
   BLOCK LONG PRESS / CONTEXT MENU ON IMAGES
===================================================== */

document.addEventListener(
    "contextmenu",
    function (event) {

        if (
            event.target.tagName === "IMG"
        ) {

            event.preventDefault();
            return false;

        }

    }
);


/* 모바일 길게 누르기 대응 */

let longPressTimer = null;


document.addEventListener(
    "touchstart",
    function (event) {

        if (
            event.target.tagName !== "IMG"
        ) {
            return;
        }


        longPressTimer = setTimeout(
            function () {

                /*
                   길게 눌러도
                   브라우저 기본 이미지 메뉴가
                   뜨지 않도록 시도
                */

                event.preventDefault();

            },
            500
        );

    },
    {
        passive: false
    }
);


document.addEventListener(
    "touchend",
    function () {

        clearTimeout(
            longPressTimer
        );

    },
    {
        passive: true
    }
);


document.addEventListener(
    "touchmove",
    function () {

        clearTimeout(
            longPressTimer
        );

    },
    {
        passive: true
    }
);



/* =====================================================
   KAKAO SHARE BUTTON
===================================================== */

const kakaoShareButton =
    document.getElementById(
        "kakaoShareButton"
    );

    if (kakaoShareButton) {

    kakaoShareButton.addEventListener(
        "click",
        function () {

            Kakao.Share.sendDefault({

                objectType:
                    "feed",

                content: {

                    title:
                        "윤종 ♥ 예진, 결혼합니다",

                    description:
                        "2026년 12월 5일 토요일 오후 3시\n양재 엘타워 6층 그레이스홀",

                    imageUrl:
                        "https://yjyj-ing.com/images/kakao-preview-2.jpg",

                    link: {

                        mobileWebUrl:
                            "https://yjyj-ing.com",

                        webUrl:
                            "https://yjyj-ing.com"

                    }

                },

                buttons: [

                    {

                        title:
                            "모바일 청첩장 보기",

                        link: {

                            mobileWebUrl:
                                "https://yjyj-ing.com",

                            webUrl:
                                "https://yjyj-ing.com"

                        }

                    }

                ]

            });

        }
    );

}


/* =====================================================
   BLOCK IMAGE CONTEXT MENU / DRAG
===================================================== */


/*
   이미지 우클릭 / 일부 모바일 길게누르기 메뉴
*/

document.addEventListener(
    "contextmenu",
    function (event) {

        if (
            event.target.closest(
                ".gallery-item,
                 .modal-image-container,
                 .invitation-middle-photo,
                 .opening-image-wrap"
            )
        ) {

            event.preventDefault();

        }

    }
);


/*
   이미지 드래그 방지
*/

document.addEventListener(
    "dragstart",
    function (event) {

        if (
            event.target.tagName === "IMG"
        ) {

            event.preventDefault();

        }

    }
);