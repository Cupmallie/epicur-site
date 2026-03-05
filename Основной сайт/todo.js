// ====== Управление списком задач ======

// Массив задач
let tasks = [];

// Элементы DOM
const todoInput = document.getElementById('todo-input');
const todoPriority = document.getElementById('todo-priority');
const addButton = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');

// Загрузка задач из localStorage
function loadTasks() {
    const stored = localStorage.getItem('epicur_tasks');
    if (stored) {
        try {
            tasks = JSON.parse(stored);
        } catch (e) {
            console.error('Ошибка парсинга задач', e);
            tasks = [];
        }
    }
    renderTasks();
}

// Сохранение задач в localStorage
function saveTasks() {
    localStorage.setItem('epicur_tasks', JSON.stringify(tasks));
}

// Отрисовка списка задач
function renderTasks() {
    todoList.innerHTML = ''; // очищаем список

    tasks.forEach(task => {
        // Создаём элемент <li>
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (task.completed) li.classList.add('completed');

        // Чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        // Текст задачи
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = task.text;

        // Приоритет (цветной ярлык)
        const prioritySpan = document.createElement('span');
        prioritySpan.className = `todo-priority priority-${task.priority}`;
        prioritySpan.textContent = task.priority;

        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Собираем элементы
        li.appendChild(checkbox);
        li.appendChild(prioritySpan);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}

// Добавление новой задачи
function addTask() {
    const text = todoInput.value.trim();
    if (!text) {
        alert('Введите задачу!');
        return;
    }

    const priority = todoPriority.value;

    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Очистить поле ввода
    todoInput.value = '';
}

// Переключение статуса выполнения
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Удаление задачи
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Обработчики событий
addButton.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Стартовая загрузка
loadTasks();