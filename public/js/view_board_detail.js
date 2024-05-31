const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

const API_ENDPOINT = 'http://localhost:8000/board';

window.addEventListener('load', () => {
  fetch(localStorage.token ? 'navbar_logout.html' : 'navbar_login.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;
    })
    .catch(error => {
      console.error('Error fetching navbar:', error);
    });
  fetchPosts(currentPage);
});

function fetchPostDetails() {
  fetch(`${API_ENDPOINT}/${postId}`)
    .then(response => response.json())
    .then(data => {
      const post = data[0];
      document.getElementById('postTitle').innerText = post.title;
      document.getElementById('postDetails').innerText = `${post.name} | ${post.time}\n\n${post.content}`;

      const commentsList = document.getElementById('commentsList');
      const noCommentsMessage = document.getElementById('noCommentsMessage');
      console.log(post.comments);
      if (!post.comments || (post.comments.length === 1 && Object.values(post.comments[0]).every(val => val === null))) {
        noCommentsMessage.style.display = 'block';
      } else {
        post.comments.forEach(comment => {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.innerHTML = `
            <p><strong>${comment.name}</strong> &nbsp; <small class="text-muted">${comment.commentTime}</small></p>
            <p>${comment.content}</p>
          `;
          commentsList.appendChild(listItem);
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

window.addEventListener('load', fetchPostDetails);

function showCommentForm() {
  document.getElementById('commentForm').style.display = 'block';
  document.getElementById('commentButton').style.display = 'none';
}

document.getElementById('commentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const commentContent = document.getElementById('commentContent').value;

  fetch(`${API_ENDPOINT}/${postId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE'
    },
    body: JSON.stringify({
      content: commentContent
    })
  })
    .then(response => response.json())
    .then(data => {
      fetchPostDetails();
      document.getElementById('commentContent').value = '';
      document.getElementById('commentForm').style.display = 'none';
      document.getElementById('commentButton').style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

function goBack() {
  window.history.back();
}