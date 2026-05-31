document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');
    const todoList = document.getElementById('todo-list');

    // Cấu hình IndexedDB
    const dbName = 'TodoDB';
    const storeName = 'tasks';
    let db;

    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
        console.error('Database error:', event.target.error);
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadTasks();
    };

    // Hàm load công việc từ IndexedDB
    const loadTasks = () => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            todoList.innerHTML = '';
            getAllRequest.result.forEach(renderTask);
        };
    };

    // Hàm tạo element cho công việc và hiển thị
    const renderTask = (task) => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        
        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) {
            span.classList.add('completed');
        }
        
        span.addEventListener('click', () => {
            task.completed = !task.completed;
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            store.put(task);
            
            transaction.oncomplete = () => {
                span.classList.toggle('completed');
            };
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            store.delete(task.id);
            
            transaction.oncomplete = () => {
                todoList.removeChild(li);
            };
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    };

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

        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const addRequest = store.add(newTask);

        addRequest.onsuccess = (event) => {
            newTask.id = event.target.result;
            renderTask(newTask);
        };

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

    // Sự kiện click nút Xóa tất cả
    clearBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả công việc?')) {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                todoList.innerHTML = '';
            };
        }
    });

});
