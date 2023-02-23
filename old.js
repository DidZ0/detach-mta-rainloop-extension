function addButton(email) {
  const button = document.createElement('button');
  button.innerText = 'DetachBoard';
  button.classList.add('btn');
  button.addEventListener('click', function() {
    window.open("https://detach-mta-dashboard.vercel.app/?mail="+email);
  });

  const toolbar = document.querySelectorAll('.btn-toolbar')[2];
  //toolbar.insertBefore(button, toolbar.firstChild);
  toolbar.insertAdjacentElement('afterbegin', button);

}

// Wait for the toolbar element to appear on the page
const intervalId = setInterval(function() {
  //const toolbar = document.querySelectorAll('.btn-toolbar')[2];
  const toolbar = document.querySelector('.btn-toolbar:nth-of-type(3)');
  //const email = toolbar.childNodes[1].textContent;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = toolbar.textContent.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : null;

  if (toolbar && email) {
    clearInterval(intervalId);
    addButton(email);
  }
}, 100);

