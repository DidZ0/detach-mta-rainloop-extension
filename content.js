/*
 * PROUDLY DONE WITH VIM
 */
function draw(toolbar, email) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('style.css');
  document.head.appendChild(link);

  const button = document.createElement('button');
  button.innerText = 'Dashboard';
  button.classList.add('btn');
  button.addEventListener('click', function() {
    window.open(
      "https://detach.clebard.cloud/?mail=" + encodeURIComponent(email)
    );
  });
  toolbar.insertAdjacentElement('afterbegin', button);

  const saved = document.createElement('span');
  saved.innerText = 'No data';
  saved.classList.add('btn');
  saved.classList.add('savedinfo');

  const count = document.createElement('span');
  count.innerText = 'No data';
  count.classList.add('btn');
  count.classList.add('countinfo');

  function refreshInfos(){
    fetch('https://api.detach.clebard.cloud/mails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: email 
      })
    })
    .then(response => response.json())
    .then(data => {
	const metrics = data.metrics
  	console.log(data.metrics)
	saved.innerText = "Saved: "+getSavedMoSize(metrics)+"Mo" 
	count.innerText = "Detached: "+metrics.totalAttachments+" - "+metrics.totalAttachments*100 / metrics.totalCount+"%"
    })
    .catch(error => {
      console.error(error);
    });
  }

  refreshInfos();
  toolbar.insertAdjacentElement('afterbegin', count);
  toolbar.insertAdjacentElement('afterbegin', saved);
  setInterval(refreshInfos, 60 * 1000);
}

const getSavedMoSize = function (data) {
  let diff = data.totalInbound - data.totalOutbound;
  diff = diff > 0 ? diff : 0;
  return Math.ceil(diff / 1000000);
};

// Wait for the toolbar element to appear on the page
const intervalId = setInterval(function() {
  const toolbar = document.querySelectorAll('.btn-toolbar')[2];
  const email = toolbar ? toolbar.childNodes[1].textContent : null
  if (email) {
	  
    clearInterval(intervalId);
    draw(toolbar, email);
  }
}, 100);

