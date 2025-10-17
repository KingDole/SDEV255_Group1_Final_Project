addEventListener("DOMContentLoaded", async function() {
    const response = await fetch("https://sdev255-group1-final-project.onrender.com/api/courses");
    const courses = await response.json();

    let html = "";

    courses.forEach((course, index) => {
        const isOpen = index === 0 ? "open" : ""; // First course expanded by default

        html += `
            <details class="course-card" ${isOpen}>
                <summary>
                    ${course.title}
                    <i class="fa-solid fa-chevron-down arrow-icon"></i>
                </summary>
                <div class="course-info">
                    <p>${course.description}</p>
                    <p><strong>Subject:</strong> ${course.subjectArea}</p>
                    <p><strong>Credits:</strong> ${course.credits} credits</p>
                </div>
            </details>
        `;
    });

    document.querySelector("#list_of_courses").innerHTML = html;
});