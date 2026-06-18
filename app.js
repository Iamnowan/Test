// On This Day — fetches historical events for a given month/day from
// Wikipedia's free "On this day" REST API (no API key required).

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Days per month (using a leap year so Feb shows 29).
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");
const form = document.getElementById("date-form");
const todayBtn = document.getElementById("today-btn");
const heading = document.getElementById("results-heading");
const statusEl = document.getElementById("status");
const eventsEl = document.getElementById("events");

// Populate the month dropdown.
MONTHS.forEach((name, i) => {
  const opt = document.createElement("option");
  opt.value = String(i + 1);
  opt.textContent = name;
  monthSelect.appendChild(opt);
});

// Rebuild the day dropdown to match the selected month, preserving the
// chosen day where possible.
function populateDays(keepDay) {
  const monthIndex = Number(monthSelect.value) - 1;
  const maxDay = DAYS_IN_MONTH[monthIndex];
  const previous = keepDay ?? (Number(daySelect.value) || 1);
  daySelect.innerHTML = "";
  for (let d = 1; d <= maxDay; d++) {
    const opt = document.createElement("option");
    opt.value = String(d);
    opt.textContent = String(d);
    daySelect.appendChild(opt);
  }
  daySelect.value = String(Math.min(previous, maxDay));
}

monthSelect.addEventListener("change", () => populateDays());

function setToToday() {
  const now = new Date();
  monthSelect.value = String(now.getMonth() + 1);
  populateDays(now.getDate());
}

async function loadEvents(month, day) {
  heading.textContent = `${MONTHS[month - 1]} ${day}`;
  statusEl.textContent = "Loading events…";
  statusEl.classList.remove("error");
  eventsEl.innerHTML = "";

  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const data = await res.json();
    const events = (data.events || []).slice().sort((a, b) => b.year - a.year);

    if (events.length === 0) {
      statusEl.textContent = "No events found for this day.";
      return;
    }

    statusEl.textContent = `${events.length} events`;
    renderEvents(events);
  } catch (err) {
    statusEl.textContent =
      "Could not load events. Check your connection and try again.";
    statusEl.classList.add("error");
    console.error(err);
  }
}

function renderEvents(events) {
  const fragment = document.createDocumentFragment();

  for (const event of events) {
    const li = document.createElement("li");
    li.className = "event";

    const page = event.pages && event.pages[0];
    const thumb = page && page.thumbnail && page.thumbnail.source;
    if (thumb) {
      const img = document.createElement("img");
      img.className = "thumb";
      img.src = thumb;
      img.alt = "";
      img.loading = "lazy";
      li.appendChild(img);
    }

    const yearEl = document.createElement("div");
    yearEl.className = "year";
    yearEl.textContent = event.year;
    li.appendChild(yearEl);

    const body = document.createElement("div");
    body.className = "body";

    const text = document.createElement("p");
    text.textContent = event.text;
    body.appendChild(text);

    if (page) {
      const links = document.createElement("div");
      links.className = "links";
      const a = document.createElement("a");
      a.href =
        (page.content_urls &&
          page.content_urls.desktop &&
          page.content_urls.desktop.page) ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = `Read more: ${page.normalizedtitle || page.title}`;
      links.appendChild(a);
      body.appendChild(links);
    }

    li.appendChild(body);
    fragment.appendChild(li);
  }

  eventsEl.appendChild(fragment);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loadEvents(Number(monthSelect.value), Number(daySelect.value));
});

todayBtn.addEventListener("click", () => {
  setToToday();
  loadEvents(Number(monthSelect.value), Number(daySelect.value));
});

// Initial load: show today's events.
setToToday();
loadEvents(Number(monthSelect.value), Number(daySelect.value));
