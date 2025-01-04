// PC 스크롤 시 header 변경
const header = document.querySelector('#pc_header');
const activeHeader = document.querySelector('.active-header');
window.addEventListener('scroll', ()=>{
  let scrollValue = window.scrollY;
  if(scrollValue >= 240){
    header.style.display = 'none';
    activeHeader.style.height = `70px`;
    activeHeader.style.opacity = 1;
  } else {
    header.style.display = 'block';
    activeHeader.style.height = `0`;
    activeHeader.style.opacity = 0;
  }
})

// news hover시 바로가기 버튼 등장
const newsItem = document.querySelectorAll('#news-area_bottom .news');
newsItem.forEach((item)=>{
  item.addEventListener('mouseenter', (e)=>{
    const viewMore = e.target.nextElementSibling;
    viewMore.style.opacity = 1;
    viewMore.style.visibility = 'visible';
    viewMore.style.top = (e.target.offsetTop + e.target.offsetHeight/2)+ 'px';
  })
  item.addEventListener('mouseleave', (e)=>{
    const viewMore = e.target.nextElementSibling;
    viewMore.style.opacity = 0;
    viewMore.style.visibility = 'hidden';
  })
})