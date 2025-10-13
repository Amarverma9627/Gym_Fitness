let menu =document.querySelector('#menu-icon');
let navbar=document.querySelector('.navbar')
function show(){
    let nav=document.getElementById('menu');
    nav.setAttribute('class','hide');

    let cros=document.getElementById('cancel');
    cros.setAttribute('class','show');

    let tog=document.getElementById('opt')
    let res= tog.getAttribute('class')
    if(res=='hide'){
        tog.setAttribute('class','show')
    }
   
}

function hide(){
    let cross=document.getElementById('cancel')
    cross.setAttribute('class','hide');

    let nav=document.getElementById('menu');
    nav.setAttribute('class','show');

    let tog=document.getElementById('opt')
    let res= tog.getAttribute('class')
    if(res=='show'){
        tog.setAttribute('class','hide')
    }
    
}


window.onscroll=()=>{
    //when will scrollbar down then navbar will hide
    let tog=document.getElementById('opt')
    tog.setAttribute('class','hide');
   
   //and then menu-icon will shown in front
    let nav=document.getElementById('menu');
    nav.setAttribute('class','show');

    //and cross icon will hide but menu icon are shown in front
    let cross=document.getElementById('cancel')
    cross.setAttribute('class','hide');
    
}
//typing text code
var typed = new Typed('.multiple-text', {
    strings: ['Bodybulding', 'Physical Fitness','Weight Gain','Strength Training','Fat Lose','WeightLifting','Running'],
    typeSpeed: 60,
    backSpeed:60,
    loop:Infinity,
});


// review-code

  const reviewForm = document.getElementById('reviewForm');
  const reviewsDiv = document.getElementById('reviews');
  const avgRatingSp = document.getElementById('avgRating');
  const reviewCountSpan = document.getElementById('reviewCount');
  const ratingBarsContainer = document.querySelector('.rating-bars');

  function getReviews() {
    return JSON.parse(localStorage.getItem('clientReviews') || '[]');
  }

  function saveReviews(reviews) {
    localStorage.setItem('clientReviews', JSON.stringify(reviews));
  }

  // Calculate average rating and distribution counts
  function calculateOverview(reviews) {
    if (reviews.length === 0) return { avg: 0, counts: [0, 0, 0, 0, 0] };
    const counts = [0, 0, 0, 0, 0];
    let sum = 0;
    reviews.forEach(r => {
      sum += r.rating;
      counts[r.rating - 1]++;
    });
    return { avg: (sum / reviews.length), counts };
  }

  // Animate bar fill width (from 0 to target%)
  function animateBarFill(barFill, percent) {
    barFill.style.width = '0%';
    setTimeout(() => {
      barFill.style.width = percent + '%';
    }, 50);
  }

  // Render overview rating bars
  function renderRatingBars(counts, total) {
    ratingBarsContainer.innerHTML = '';
    for (let i = 5; i >= 1; i--) {
      const count = counts[i - 1];
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;

      const barRow = document.createElement('div');
      barRow.className = 'bar-row';
      barRow.setAttribute('aria-label', `${i} star rating count: ${count} (${percent} percent)`);

      const label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = `${i} ★`;

      const barContainer = document.createElement('div');
      barContainer.className = 'bar-container';

      const barFill = document.createElement('div');
      barFill.className = 'bar-fill';

      barContainer.appendChild(barFill);

      const perc = document.createElement('span');
      perc.className = 'bar-percentage';
      perc.textContent = `${percent}%`;

      barRow.appendChild(label);
      barRow.appendChild(barContainer);
      barRow.appendChild(perc);

      ratingBarsContainer.appendChild(barRow);
      animateBarFill(barFill, percent);
    }
  }

  // Render all review cards
  function renderReviews() {
    const reviews = getReviews();
    reviewsDiv.innerHTML = '';
    reviews.forEach((rev, idx) => {
      const div = document.createElement('div');
      div.className = 'review-card';
      div.style.animationDelay = `${idx * 0.07}s`;
      div.innerHTML = `
        <div class="card-header">
          <img class="avatar" src="https://i.pravatar.cc/100?u=${rev.name}" alt="Avatar of ${rev.name}" />
          <span class="card-name">${rev.name}</span>
          <div class="card-rating" aria-label="Rating: ${rev.rating} out of 5 stars">
            ${[1,2,3,4,5].map(i => `<i class="fa fa-star${i <= rev.rating ? '' : ' empty'}"></i>`).join('')}
          </div>
        </div>
        <div class="card-content">${rev.message.replace(/\n/g, '<br>')}</div>
        <button class="delete-btn" aria-label="Delete review by ${rev.name}" onclick="deleteReview(${idx})"><i class="fa fa-trash"></i></button>
      `;
      reviewsDiv.appendChild(div);
    });
    const {avg, counts} = calculateOverview(reviews);
    avgRatingSp.textContent = avg.toFixed(1);
    reviewCountSpan.textContent = `${reviews.length} review${reviews.length === 1 ? '' : 's'} submitted`;
    renderRatingBars(counts, reviews.length);
  }

  function deleteReview(idx) {
    const reviews = getReviews();
    reviews.splice(idx, 1);
    saveReviews(reviews);
    renderReviews();
  }

  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = reviewForm.name.value.trim();
    const rating = parseInt(reviewForm.rating.value);
    const message = reviewForm.message.value.trim();
    if (name && rating && message) {
      const reviews = getReviews();
      reviews.push({ name, rating, message });
      saveReviews(reviews);
      renderReviews();
      reviewForm.reset();
      reviewForm.rating.selectedIndex = 0; // reset select
    }
  });

  window.onload = renderReviews;

