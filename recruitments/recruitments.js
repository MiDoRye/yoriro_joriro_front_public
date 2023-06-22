const proxy = "http://127.0.0.1:8000"
// const proxy = "https://api.bechol.com"
const front_proxy = "http://127.0.0.1:5500"


window.onload = async function () {
    const pageParams = new URLSearchParams(window.location.search)
    currentPage = pageParams.get('page')
    if (currentPage == null) {
        currentPage = 1
    }

    recruitments = await getRecruitments(currentPage)
    console.log(recruitments)

    loadRecruitments(recruitments)
    pagination(recruitments, parseInt(currentPage))
}


async function loadRecruitments(recruitments) {
    const recruitment_list = document.getElementById("recruitment-list")

    recruitments.results.forEach((recruitment) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("onclick", `recruitmentDetail(${recruitment.id})`)

        let imagePath = "/images/place-1.jpg"
        departure = recruitment.departure.split('T')[0]
        arrival = recruitment.arrival.split('T')[0]

        if (recruitment.image) {
            imagePath = recruitment.image;
        } else {
            imagePath = "/images/car-2.jpg"
        }

        template.innerHTML = `
        <div><img src="${imagePath}" alt="여행루트 게시글 이미지" class="img-responsive recruitment-image-thumbnail">
            <div class="desc">
                <span></span>
                <h3>${recruitment.title}</h3>
                <span>${recruitment.place}</span>
                <span>${departure + ' ~ ' + arrival}</span>
                <span>${recruitment.participant.length + '/' + recruitment.participant_max}</span>
                <!--<span class="price">${recruitment.title}</span>-->
                <a class="btn btn-primary btn-outline" href="#">지원하기 <i class="icon-arrow-right22"></i></a>
            </div>
        </div>`
        recruitment_list.appendChild(template)
    })
}


function recruitmentDetail(recruitment_id) {
    console.log(recruitment_id)
    window.location.href = `${front_proxy}/recruitments/recruitments_detail.html?recruitment_id=${recruitment_id}`
}


async function getRecruitments(page) {
    const response = await fetch(`${proxy}/recruitments/?page=${page}`);
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("failed")
    }
}


async function pagination(recruitments, currentPage) {
    const pageButton = document.getElementById("pagination")

    const previousButton = document.createElement("a")
    previousButton.setAttribute("class", "btn btn-primary btn-outline")
    previousButton.innerText = "이전 페이지"

    previousButton.addEventListener("click", function () {
        const prevPage = currentPage - 1
        window.location.href = `recruitments.html?page=${prevPage}`
    });

    if (recruitments.previous == null) {
        previousButton.style.display = "none"
    }

    const nextButton = document.createElement("a")
    nextButton.setAttribute("class", "btn btn-primary btn-outline")
    nextButton.innerText = "다음 페이지"

    nextButton.addEventListener("click", function () {
        const nextPage = currentPage + 1
        window.location.href = `recruitments.html?page=${nextPage}`
    });

    if (recruitments.next == null) {
        nextButton.style.display = "none"
    }

    const currentPageShow = document.createElement("button")
    currentPageShow.setAttribute("id", "current-page")
    currentPageShow.setAttribute("class", "btn")
    currentPageShow.innerText = currentPage
    currentPageShow.disabled = true;

    pageButton.appendChild(previousButton)
    pageButton.appendChild(currentPageShow)
    pageButton.appendChild(nextButton)
}
