// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const themeToggle = document.querySelector('.theme-toggle');

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });
    });
});

// Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Task Manager
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.querySelector('.task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div>
                <h3>${task.text}</h3>
                <span class="category">${task.category}</span>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask(${index})" class="${task.completed ? 'completed' : ''}">
                    <i class="fas fa-check"></i>
                </button>
                <button onclick="deleteTask(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
    updateTaskStats();
}

function addTask() {
    const text = taskInput.value.trim();
    const category = taskCategory.value;
    if (text) {
        tasks.push({ text, category, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        renderTasks();
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Pomodoro Timer
const timerDisplay = document.querySelector('.timer-display');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const modeBtns = document.querySelectorAll('.mode-btn');

let timeLeft = 25 * 60;
let timerId = null;
let isRunning = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                playAlarm();
                isRunning = false;
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplay();
}

function playAlarm() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play();
    if ('vibrate' in navigator) {
        navigator.vibrate(1000);
    }
}

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timeLeft = parseInt(btn.dataset.time) * 60;
        updateDisplay();
        pauseTimer();
    });
});

startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Habit Tracker
const habitInput = document.getElementById('habit-input');
const addHabitBtn = document.getElementById('add-habit');
const habitList = document.querySelector('.habit-list');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

function renderHabits() {
    habitList.innerHTML = '';
    habits.forEach((habit, index) => {
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        habitItem.innerHTML = `
            <div>
                <h3>${habit.text}</h3>
                <div class="streak">${habit.streak} day streak</div>
            </div>
            <div class="habit-actions">
                <button onclick="completeHabit(${index})" class="${habit.completed ? 'completed' : ''}">
                    <i class="fas fa-check"></i>
                </button>
                <button onclick="deleteHabit(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        habitList.appendChild(habitItem);
    });
    updateHabitStats();
}

function addHabit() {
    const text = habitInput.value.trim();
    if (text) {
        habits.push({ text, streak: 0, completed: false });
        localStorage.setItem('habits', JSON.stringify(habits));
        habitInput.value = '';
        renderHabits();
    }
}

function completeHabit(index) {
    habits[index].completed = !habits[index].completed;
    if (habits[index].completed) {
        habits[index].streak++;
    } else {
        habits[index].streak = Math.max(0, habits[index].streak - 1);
    }
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}

function deleteHabit(index) {
    habits.splice(index, 1);
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}

addHabitBtn.addEventListener('click', addHabit);
habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});

// Journal
const journalEntry = document.getElementById('journal-entry');
const saveJournalBtn = document.getElementById('save-journal');
const clearJournalBtn = document.getElementById('clear-journal');

// Load saved journal entry
journalEntry.value = localStorage.getItem('journalEntry') || '';

function saveJournal() {
    localStorage.setItem('journalEntry', journalEntry.value);
    showNotification('Journal entry saved!');
}

function clearJournal() {
    if (confirm('Are you sure you want to clear your journal entry?')) {
        journalEntry.value = '';
        localStorage.removeItem('journalEntry');
    }
}

saveJournalBtn.addEventListener('click', saveJournal);
clearJournalBtn.addEventListener('click', clearJournal);

// Auto-save journal every 30 seconds
setInterval(saveJournal, 30000);

// Goals Tracker
const goalInput = document.getElementById('goal-input');
const goalProgress = document.getElementById('goal-progress');
const addGoalBtn = document.getElementById('add-goal');
const goalsList = document.querySelector('.goals-list');

let goals = JSON.parse(localStorage.getItem('goals')) || [];

function renderGoals() {
    goalsList.innerHTML = '';
    goals.forEach((goal, index) => {
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';
        goalItem.innerHTML = `
            <h3>${goal.text}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${goal.progress}%"></div>
            </div>
            <div class="goal-actions">
                <input type="range" min="0" max="100" value="${goal.progress}" 
                    onchange="updateGoalProgress(${index}, this.value)">
                <button onclick="deleteGoal(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        goalsList.appendChild(goalItem);
    });
}

function addGoal() {
    const text = goalInput.value.trim();
    const progress = parseInt(goalProgress.value) || 0;
    if (text) {
        goals.push({ text, progress });
        localStorage.setItem('goals', JSON.stringify(goals));
        goalInput.value = '';
        goalProgress.value = '';
        renderGoals();
    }
}

function updateGoalProgress(index, progress) {
    goals[index].progress = parseInt(progress);
    localStorage.setItem('goals', JSON.stringify(goals));
    renderGoals();
}

function deleteGoal(index) {
    goals.splice(index, 1);
    localStorage.setItem('goals', JSON.stringify(goals));
    renderGoals();
}

addGoalBtn.addEventListener('click', addGoal);
goalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addGoal();
});

// Time Tracking
const activityInput = document.getElementById('activity-input');
const startTrackingBtn = document.getElementById('start-tracking');
const stopTrackingBtn = document.getElementById('stop-tracking');
const timeLog = document.querySelector('.time-log');
const exportLogsBtn = document.getElementById('export-logs');

let timeLogs = JSON.parse(localStorage.getItem('timeLogs')) || [];
let currentActivity = null;
let startTime = null;

