// ************* NEWSDATA API 사용 *************
const allNewsArea = document.querySelectorAll(
    ".main-newsBox, .sub-newsBox, .news"
  ),
  menus = document.querySelectorAll(".pc_menu a"),
  logos = document.querySelectorAll(".logo"),
  searchBtn = document.querySelector(".search-btn"),
  searchInput = document.querySelector(".search input");

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
        throw new Error("검색어와 관련된 결과가 없습니다.");
      }
      return data.results;
    } else {
      throw new Error(data.results.message);
    }
  } catch (error) {
    console.log(error.message);
    renderError(error.message);
  }
}

async function getLatestNews() {
  const url = new URL(baseUrl);
  newsList = await getNews(url);
  render();
}

//문서 로드 후 처리
document.addEventListener("DOMContentLoaded", () => {
  const storedCategory = localStorage.getItem("category");
  const storedKeyword = localStorage.getItem("keyword");
  const storedNewsList = localStorage.getItem("newsList");
  if (storedNewsList) {
    selectedCategory = true; //리로드하면 변수,함수 초기화, 리로드 된 후 true
    newsList = JSON.parse(storedNewsList);
    console.log(newsList);
    render();
  } else {
    selectedCategory = false;
    getLatestNews();
  }
});

//카테고리 별 뉴스
async function getNewsByCategory(e) {
  e.preventDefault();
  localStorage.clear();
  const selectedMenu = e.target.getAttribute("data-menu_en").toLowerCase();
  const url = new URL(baseUrl);
  url.searchParams.set("category", selectedMenu);
  newsList = await getNews(url);

  localStorage.setItem("category", selectedMenu);
  localStorage.setItem("newsList", JSON.stringify(newsList));
  window.location.href = e.target.href;
}

//키워드 검색 뉴스
async function getNewsByKeyword() {
  localStorage.clear();
  const keyword = searchInput.value;
  const url = new URL(baseUrl);
  url.searchParams.set("q", keyword);
  newsList = await getNews(url);
  console.log(response);
  console.log(data);

  localStorage.setItem("keyword", keyword);
  localStorage.setItem("newsList", JSON.stringify(newsList));
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
      localStorage.clear();
      window.location.href = e.target.href;
    });
  });

  //카테고리 메뉴 클릭
  menus.forEach((menu) => {
    menu.addEventListener("click", (e) => getNewsByCategory(e));
  });

  //키워드 검색
  searchBtn.addEventListener("click", getNewsByKeyword);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      getNewsByKeyword();
    }
  });
}
