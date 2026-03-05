// ====== Управление задачами с привязкой к датам ======

let tasks = [];

// Элементы DOM
const todoInput = document.getElementById('todo-input');
const todoPriority = document.getElementById('todo-priority');
const todoDate = document.getElementById('todo-date');
const addButton = document.getElementById('todo-add');
const selectedDateTasks = document.getElementById('selected-date-tasks');

// Устанавливаем сегодняшнюю дату в поле выбора по умолчанию
const today = new Date().toISOString().split('T')[0];
if (todoDate) todoDate.value = today;

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
    // После загрузки обновляем календарь и список задач для выбранной даты
    updateCalendarWithTasks();
    showTasksForDate(todoDate.value);
}

// Сохранение задач в localStorage
function saveTasks() {
    localStorage.setItem('epicur_tasks', JSON.stringify(tasks));
    updateCalendarWithTasks(); // обновляем маркеры в календаре
}

// Добавление новой задачи
function addTask() {
    const text = todoInput.value.trim();
    if (!text) {
        alert('Введите задачу!');
        return;
    }
    const priority = todoPriority.value;
    const date = todoDate.value;
    if (!date) {
        alert('Выберите дату!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority,
        date: date,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasksForDate(date); // обновляем список для текущей даты

    // Очистить поле ввода
    todoInput.value = '';
}

// Переключение статуса выполнения
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasksForDate(task.date);
    }
}

// Удаление задачи
function deleteTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const taskDate = task.date;
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasksForDate(taskDate);
    } else {
        // Если задача не найдена, обновляем список для текущей даты
        renderTasksForDate(todoDate.value);
    }
}

// Отображение задач для конкретной даты (в боковой панели)
function renderTasksForDate(date) {
    if (!selectedDateTasks) return;
    selectedDateTasks.innerHTML = '';

    const tasksForDate = tasks.filter(t => t.date === date);
    if (tasksForDate.length === 0) {
        selectedDateTasks.innerHTML = '<p class="no-tasks">Нет задач на этот день</p>';
        return;
    }

    tasksForDate.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
        // Добавляем класс приоритета для цвета левой границы
        if (task.priority === 'Важно') taskEl.classList.add('important');
        else if (task.priority === 'Срочно') taskEl.classList.add('urgent');
        else if (task.priority === 'Личное') taskEl.classList.add('personal');

        const checkbox = document.createElement('div');
        checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.addEventListener('click', () => toggleTask(task.id));

        const content = document.createElement('div');
        content.className = 'task-content';

        const title = document.createElement('h4');
        title.textContent = task.text;

        const meta = document.createElement('p');
        meta.innerHTML = `<span class="task-priority priority-${task.priority}">${task.priority}</span>`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        content.appendChild(title);
        content.appendChild(meta);
        taskEl.appendChild(checkbox);
        taskEl.appendChild(content);
        taskEl.appendChild(deleteBtn);

        selectedDateTasks.appendChild(taskEl);
    });
}

// Показать задачи для даты, выбранной в календаре (при клике на день)
function showTasksForDate(date) {
    if (date) {
        renderTasksForDate(date);
        // Также обновляем поле выбора даты
        if (todoDate) todoDate.value = date;
    }
}

// Обновление календаря: добавляем маркеры задач на соответствующие дни
function updateCalendarWithTasks() {
    const days = document.querySelectorAll('.calendar-day:not(.empty)');
    days.forEach(day => {
        const dayTasks = day.querySelector('.day-tasks');
        if (dayTasks) {
            dayTasks.innerHTML = ''; // ОЧИЩАЕМ предыдущее содержимое
        }

        const dayNumber = day.querySelector('.day-number')?.textContent;
        if (!dayNumber) return;

        const monthYear = document.getElementById('current-month').textContent;
        const [monthName, year] = monthYear.split(' ');
        const monthIndex = monthNames.indexOf(monthName);
        if (monthIndex === -1) return;

        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

        const tasksForDay = tasks.filter(t => t.date === dateStr);

        tasksForDay.forEach(task => {
            const taskContainer = document.createElement('span');
            taskContainer.className = 'calendar-task';
            if (task.completed) {
                taskContainer.classList.add('completed');
            }
            const marker = document.createElement('span');
            marker.className = 'task-marker';
            if (task.priority === 'Важно') marker.style.backgroundColor = '#FFD700';
            else if (task.priority === 'Срочно') marker.style.backgroundColor = '#FF6B6B';
            else if (task.priority === 'Личное') marker.style.backgroundColor = '#50C878';
            else marker.style.backgroundColor = '#20B2AA';

            taskContainer.appendChild(marker);

            // Если текст задачи короткий, добавляем его рядом
            if (task.text.length <= 30) {
                const textSpan = document.createElement('span');
                textSpan.className = 'task-text';
                textSpan.textContent = task.text;
                taskContainer.appendChild(textSpan);
            }

            dayTasks?.appendChild(taskContainer);
        });
    });
}

const originalGenerateCalendar = generateCalendar;
generateCalendar = function(year, month) {
    originalGenerateCalendar(year, month);
    updateCalendarWithTasks();
    clearSelectedDay(); 
};

document.addEventListener('click', function(e) {
    const dayCell = e.target.closest('.calendar-day');
    if (dayCell && !dayCell.classList.contains('empty')) {
        // Сначала убираем выделение со всех
        clearSelectedDay();
        // Выделяем текущий день
        dayCell.classList.add('selected');
        
        const dayNumber = dayCell.querySelector('.day-number')?.textContent;
        if (dayNumber) {
            const monthYear = document.getElementById('current-month').textContent;
            const [monthName, year] = monthYear.split(' ');
            const monthIndex = monthNames.indexOf(monthName);
            if (monthIndex !== -1) {
                const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                showTasksForDate(dateStr);
            }
        }
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();

    addButton.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    todoDate.addEventListener('change', function() {
        showTasksForDate(this.value);
    });
});

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
// Убирает выделение со всех дней
function clearSelectedDay() {
    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
}
