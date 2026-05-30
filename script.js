document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // Tải công việc từ localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Lưu công việc vào localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Hàm tạo element cho công việc và hiển thị
    const renderTask = (task) => {
        const li = document.createElement('li');
        
        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) {
            span.classList.add('completed');
        }
        
        span.addEventListener('click', () => {
            span.classList.toggle('completed');
            task.completed = !task.completed;
            saveTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(li);
            tasks = tasks.filter(t => t !== task);
            saveTasks();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    };

    // Hiển thị danh sách ban đầu
    tasks.forEach(renderTask);

    // Hàm thêm công việc mới
    const addTask = () => {
        const taskText = todoInput.value.trim();
        if (taskText === "") {
            alert("Vui lòng nhập nội dung!");
            return;
        }

        const newTask = {
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        renderTask(newTask);
        saveTasks();

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
