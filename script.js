
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
   PHOTO MODAL
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


/*
   사진을 열기 전
   현재 스크롤 위치 저장
*/

let savedScrollPosition = 0;



/* =====================================================
   OPEN PHOTO
===================================================== */

galleryItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /*
                   현재 보고 있는 위치 기억
                */

                savedScrollPosition =
                    window.scrollY ||
                    document.documentElement.scrollTop;


                /*
                   눌렀던 사진 주소
                */

                const image =
                    item.dataset.image;


                modalImage.src =
                    image;


                /*
                   팝업 표시
                */

                photoModal.classList.add(
                    "active"
                );


                photoModal.setAttribute(
                    "aria-hidden",
                    "false"
                );


                /*
                   팝업 뒤의 청첩장을
                   완전히 고정

                   카카오톡 인앱 브라우저에서
                   특히 중요함
                */

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
   CLOSE PHOTO
===================================================== */

function closePhotoModal() {

    /*
       팝업 숨김
    */

    photoModal.classList.remove(
        "active"
    );


    photoModal.setAttribute(
        "aria-hidden",
        "true"
    );


    modalImage.src = "";


    /*
       body 고정 해제
    */

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


    /*
       원래 보고 있던
       스크롤 위치로 돌아감
    */

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
   MODAL BACKGROUND CLICK
===================================================== */

/*
   사진이나 검은 배경을 누르면
   모두 닫히도록 처리

   사진 컨테이너에
   pointer-events:none이 있기 때문에
   카카오톡에서도 동작이 단순하고 안정적임
*/

photoModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target !== closeModal
        ) {

            closePhotoModal();

        }

    }
);



/* =====================================================
   ESC
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
            &&
            photoModal.classList.contains(
                "active"
            )
        ) {

            closePhotoModal();

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
