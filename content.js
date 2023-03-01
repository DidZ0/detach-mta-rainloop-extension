/*
 * PROUDLY DONE WITH VIM
 */

/**
 * 
 * @param {Element} toolbar 
 * @param {string} email 
 * @param {string} apiURL 
 * @param {string} dashboardURL 
 */
async function draw(toolbar, email, apiURL, dashboardURL) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = chrome.runtime.getURL("style.css");
  document.head.appendChild(link);

  const button = document.createElement("button");
  button.innerText = "Dashboard";
  button.classList.add("btn");
  button.addEventListener("click", function () {
    window.open(`${baseUrlDashboard}/?mail=` + encodeURIComponent(email));
  });
  toolbar.insertAdjacentElement("afterbegin", button);

  const saved = document.createElement("span");
  saved.innerText = "No data";
  saved.classList.add("btn");
  saved.classList.add("savedinfo");

  const count = document.createElement("span");
  count.innerText = "No data";
  count.classList.add("btn");
  count.classList.add("countinfo");

  await refreshInfos(baseUrlAPI, email, saved, count);
  toolbar.insertAdjacentElement("afterbegin", count);
  toolbar.insertAdjacentElement("afterbegin", saved);
  setInterval(refreshInfos, 60 * 1000);
}

/**
 * 
 * @param {string} baseUrl 
 * @param {string} email 
 * @param {HTMLElement} saved 
 * @param {HTMLElement} count 
 */
const refreshInfos = async (baseUrl, email, saved, count) => {
  try {
    let response = await fetch(`${baseUrl}/mails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: email,
      }),
    });
    const data = await response.json();
    const metrics = data.metrics;
    console.log(data.metrics);
    saved.innerText = "Saved: " + getSavedMoSize(metrics) + "Mo";
    count.innerText =
      "Detached: " +
      metrics.totalAttachments +
      " - " +
      Math.ceil((metrics.totalAttachments * 100) / metrics.totalCount) +
      "%";
  } catch (error) {
    console.error(error);
  }
};

/**
 * 
 * @param {{totalInbound: number, totalOutbound: number, totalCount: number, totalAttachments: number}} data 
 * @returns 
 */
const getSavedMoSize = function (data) {
  let diff = data.totalInbound - data.totalOutbound;
  diff = diff > 0 ? diff : 0;
  return Math.floor(diff / 1000000);
};

/**
 * Wait for the toolbar element to appear on the page
 */
const intervalId = setInterval(function () {
  const baseUrlAPI = "https://api.detach.clebard.cloud";
  const baseUrlDashboard = "https://detach.clebard.cloud";

  const toolbar = document.querySelectorAll(".btn-toolbar")[2];
  const email = toolbar ? toolbar.childNodes[1].textContent : null;
  if (email) {
    clearInterval(intervalId);
    draw(toolbar, email, baseUrlAPI, baseUrlDashboard);
  }
}, 100);