function startTracking() {
    const activity = activityInput.value.trim();
    if (activity) {
        currentActivity = activity;
        startTime = new Date();
        activityInput.disabled = true;
        startTrackingBtn.disabled = true;
        stopTrackingBtn.disabled = false;
    }
}

function stopTracking() {
    if (currentActivity && startTime) {
        const endTime = new Date();
        const duration = Math.floor((endTime - startTime) / 1000 / 60); // in minutes
        timeLogs.push({
            activity: currentActivity,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration
        });
        localStorage.setItem('timeLogs', JSON.stringify(timeLogs));
        renderTimeLogs();
        resetTracking();
    }
}

function resetTracking() {
    currentActivity = null;
    startTime = null;
    activityInput.value = '';
    activityInput.disabled = false;
    startTrackingBtn.disabled = false;
    stopTrackingBtn.disabled = true;
}

function renderTimeLogs() {
    timeLog.innerHTML = '';
    timeLogs.slice().reverse().forEach((log, index) => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div>
                <h3>${log.activity}</h3>
                <p>Duration: ${log.duration} minutes</p>
                <p>Start: ${new Date(log.startTime).toLocaleString()}</p>
                <p>End: ${new Date(log.endTime).toLocaleString()}</p>
            </div>
            <button onclick="deleteTimeLog(${timeLogs.length - 1 - index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        timeLog.appendChild(logItem);
    });
}

function deleteTimeLog(index) {
    timeLogs.splice(index, 1);
    localStorage.setItem('timeLogs', JSON.stringify(timeLogs));
    renderTimeLogs();
}

function exportLogs() {
    const csv = [
        ['Activity', 'Start Time', 'End Time', 'Duration (minutes)'],
        ...timeLogs.map(log => [
            log.activity,
            log.startTime,
            log.endTime,
            log.duration
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'time-logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

startTrackingBtn.addEventListener('click', startTracking);
stopTrackingBtn.addEventListener('click', stopTracking);
exportLogsBtn.addEventListener('click', exportLogs);

// Reports
function initializeCharts() {
    // Focus Hours Chart
    const focusHoursCtx = document.getElementById('focus-hours-chart').getContext('2d');
    new Chart(focusHoursCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Focus Hours',
                data: [2, 3, 4, 2, 5, 1, 3],
                backgroundColor: '#FFD700'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Tasks Chart
    const tasksCtx = document.getElementById('tasks-chart').getContext('2d');
    new Chart(tasksCtx, {
        type: 'pie',
        data: {
            labels: ['Work', 'Personal', 'Study'],
            datasets: [{
                data: [12, 8, 5],
                backgroundColor: ['#FFD700', '#FFC107', '#FFA000']
            }]
        },
        options: {
            responsive: true
        }
    });

    // Habits Chart
    const habitsCtx = document.getElementById('habits-chart').getContext('2d');
    new Chart(habitsCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Habit Consistency',
                data: [75, 82, 88, 90],
                borderColor: '#FFD700',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Calendar
const calendarGrid = document.querySelector('.calendar-grid');
const currentMonthElement = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    currentMonthElement.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}`;
    calendarGrid.innerHTML = '';

    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Highlight current day
        if (day === currentDate.getDate() && 
            currentMonth === currentDate.getMonth() && 
            currentYear === currentDate.getFullYear()) {
            dayElement.classList.add('current-day');
        }

        // Add click event to show tasks for the day
        dayElement.addEventListener('click', () => {
            showTasksForDay(day);
        });

        calendarGrid.appendChild(dayElement);
    }
}

function showTasksForDay(day) {
    const date = new Date(currentYear, currentMonth, day);
    const tasksForDay = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.toDateString() === date.toDateString();
    });

    // Show tasks in a modal or sidebar
    alert(`Tasks for ${date.toLocaleDateString()}: ${tasksForDay.length}`);
}

prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// Motivation
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote');
const customQuoteInput = document.getElementById('custom-quote-input');
const addCustomQuoteBtn = document.getElementById('add-custom-quote');

let quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" }
];

let customQuotes = JSON.parse(localStorage.getItem('customQuotes')) || [];

function showRandomQuote() {
    const allQuotes = [...quotes, ...customQuotes];
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    quoteText.textContent = randomQuote.text;
    quoteAuthor.textContent = `- ${randomQuote.author}`;
}

function addCustomQuote() {
    const text = customQuoteInput.value.trim();
    if (text) {
        customQuotes.push({ text, author: 'You' });
        localStorage.setItem('customQuotes', JSON.stringify(customQuotes));
        customQuoteInput.value = '';
        showRandomQuote();
    }
}

newQuoteBtn.addEventListener('click', showRandomQuote);
addCustomQuoteBtn.addEventListener('click', addCustomQuote);

// Utility Functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateTaskStats() {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    document.querySelector('.stat-card:nth-child(1) p').textContent = `${pendingTasks} Pending`;
}

function updateHabitStats() {
    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    document.querySelector('.stat-card:nth-child(3) p').textContent = `${totalStreak} Streak`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    renderHabits();
    renderGoals();
    renderTimeLogs();
    renderCalendar();
    showRandomQuote();
    initializeCharts();
}); 