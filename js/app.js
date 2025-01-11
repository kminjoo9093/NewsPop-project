//뉴스팝 메인 로직 (원하는 뉴스 api요청/받아오기, 보여주기)
//스크립트 마지막 수정일 : 2025.01.10 (에러 헨들링)

// ************* NEWSDATA API 사용 *************
const allNewsArea = document.querySelectorAll(
    ".main-newsBox, .sub-newsBox, .news"
  ),
  logos = document.querySelectorAll(".logo"),
  searchInputs = document.querySelectorAll(".search input"),
  currentCategory = document.querySelector(".current-category");

const API_KEY = "pub_639768de8b9947fe2dd3550490250edef22a9";
const baseUrl = `https://newsdata.io/api/1/latest?country=kr&language=ko&apikey=${API_KEY}`;

let newsList = [];
let selectedCategory = false; //서브페이지 description글자수 설정 위한 flag변수

//문서 로드 후 이벤트 리스너 함수들 호출 - 에러가 나도 동작해야하기 때문에 문서로드이벤트 밖으로 뺌
eventListers();

async function getNews(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.totalResults === 0) {
        return []; //검색어 결과 없음
      }
      return data.results;
    } else {
      throw new Error(data.results.message);
    }
  } catch (error) {
    renderError(error.message);
  }
}

async function getLatestNews() {
  const url = new URL(baseUrl);
  newsList = await getNews(url);
  render();
}

//문서 로드 후 카테고리, 키워드 처리
document.addEventListener("DOMContentLoaded", () => {
  const storedCategory = sessionStorage.getItem("category");
  const storedKeyword = sessionStorage.getItem("keyword");
  const storedNewsList = sessionStorage.getItem("newsList");
  if (storedNewsList) {
    selectedCategory = true; //리로드하면 변수,함수 초기화, 리로드 된 후 true
    newsList = JSON.parse(sessionStorage.getItem("newsList"));
    console.log(newsList);
    render();
    sessionStorage.clear();
  } else {
    selectedCategory = false;
    getLatestNews();
  }
  // 현재 카테고리 색상 표시
  if (storedCategory) {
    if (window.innerWidth > 1080) {
      document.querySelectorAll(".pc_menu a").forEach((a) => {
        a.getAttribute("data-menu_en").toLowerCase() === storedCategory
          ? (a.style.color = "crimson")
          : (a.style.color = "#222");
      });
    } else {
      const currentCategory = document.querySelector(".current-category");
      currentCategory.style.display = "block";
      currentCategory.textContent = storedCategory.toUpperCase();
    }
  }
});

//카테고리 별 뉴스
async function getNewsByCategory(e) {
  e.preventDefault();
  sessionStorage.clear();
  const selectedMenu = e.target.getAttribute("data-menu_en").toLowerCase();
  const url = new URL(baseUrl);
  url.searchParams.set("category", selectedMenu);
  newsList = await getNews(url);

  sessionStorage.setItem("category", selectedMenu);
  sessionStorage.setItem("newsList", JSON.stringify(newsList));
  window.location.href = e.target.href;
}

//키워드 가져오기
function getKeyword() {
  let keyword = "";
  searchInputs.forEach((input) => {
    if (input.value.length > 0) {
      keyword = input.value;
    }
  });
  return keyword;
}
//키워드 검색 뉴스
async function getNewsByKeyword(keyword) {
  sessionStorage.clear();
  const url = new URL(baseUrl);
  url.searchParams.set("q", keyword);
  newsList = await getNews(url);

  if (newsList.length === 0) {
    renderError("검색어와 관련된 결과가 없습니다.");
    return;
  }

  sessionStorage.setItem("keyword", keyword);
  sessionStorage.setItem("newsList", JSON.stringify(newsList));
  window.location.href = "subPage.html";
}

// 메인,서브 페이지별 description 형식
function formatDescription(description, index) {
  //description인수는 news.description
  if (description == null) {
    return "[본문에서 내용확인]";
  }
  if (selectedCategory) {
    //서브페이지 300글자
    return description.length > 300
      ? description.substring(0, 300) + "..."
      : description;
  }
  //메인페이지 : 1~4번째 뉴스는 120글자만, 나머지는 300글자
  if (index >= 1 && index <= 4) {
    return description.substring(0, 120) + "...";
  } else {
    return description.length > 300
      ? description.substring(0, 300) + "..."
      : description;
  }
}

// 뉴스 보여주기
function render() {
  moment.locale("ko");
  let result = [];
  result = newsList.map(
    (news, index) =>
      `<div class="news-item" onclick="moveToNews('${news.link}')">
        <div class="news-img">
         <img src="${
           news.image_url == null ? "images/no-image.png" : news.image_url
         }" alt="">
       </div>
       <p class="news-txt">
         <span class="news-title">${news.title}</span>
         <span class="news-description">${formatDescription(
           news.description,
           index
         )}</span>
         <em class="press">[${news.source_name}]  ${moment(news.pubDate)
        .endOf("day")
        .fromNow()}</em>
       </p>
      </div>`
  );
  for (let i = 0; i < allNewsArea.length; i++) {
    allNewsArea[i].innerHTML = result[i];
  }
}

function renderError(errorMessage) {
  const errorHTML = `<div class="error-box">
    <p class="error-message"><i class="fa-solid fa-triangle-exclamation"></i> Error : ${errorMessage}</p>
  </div>`;
  document.querySelector("main").innerHTML = errorHTML;
}

//뉴스 링크로 이동
const moveToNews = (url) => {
  window.location.href = url;
};

//이벤트 리스너
function eventListers() {
  //로고클릭 후 메인페이지 이동
  logos.forEach((logo) => {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = e.target.href;
    });
  });
  //input enter 이벤트 검색
  searchInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const keyword = getKeyword();
        if (keyword.length > 0) {
          getNewsByKeyword(keyword);
        }
      }
    });
  });

  // 반응형에 따른 버튼 이벤트
  if (window.innerWidth > 1080) {
    // 카테고리 클릭
    const menus = document.querySelectorAll(".pc_menu a");
    menus.forEach((menu) => {
      menu.addEventListener("click", (e) => getNewsByCategory(e));
    });
    // 키워드 검색
    const pcSearchBtn = document.querySelector(".pc_search-btn");
    pcSearchBtn.addEventListener("click", () => {
      console.log("검색클릭!!!");
      const keyword = getKeyword();
      console.log(keyword);
      if (keyword.length > 0) {
        getNewsByKeyword(keyword);
      }
    });
  }
  if (window.innerWidth <= 1080) {
    // 카테고리 클릭
    const menus = document.querySelectorAll(".m_menu a");
    menus.forEach((menu) => {
      menu.addEventListener("click", (e) => getNewsByCategory(e));
    });
    // 키워드 검색
    const mobileSearchBtn = document.querySelector(".m_search-btn");
    mobileSearchBtn.addEventListener("click", () => {
      const keyword = getKeyword();
      if (keyword.length > 0) {
        getNewsByKeyword(keyword);
      }
    });
  }
}
