// ************* NEWSDATA API 사용 *************
const allNewsArea = document.querySelectorAll(
  ".main-newsBox, .sub-newsBox, .news"
);

const API_KEY = "pub_639768de8b9947fe2dd3550490250edef22a9";
const url = new URL(
  `https://newsdata.io/api/1/latest?country=kr&language=ko&apikey=${API_KEY}`
);

let newsList = [];
async function getNews() {
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.results;
  render();
  console.log(newsList);
}
getNews();

function render() {
  let result = newsList.map(
    (news, index) =>
      `<div class="news-img">
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
            ? news.description.substring(0, 100) + "..."
            : news.description.length > 300
            ? news.description.substring(0, 300) + "..."
            : news.description
        }</span>
      </p>`
  );
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
