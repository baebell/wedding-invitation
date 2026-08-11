
/* =====================================================
   ELEMENTS
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



/* =====================================================
   MUSIC STATE
===================================================== */

let isPlaying = false;

let invitationStarted = false;



/* =====================================================
   OPENING SCREEN
===================================================== */

/*
   PC / Android / iPhone 모두
   pointer 이벤트 하나로 처리
*/

introScreen.addEventListener(
    "pointerup",
    startInvitation
);


function startInvitation(event) {

    event.preventDefault();


    /*
       여러 번 눌러도 한 번만 실행
    */

    if (invitationStarted) {
        return;
    }


    invitationStarted = true;



    /* -------------------------------------
       BGM 시작
    ------------------------------------- */

    bgm.play()
        .then(() => {

            isPlaying = true;

            musicIcon.textContent = "♪";

            musicButton.classList.remove(
                "off"
            );

        })
        .catch(() => {

            /*
               브라우저가 음악을 차단해도
               청첩장은 정상적으로 열림
            */

            isPlaying = false;

            musicIcon.textContent = "🔇";

            musicButton.classList.add(
                "off"
            );

        });



    /* -------------------------------------
       Opening 페이드 아웃
    ------------------------------------- */

    introScreen.classList.add(
        "hide"
    );



    /* -------------------------------------
       청첩장 등장
    ------------------------------------- */

    setTimeout(() => {

        invitation.classList.add(
            "show"
        );

    }, 300);



    /*
       페이드가 완전히 끝나면
       opening 자체를 제거

       이렇게 해야 모바일에서
       opening이 터치를 가로채지 않음
    */

    setTimeout(() => {

        introScreen.style.display =
            "none";

    }, 1500);

}



/* =====================================================
   MUSIC ON / OFF
===================================================== */

musicButton.addEventListener(
    "click",
    toggleMusic
);


function toggleMusic(event) {

    event.preventDefault();

    event.stopPropagation();


    if (isPlaying) {

        bgm.pause();

        isPlaying = false;

        musicButton.classList.add(
            "off"
        );

        musicIcon.textContent =
            "🔇";


    } else {

        bgm.play()
            .then(() => {

                isPlaying = true;

                musicButton.classList.remove(
                    "off"
                );

                musicIcon.textContent =
                    "♪";

            })
            .catch(() => {

                alert(
                    "음악을 재생할 수 없습니다."
                );

            });

    }

}



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
        weddingDate - now;


    /*
       결혼식이 지나면 00
    */

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
            % 24
        );


    const minutes =
        Math.floor(
            difference /
            (1000 * 60)
            % 60
        );


    const seconds =
        Math.floor(
            difference /
            1000
            % 60
        );



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
    document.querySelectorAll(".gallery-item");

const photoModal =
    document.getElementById("photoModal");

const modalImage =
    document.getElementById("modalImage");

const closeModal =
    document.getElementById("closeModal");


/* =====================================================
   사진 열기
===================================================== */

galleryItems.forEach((item) => {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        const image = item.dataset.image;

        modalImage.src = image;

        photoModal.classList.add("active");

        document.body.classList.add("modal-open");

    });

});


/* =====================================================
   사진 닫기
===================================================== */

function closePhotoModal() {

    photoModal.classList.remove("active");

    document.body.classList.remove("modal-open");

    modalImage.src = "";

}


/* =====================================================
   X 버튼
===================================================== */

closeModal.addEventListener("click", function (event) {

    event.preventDefault();

    event.stopPropagation();

    closePhotoModal();

});


/* =====================================================
   검은 배경 아무 곳이나 누르면 닫기
===================================================== */

photoModal.addEventListener("click", function (event) {

    /*
       사진 영역에는 pointer-events: none을 적용했기 때문에
       사진을 눌러도 이 이벤트가 photoModal까지 전달됨.
    */

    if (event.target !== closeModal) {

        closePhotoModal();

    }

});


/* =====================================================
   ESC
===================================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closePhotoModal();

    }

});



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
    (event) => {

        uploadPreview.innerHTML =
            "";


        const files =
            Array.from(
                event.target.files
            );


        files.forEach(
            (file) => {

                /*
                   이미지 파일만 처리
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
                    (e) => {

                        const img =
                            document.createElement(
                                "img"
                            );


                        img.src =
                            e.target.result;


                        img.alt =
                            "업로드 미리보기";


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

function copyAccount(
    account
) {

    navigator.clipboard
        .writeText(account)
        .then(() => {

            alert(
                "계좌번호가 복사되었습니다."
            );

        })
        .catch(() => {

            alert(
                "계좌번호 복사에 실패했습니다."
            );

        });

}

