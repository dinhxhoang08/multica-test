document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // Hàm thêm công việc
    const addTask = () => {
        const taskText = todoInput.value.trim();
        if (taskText === "") {
            alert("Vui lòng nhập nội dung!");
            return;
        }

        const li = document.createElement('li');
        
        const span = document.createElement('span');
        span.textContent = taskText;
        span.addEventListener('click', () => {
            span.classList.toggle('completed');
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(li);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);

        todoInput.value = "";
        todoInput.focus();
    };

    // Sự kiện click nút Thêm
    addBtn.addEventListener('click', addTask);

    // Sự kiện nhấn phím Enter
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});
