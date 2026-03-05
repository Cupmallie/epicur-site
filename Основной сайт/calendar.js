// Функция для генерации календаря
function generateCalendar(year, month) {
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('current-month');
    
    // Очищаем календарь
    calendarDays.innerHTML = '';
    
    // Устанавливаем текущий месяц и год
    const date = new Date(year, month);
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Получаем первый день месяца и количество дней в месяце
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Корректируем первый день для отображения (Пн - 1, Вс - 0)
    let startDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        
        const dayTasks = document.createElement('div');
        dayTasks.className = 'day-tasks';
        

        
        dayElement.appendChild(dayNumber);
        dayElement.appendChild(dayTasks);
        calendarDays.appendChild(dayElement);
    }
}

// Инициализация календаря при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    
    generateCalendar(currentYear, currentMonth);
    
    // Обработчики для кнопок навигации по месяцам
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentYear, currentMonth);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentYear, currentMonth);
    });
    
    

});