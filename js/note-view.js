const notesListMode = document.querySelector("[data-view='list']");
const notesList = document.querySelector(".notes-list");

notesListMode.addEventListener("click", (e) => {
  e.preventDefault();
  notesList.dataset.view = notesList.dataset.view === "grid" ? "list" : "grid";
  notesListMode.dataset.view = notesList.dataset.view;
  notesListMode.innerText = notesList.dataset.view === "grid" ? "list" : "grid";
});
