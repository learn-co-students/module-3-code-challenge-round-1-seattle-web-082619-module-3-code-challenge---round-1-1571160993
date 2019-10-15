const imageId = 3678;
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`;
const likeURL = `https://randopic.herokuapp.com/likes/`;
const commentsURL = `https://randopic.herokuapp.com/comments/`;

//target relevant elements
const imageCard = document.getElementById('image_card');
const imageTitle = document.getElementById('image_name');
const imageEle = document.getElementById('image');
const likesSpan = document.getElementById('likes');
const commentsUl = document.getElementById('comments');
const likesButton = document.getElementById('like_button');

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta');
  main();
});

function main() {
  fetchImage();
  handleLikeClick();
  handleFormSubmit();
}

function handleFormSubmit() {
  comment_form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event.target['comment'].value);
    const comment = event.target['comment'];

    writeSingleCommentToDOM(comment);
    //commentsArr.push(comment.value);

    const config = {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        content: comment.value,
        image_id: imageId
      })
    };

    postNewCommentToDB(config);
  });
}

function postNewCommentToDB(config) {
  fetch(commentsURL, config)
  .then(res => console.log(res))
  .catch(err => console.log("ERROR:", err));
}

function postLikesToDB(likesAmount) {
  const config = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        like_count: likesAmount,
        image_id: imageId
      })
  };

  fetch(likeURL, config)
  .then(res => console.log(res))
  .catch(err => console.log("ERROR: ", err));

}

function handleLikeClick() {
  likesButton.addEventListener('click', (event) => {
    let tempVal = Number(likesSpan.textContent) + 1;
    likesSpan.textContent = tempVal;
    //save likes to DB
    postLikesToDB(likesSpan.textContent);
  });
}

function fetchImage() {
  fetch(imageURL)
  .then(res => res.json())
  .then(image => writeImageToDOM(image));
}

function writeImageToDOM(image) {
  imageEle.setAttribute('src', image.url);
  imageTitle.textContent = image.name;
  likesSpan.append(image.like_count);
  writeCommentsToDOM(image);
  imageSRC = image.src;
}

function createComment(comment) {
  const commentLi = document.createElement('li');

  if (comment.content !== undefined){
    commentLi.textContent = comment.content; //create from fetch obj value
  } else {
    commentLi.textContent = comment.value; //create from form value
  }

  return commentLi;
}

function writeSingleCommentToDOM(comment) {
  commentsUl.appendChild(createComment(comment));
}

function writeCommentsToDOM(image) {
  for (const comment of image.comments) {
    writeSingleCommentToDOM(comment);
  }
}