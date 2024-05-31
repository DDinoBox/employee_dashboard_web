const API_ENDPOINT = 'http://localhost:8000';

window.addEventListener('load', () => {
  fetchPosts(currentPage);
});

function fetchPosts(page) {
  fetch(`${API_ENDPOINT}/board?page=${page}&perPage=5`)
    .then(response => response.json())
    .then(data => {
      const postList = document.getElementById('postList');
      postList.innerHTML = '';
      data.data.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'px-2', 'py-4');
        listItem.innerHTML = `
          <div class="container">
            <div class="row">
              <div class="col-md-8 col-12 border-right">
                <h4><a href="view_board_detail.html?id=${post.boardId}">${post.title}</a></h4>
              </div>
              <div class="col-md-1 col-12 border-right d-flex align-items-center justify-content-center">
                <span class="badge rounded-pill" style="font-size: 0.9rem">댓글&nbsp;${post.commentCount}</span>
              </div>
              <div class="col-md-3 col-12 d-flex align-items-center justify-content-center">
                <p class="m-0">${post.name} | ${post.time}</p>
              </div>
            </div>
          </div>
        `;
        postList.appendChild(listItem);
      });
      updatePagination(data.totalPages);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const MAX_PAGES_IN_GROUP = 5;
let currentPage = 1;

function updatePagination(totalPages) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const currentPageGroup = Math.ceil(currentPage / MAX_PAGES_IN_GROUP);
  const startPage = (currentPageGroup - 1) * MAX_PAGES_IN_GROUP + 1;
  const endPage = Math.min(startPage + MAX_PAGES_IN_GROUP - 1, totalPages);

  let li = document.createElement('li');
  li.classList.add('page-item');
  let a = document.createElement('a');
  a.classList.add('page-link');
  a.href = '#';
  a.textContent = '<';
  a.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchPosts(currentPage);
      updatePagination(totalPages);
    }
  });
  li.appendChild(a);
  pagination.appendChild(li);

  if (startPage > 1) {
    li = document.createElement('li');
    li.classList.add('page-item');
    a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#';
    a.textContent = '...';
    a.addEventListener('click', () => {
      currentPage = startPage - 1;
      fetchPosts(currentPage);
      updatePagination(totalPages);
    });
    li.appendChild(a);
    pagination.appendChild(li);
  }

  for (let i = startPage; i <= endPage; i++) {
    li = document.createElement('li');
    li.classList.add('page-item');
    if (i === currentPage) {
      li.classList.add('active');
    }
    a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#';
    a.textContent = i;
    a.addEventListener('click', () => {
      currentPage = i;
      fetchPosts(currentPage);
      updatePagination(totalPages);
    });
    li.appendChild(a);
    pagination.appendChild(li);
  }

  if (endPage < totalPages) {
    li = document.createElement('li');
    li.classList.add('page-item');
    a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#';
    a.textContent = '...';
    a.addEventListener('click', () => {
      currentPage = endPage + 1;
      fetchPosts(currentPage);
      updatePagination(totalPages);
    });
    li.appendChild(a);
    pagination.appendChild(li);
  }

  li = document.createElement('li');
  li.classList.add('page-item');
  a = document.createElement('a');
  a.classList.add('page-link');
  a.href = '#';
  a.textContent = '>';
  a.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchPosts(currentPage);
      updatePagination(totalPages);
    }
  });
  li.appendChild(a);
  pagination.appendChild(li);
}