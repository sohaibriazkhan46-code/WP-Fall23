let events = [
    {
        name: "Tech Conference",
        date: "2026-02-10",
        description: "Technology event"
    },
    {
        name: "Music Festival",
        date: "2025-12-01",
        description: "Live music show"
    }
];

const eventList = document.getElementById("eventList");
const searchInput = document.getElementById("searchInput");
const warning = document.getElementById("warning");

function displayEvents(list) {
    eventList.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];

    list.forEach((event, index) => {
        const card = document.createElement("div");
        card.className = "event-card";

        if (event.date < today) {
            card.classList.add("past");
        }

        card.innerHTML = `
            <h3>${event.name}</h3>
            <p>Date: ${event.date}</p>
            <p>${event.description}</p>
            <button onclick="deleteEvent(${index})">Delete</button>
        `;

        eventList.appendChild(card);
    });
}

function addEvent() {
    const name = document.getElementById("eventName").value;
    const date = document.getElementById("eventDate").value;
    const description = document.getElementById("eventDescription").value;

    if (name === "" || date === "" || description === "") {
        warning.textContent = "All fields are required!";
        return;
    }

    warning.textContent = "";

    events.push({ name, date, description });
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    displayEvents(events);

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventDescription").value = "";
}

function deleteEvent(index) {
    events.splice(index, 1);
    displayEvents(events);
}

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = events.filter(e =>
        e.name.toLowerCase().includes(value) ||
        e.date.includes(value)
    );

    displayEvents(filtered);
});

events.sort((a, b) => new Date(a.date) - new Date(b.date));
displayEvents(events);
