// ===== PC 스크롤 시 header 변경 =====
const header = document.querySelector("#header-inner");
const activeHeader = document.querySelector(".active-header");
handelHeader();

function handelHeader() {
  window.addEventListener("scroll", () => {
    let scrollValue = window.scrollY;
    if (window.innerWidth > 1080 && scrollValue >= 240) {
      header.style.display = "none";
      activeHeader.style.height = `7rem`;
      activeHeader.style.opacity = 1;
    } else {
      header.style.display = "block";
      activeHeader.style.height = `0`;
      activeHeader.style.opacity = 0;
    }
  });
}

// ===== news hover시 바로가기 버튼 등장 =====
const newsItem = document.querySelectorAll("#news-area_bottom .news");
newsItem.forEach((item) => {
  item.addEventListener("mouseenter", (e) => {
    const viewMore = e.target.nextElementSibling;
    if (window.innerWidth < 1200) {
      return;
    }
    viewMore.style.opacity = 1;
    viewMore.style.visibility = "visible";
    viewMore.style.top = e.target.offsetTop + e.target.offsetHeight / 2 + "px";
  });
  item.addEventListener("mouseleave", (e) => {
    const viewMore = e.target.nextElementSibling;
    viewMore.style.opacity = 0;
    viewMore.style.visibility = "hidden";
  });
});

// ===== mobile search button =====
$(".m_search-btn").click(function () {
  if ($(".m_search-input").val().length == 0) {
    $(".m_search-input").addClass("active");
  }
});

// ===== mobile menu button active =====
$(".m_menu-btn").click(function () {
  $(".m_menu-layer").stop().slideToggle();
});

// ===== subpage 더보기 클릭 시 뉴스 추가 =====
// 처음 로드 시 4개만 보이도록
const news = document.querySelectorAll("#category .news");
const newsNumToShow = 4;

news.forEach((el) => {
  el.style.display = "none";
});
let newsListOfSubpage = Array.from(news);
getRestNews();

function getRestNews() {
  newsListOfSubpage.splice(0, newsNumToShow).forEach((news) => {
    news.style.display = "block";
  });
}
// 더보기 클릭 시 4개씩 추가
function viewMoreNews() {
  if (newsListOfSubpage) {
    getRestNews();
    if (newsListOfSubpage.length === 0) {
      document.querySelector(".view-more-news .more-btn").style.display =
        "none";
    }
  }
}
