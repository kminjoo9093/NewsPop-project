// ************* NEWSDATA API 사용 *************
const allNewsArea = document.querySelectorAll(
    ".main-newsBox, .sub-newsBox, .news"
  ),
  menus = document.querySelectorAll(".pc_menu a"),
  logos = document.querySelectorAll(".logo"),
  searchBtn = document.querySelector(".search-btn"),
  searchInput = document.querySelector(".search input");

const API_KEY = "pub_639768de8b9947fe2dd3550490250edef22a9";
let url = new URL(
  `https://newsdata.io/api/1/latest?country=kr&language=ko&apikey=${API_KEY}`
);

let newsList = [];
let selectedCategory = false; //서브페이지 description글자수 설정 위한 flag변수

async function getLatestNews() {
  url = new URL(
    `https://newsdata.io/api/1/latest?country=kr&language=ko&apikey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.results;
  render();
}

//문서 로드
document.addEventListener("DOMContentLoaded", () => {
  const storedCategory = localStorage.getItem("category");
  const storedKeyword = localStorage.getItem("keyword");
  const storedNewsList = localStorage.getItem("newsList");
  if (storedNewsList) {
    selectedCategory = true; //리로드하면 변수,함수 초기화, 리도드 된 후 true
    newsList = JSON.parse(storedNewsList);
    console.log(newsList);
    render();
  } else {
    selectedCategory = false;
    getLatestNews();
  }
});

logos.forEach((logo) => {
  logo.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = e.target.href;
  });
});

//카테고리 별 뉴스
menus.forEach((menu) => {
  menu.addEventListener("click", (e) => getNewsByCategory(e));
});
async function getNewsByCategory(e) {
  e.preventDefault();
  localStorage.clear();
  const selectedMenu = e.target.getAttribute("data-menu_en").toLowerCase();

  url = new URL(
    `https://newsdata.io/api/1/latest?country=kr&language=ko&category=${selectedMenu}&apikey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();

  localStorage.setItem("category", selectedMenu);
  localStorage.setItem("newsList", JSON.stringify(data.results));
  window.location.href = e.target.href;
}

//키워드 검색 뉴스
searchBtn.addEventListener("click", getNewsByKeyword);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getNewsByKeyword();
  }
});
async function getNewsByKeyword() {
  localStorage.clear();
  const keyword = searchInput.value;
  url = new URL(
    `https://newsdata.io/api/1/latest?country=kr&language=ko&q=${keyword}&apikey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();

  localStorage.setItem("keyword", keyword);
  localStorage.setItem("newsList", JSON.stringify(data.results));
  window.location.href = "subPage.html";
}

// 뉴스 보여주기
function render() {
  moment.locale("ko");
  let result = [];
  if (selectedCategory === false) {
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
         <span class="news-description">${
           news.description == null
             ? "[본문에서 내용확인]"
             : index >= 1 && index <= 4
             ? news.description.substring(0, 120) + "..."
             : news.description.length > 300
             ? news.description.substring(0, 300) + "..."
             : news.description
         }</span>
         <em class="press">[${news.source_name}]  ${moment(news.pubDate)
          .endOf("day")
          .fromNow()}</em>
       </p>
      </div>`
    );
  } else {
    //서브페이지 (description 글자 수)
    result = newsList.map(
      (news) =>
        `<div class="news-item" onclick="moveToNews('${news.link}')">
        <div class="news-img">
         <img src="${
           news.image_url == null ? "images/no-image.png" : news.image_url
         }" alt="">
       </div>
       <p class="news-txt">
         <span class="news-title">${news.title}</span>
         <span class="news-description">${
           news.description == null
             ? "[본문에서 내용확인]"
             : news.description.length >= 300
             ? news.description.substring(0, 300) + "..."
             : news.description
         }</span>
         <em class="press">[${news.source_name}]  ${moment(news.pubDate)
          .endOf("day")
          .fromNow()}</em>
       </p>
      </div>`
    );
  }
  for (let i = 0; i < allNewsArea.length; i++) {
    allNewsArea[i].innerHTML = result[i];
  }
  // // 모든 뉴스 영역에 HTML 삽입
  // allNewsArea.forEach((area, index) => {
  //   // 모든 영역에 동일한 뉴스 내용을 넣을 필요가 없으므로 index 체크 후 삽입
  //   if (index < result.length) {
  //     area.innerHTML = result[index];
  //   }
  // });
}

//뉴스 링크로 이동
const moveToNews = (url) => {
  window.location.href = url;
};
