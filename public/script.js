function filterTasks() {
    const category = document.getElementById("filter").value;
    fetch(`/tasks?category=${category}`)
        .then(response => response.json())
        .then(tasks => {
            const list = document.getElementById("task-list");
            list.innerHTML = "";
            tasks.forEach(task => {
                const item = document.createElement("li");
                item.textContent = `${task.title} - ${task.category}`;
                list.appendChild(item);
            });
        });
}
