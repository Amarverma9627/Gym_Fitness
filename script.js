const reviewForm = document.getElementById('reviewForm');
const gmailInput = document.getElementById('gmail');
const nameInput = document.getElementById('name');
const ratingInput = document.getElementById('rating');
const messageInput = document.getElementById('message');
const submitBtn = reviewForm.querySelector('.btn');
const avgRatingSp = document.getElementById('avgRating');
const reviewCountSpan = document.getElementById('reviewCount');
const barList = document.querySelector('.bar-list');
const reviewsList = document.getElementById('reviewsList');
const tabs = document.querySelectorAll('.tab-btn');
const popup = document.getElementById('popupSuccess');
const modalBg = document.getElementById('modal-bg');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const openBtn = document.getElementById('openPopupBtn');
const closeBtn = document.getElementById('closePopupBtn');
const popup2 = document.getElementById('popup');
const reviewForm2 = document.getElementById('reviewForm');

const AVATARS = [
  'https://randomuser.me/api/portraits/men/34.jpg',
  'https://randomuser.me/api/portraits/women/45.jpg',
  'https://randomuser.me/api/portraits/men/85.jpg',
  'https://randomuser.me/api/portraits/women/76.jpg',
  'https://randomuser.me/api/portraits/men/27.jpg'
];


function validateGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email);
}


gmailInput.addEventListener('input', function () {
  submitBtn.disabled = !validateGmail(gmailInput.value.trim());
  gmailInput.style.borderBottom = validateGmail(gmailInput.value.trim())
    ? "2px solid #28cf74"
    : "2px solid #fa5252";
});


function getReviews() { return JSON.parse(localStorage.getItem('clientReviews') || '[]'); }
function saveReviews(arr) { localStorage.setItem('clientReviews', JSON.stringify(arr)); }
function getHelpfulMap() { return JSON.parse(localStorage.getItem('helpfulMap') || '{}'); }
function saveHelpfulMap(map) { localStorage.setItem('helpfulMap', JSON.stringify(map)); }


function calculateOverview(reviews) {
  if (!reviews.length) return { avg: 0, counts: [0, 0, 0, 0, 0] };
  let counts = [0, 0, 0, 0, 0], sum = 0;
  reviews.forEach(r => { sum += r.rating; counts[r.rating - 1]++; });
  return { avg: (sum / reviews.length), counts };
}


function renderRatingBars(counts, total) {
  barList.innerHTML = '';
  for (let i = 5; i >= 1; i--) {
    const count = counts[i - 1];
    const percent = total ? Math.round((count / total) * 100) : 0;
    const row = document.createElement('div'); row.className = 'bar-row';
    row.innerHTML = `
      <span class="bar-label">${i}★</span>
      <div class="bar-container"><div class="bar-fill"></div></div>
      <span class="bar-perc">${percent}%</span>
    `;
    barList.appendChild(row);
    setTimeout(() => { row.querySelector('.bar-fill').style.width = percent + '%'; }, 80);
  }
}