//   overview
// Example rating data, counts of 1 to 5 stars
  let ratingData = [3, 7, 12, 26, 52]; // [1-star, 2-star,...5-star]
  
  function calculateAverage(ratings) {
    let totalCount = ratings.reduce((a,b) => a + b, 0);
    if(totalCount === 0) return 0;
    let weightedSum = ratings.reduce((sum, count, i) => sum + count * (i+1), 0);
    return weightedSum / totalCount;
  }

  function renderRatingOverview(ratings) {
    const container = document.querySelector(".rating-bars");
    container.innerHTML = "";
    const total = ratings.reduce((a,b) => a+b, 0);
    const avg = calculateAverage(ratings);

    document.getElementById("avgRating").textContent = avg.toFixed(1);
    document.getElementById("reviewCount").textContent = total + (total === 1 ? " review submitted" : " reviews submitted");

    for(let i=5; i>=1; i--) {
      const count = ratings[i-1];
      const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
      
      const barRow = document.createElement("div");
      barRow.className = "bar-row";
      barRow.setAttribute("aria-label", `${i} star rating count: ${count} (${percentage} percent)`);
      
      const label = document.createElement("span");
      label.className = "bar-label";
      label.textContent = i + "★";

      const barContainer = document.createElement("div");
      barContainer.className = "bar-container";

      const barFill = document.createElement("div");
      barFill.className = "bar-fill";

      barContainer.appendChild(barFill);

      const percentageText = document.createElement("span");
      percentageText.className = "bar-percentage";
      percentageText.textContent = percentage + "%";

      barRow.append(label, barContainer, percentageText);
      container.appendChild(barRow);

      // Animate fill width
      setTimeout(() => {
        barFill.style.width = percentage + "%";
      }, 100);
    }
  }

  // Initialize display
  renderRatingOverview(ratingData);

  // Optional: Simulate dynamic updates after 3 seconds - you can replace this with real data updates
  /*
  setTimeout(() => {
    ratingData = [5, 10, 15, 30, 70];
    renderRatingOverview(ratingData);
  }, 3000);
  */
