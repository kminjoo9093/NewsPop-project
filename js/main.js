// ************* NAVER NEWS API 사용 (GAS함께 사용) *************
// google apps script web app
// 배포 아이디 : AKfycby8x96-AOxSFKFMRYmazmw3m7mG55PQoemFklUFjc3iS7x80UxD7onAVOVbYdzTvVCJ
// 배포 url : https://script.google.com/macros/s/AKfycby8x96-AOxSFKFMRYmazmw3m7mG55PQoemFklUFjc3iS7x80UxD7onAVOVbYdzTvVCJ/exec
// *******************************************
const allNewsArea = document.querySelectorAll(
  ".main-newsBox, .sub-newsBox, .news"
);
console.log(allNewsArea);

let newsList = [];
async function getNews() {
  const url = `https://script.google.com/macros/s/AKfycby8x96-AOxSFKFMRYmazmw3m7mG55PQoemFklUFjc3iS7x80UxD7onAVOVbYdzTvVCJ/exec`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  newsList = data.items;
  render();
  // requestAnimationFrame(render);
  console.log(newsList);
}
getNews();

function render() {
  const resultHTML = newsList.map(
    (news) =>
      `<div class="news-img">
        <img src="${
          news.images.length === 0 ? "images/no-image.png" : news.images[0]
        }" alt="" loading="lazy">
      </div>
      <p class="news-txt">
        <span class="news-title">${news.title}</span>
        <span class="news-description">${
          news.description.length > 80
            ? news.description.substring(0, 80) + "..."
            : news.description
        }</span>
      </p>`
  );

  console.log(resultHTML);
  //뉴스area에 차례로 넣기
  for (let i = 0; i <= allNewsArea.length; i++) {
    allNewsArea[i].innerHTML = resultHTML[i];
  }
}

// 카테고리별 뉴스
const categories = document.querySelectorAll(".pc_menu li a");
categories.forEach((menu) => {
  menu.addEventListener("click", (e) => {
    getNewsByCategory(e);
    console.log(e.target);
  });
});
async function getNewsByCategory(e) {
  let selectedCategory = e.target.textContent;
  const url = new URL(
    `https://script.google.com/macros/s/AKfycbx6a4aURhNdLPIA3JtPfWQ0H-zR4lSndvYO2udbvaBK82NzpLkkaNiAgbGj9khuu2VZ/exec?query="${selectedCategory}"`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.items;
  render();
}
