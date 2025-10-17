document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const courseList = document.getElementById("list_of_courses");

  if (!searchInput || !courseList) return;

  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const courseItems = courseList.querySelectorAll(".course-item");

    courseItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(filter) ? "" : "none";
    });
  });
});