let currentSort = "relevant";
function renderReviews() {
  let data = getReviews();
  if (currentSort === "latest") data = [...data].reverse();
  else if (currentSort === "high") data = [...data].sort((a, b) => b.rating - a.rating);

  // Legacy data fix: assign missing id values
  let fixed = false;
  data.forEach((rev) => {
    if (!rev.id) { rev.id = Date.now() + '_' + Math.floor(Math.random() * 1e6); fixed = true; }
  });
  if (fixed) saveReviews(data);

  reviewsList.innerHTML = '';
  data.forEach((rev, idx) => {
    // fields always present
    if (!rev.likes) rev.likes = 0;
    if (!rev.comments) rev.comments = [];
    if (!rev.shares) rev.shares = 0;

    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="card-top">
        <img class="card-avatar" src="${AVATARS[idx%AVATARS.length]}" alt="Avatar"/>
        <div class="card-info">
          <div class="card-name"><b>Name:</b> ${rev.name}</div>
          <div class="card-gmail"><b>Email:</b> ${rev.gmail}</div>
        </div>
        <div class="card-rating">${rev.rating.toFixed(1)} <span><i class=\"fa fa-star\"></i></span></div>
      </div>
      <div class="card-content"><b>Message:</b> ${rev.message.replace(/\n/g, '<br>')}</div>
      <div class="card-actions">
        <button class="helpful-btn" data-id="${rev.id}"><i class="fa fa-thumbs-up"></i> Helpful <span>${rev.likes}</span></button>
        <button class="comment-btn" data-id="${rev.id}"><i class="fa fa-comment"></i> Comment</button>
        <button class="share-btn" data-id="${rev.id}"><i class="fa fa-share"></i> Share</button>
        <button class="delete-btn" data-id="${rev.id}" style="color:#fa5252;float:right;"><i class="fa fa-trash"></i> Delete</button>
      </div>
    `;
    reviewsList.appendChild(card);
  });

 // Helpful button click handler with email validation and one-time like per email+review
  reviewsList.querySelectorAll('.helpful-btn').forEach(btn => btn.onclick = function(){
    const reviewId = this.dataset.id;
    const userGmail = gmailInput.value.trim();
    if (!validateGmail(userGmail)) {
      showModal("Enter a valid Gmail in the form to mark helpful.");
      return;
    }
    let helpfulMap = getHelpfulMap();
    let mapKey = `${userGmail}_${reviewId}`;
    if (helpfulMap[mapKey]) {
      showModal('You already marked this as helpful.');
      return;
    }

    let reviews = getReviews();
    let idx = reviews.findIndex(r => r.id === reviewId);
    if (idx > -1) {
      reviews[idx].likes = (reviews[idx].likes || 0) + 1;
      saveReviews(reviews);
      helpfulMap[mapKey] = true;
      saveHelpfulMap(helpfulMap);
      renderOverview(); renderReviews();
    }
  });


  reviewsList.querySelectorAll('.comment-btn').forEach(btn => btn.onclick = function () {
    showModal('Comment functionality can be integrated here.<br><br>Coming soon!');
  });
  reviewsList.querySelectorAll('.share-btn').forEach(btn => btn.onclick = function () {
    showModal('Share functionality can be integrated here.<br><br>Coming soon!');
  });
  // Delete button click handler
  reviewsList.querySelectorAll('.delete-btn').forEach(btn => btn.onclick = function () {
    const reviewId = this.dataset.id;
    let reviews = getReviews().filter(r => r.id !== reviewId);
    saveReviews(reviews);
    renderOverview();   
    renderReviews();
  });


  tabs.forEach(btn => btn.onclick = function () {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSort = btn.dataset.sort;
    renderReviews();
  });
}

function renderOverview() {
  const reviews = getReviews();
  const { avg, counts } = calculateOverview(reviews);
  avgRatingSp.textContent = avg.toFixed(1);
  reviewCountSpan.textContent = `${reviews.length} review${reviews.length === 1 ? '' : 's'} submitted`;
  renderRatingBars(counts, reviews.length);
}


function showPopup() {
  popup.style.display = 'flex';
  setTimeout(() => { popup.style.opacity = 1; }, 40);
  setTimeout(() => {
    popup.style.opacity = 0;
    setTimeout(() => popup.style.display = 'none', 380);
  }, 1800);
}


function showModal(message) {
  modalBg.style.display = "flex"; modalContent.innerHTML = message;
}
modalClose.onclick = () => modalBg.style.display = "none";



// Animated success popup
function showPopup() {
  popup.style.display = 'flex';
  setTimeout(() => {
    popup.style.opacity = 1;
  }, 40);
  setTimeout(() => {
    popup.style.opacity = 0;
    setTimeout(() => popup.style.display = 'none', 380);
  }, 1800);
}



// Form submit and validation
reviewForm.addEventListener('submit', e => {
  e.preventDefault();
  const gmail = gmailInput.value.trim();
  if (!validateGmail(gmail)) {
    gmailInput.style.borderBottom = "2px solid #fa5252";
    submitBtn.disabled = true;
    return;
  }
  const name = nameInput.value.trim();
  const rating = parseInt(ratingInput.value);
  const message = messageInput.value.trim();


  // Validation: Prevent duplicate gmail+rating
  const already = getReviews().some(r =>
    r.gmail === gmail && r.rating === rating
  );
  if (already) {
    alert("You have already submitted this rating with your Gmail.");
    return;
  }
  if (gmail && name && rating && message) {
    const reviews = getReviews();
    reviews.push({
  gmail,
  name,
  rating,
  message,
  likes: 0,
  comments: [],
  shares: 0,
  id: Date.now() + '_' + Math.floor(Math.random() * 1e6)
});

    saveReviews(reviews);
    renderReviews();
    showPopup();
    reviewForm.reset();
    submitBtn.disabled = true;
    gmailInput.style.borderBottom = "2px solid #28cf74"; // green border on success

  }
});

window.onload = () => {
  renderOverview(); renderReviews();
}

//popup for form

openBtn.onclick = function() {
  popup2.style.display = 'flex';
};

closeBtn.onclick = function() {
  popup2.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target === popup2) {
    popup2.style.display = 'none';
  }
};

// Add this to redirect after form submit
reviewForm2.onsubmit = function(event) {
  event.preventDefault(); // Prevent actual submission
  popup2.style.display = 'none'; // Hide the popup
reviewForm2.reset();

};

