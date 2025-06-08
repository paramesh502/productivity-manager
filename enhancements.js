// Priority System
const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const priorityColors = {
    'Low': '#4CAF50',    // Green
    'Medium': '#FFC107', // Yellow
    'High': '#FF9800',   // Orange
    'Urgent': '#F44336'  // Red
};

// Task Templates
const taskTemplates = {
    'Daily Routine': [
        { text: 'Morning Exercise', category: 'health', priority: 'High' },
        { text: 'Read for 30 minutes', category: 'study', priority: 'Medium' },
        { text: 'Review Goals', category: 'personal', priority: 'Low' }
    ],
    'Work Day': [
        { text: 'Check Emails', category: 'work', priority: 'High' },
        { text: 'Team Meeting', category: 'work', priority: 'Urgent' },
        { text: 'Project Work', category: 'work', priority: 'Medium' }
    ]
};

// Achievements System
const achievements = {
    'Task Master': {
        condition: () => tasks.filter(t => t.completed).length >= 100,
        icon: '🏆',
        description: 'Complete 100 tasks',
        unlocked: false
    },
    'Habit Hero': {
        condition: () => habits.some(h => h.streak >= 30),
        icon: '🌟',
        description: 'Maintain a habit for 30 days',
        unlocked: false
    },
    'Time Warrior': {
        condition: () => timeLogs.reduce((sum, log) => sum + log.duration, 0) >= 1000,
        icon: '⏰',
        description: 'Track 1000 minutes of activity',
        unlocked: false
    }
};

// Enhanced Task Management
class EnhancedTaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tags = new Set();
        this.initializeUI();
    }

    initializeUI() {
        // Add priority selector to task form
        const taskForm = document.querySelector('.task-form');
        const prioritySelect = document.createElement('select');
        prioritySelect.id = 'task-priority';
        priorities.forEach(priority => {
            const option = document.createElement('option');
            option.value = priority;
            option.textContent = priority;
            prioritySelect.appendChild(option);
        });
        taskForm.insertBefore(prioritySelect, taskForm.lastElementChild);

        // Add template selector
        const templateSelect = document.createElement('select');
        templateSelect.id = 'task-template';
        templateSelect.innerHTML = '<option value="">Select Template</option>';
        Object.keys(taskTemplates).forEach(template => {
            const option = document.createElement('option');
            option.value = template;
            option.textContent = template;
            templateSelect.appendChild(option);
        });
        taskForm.insertBefore(templateSelect, taskForm.lastElementChild);

        // Add tag input
        const tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.id = 'task-tags';
        tagInput.placeholder = 'Add tags (comma-separated)';
        taskForm.insertBefore(tagInput, taskForm.lastElementChild);

        // Add event listeners
        templateSelect.addEventListener('change', (e) => this.applyTemplate(e.target.value));
    }

    applyTemplate(templateName) {
        if (!templateName) return;
        const template = taskTemplates[templateName];
        template.forEach(task => {
            this.tasks.push({ ...task, completed: false });
        });
        this.saveTasks();
        this.renderTasks();
    }

    addTask(text, category, priority, tags = []) {
        this.tasks.push({
            text,
            category,
            priority,
            tags,
            completed: false,
            createdAt: new Date().toISOString()
        });
        this.saveTasks();
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        // Existing task rendering logic
        const taskList = document.querySelector('.task-list');
        taskList.innerHTML = '';
        this.tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.style.borderLeft = `4px solid ${priorityColors[task.priority]}`;
            taskItem.innerHTML = `
                <div>
                    <h3>${task.text}</h3>
                    <span class="category">${task.category}</span>
                    <div class="tags">
                        ${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="task-actions">
                    <button onclick="enhancedTaskManager.toggleTask(${index})" class="${task.completed ? 'completed' : ''}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="enhancedTaskManager.deleteTask(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }
}

// Progress Dashboard
class ProgressDashboard {
    constructor() {
        this.initializeDashboard();
    }

    initializeDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'progress-dashboard';
        dashboard.innerHTML = `
            <h2>Progress Overview</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>Task Completion</h3>
                    <div id="task-completion">0%</div>
                </div>
                <div class="stat-item">
                    <h3>Habit Consistency</h3>
                    <div id="habit-consistency">0%</div>
                </div>
                <div class="stat-item">
                    <h3>Focus Hours</h3>
                    <div id="focus-hours">0</div>
                </div>
            </div>
        `;
        document.querySelector('#home').appendChild(dashboard);
    }

    updateStats() {
        const taskCompletion = (tasks.filter(t => t.completed).length / tasks.length) * 100 || 0;
        const habitConsistency = (habits.filter(h => h.streak > 0).length / habits.length) * 100 || 0;
        const focusHours = timeLogs.reduce((sum, log) => sum + log.duration, 0) / 60;

        document.getElementById('task-completion').textContent = `${taskCompletion.toFixed(1)}%`;
        document.getElementById('habit-consistency').textContent = `${habitConsistency.toFixed(1)}%`;
        document.getElementById('focus-hours').textContent = `${focusHours.toFixed(1)}h`;
    }
}

// Data Management
class DataManager {
    static exportData() {
        const data = {
            tasks,
            habits,
            goals,
            timeLogs,
            journalEntries: localStorage.getItem('journalEntry'),
            achievements: Object.entries(achievements)
                .filter(([_, achievement]) => achievement.unlocked)
                .map(([name]) => name)
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `productivity-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    static importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                // Restore data
                tasks = data.tasks || [];
                habits = data.habits || [];
                goals = data.goals || [];
                timeLogs = data.timeLogs || [];
                if (data.journalEntries) {
                    localStorage.setItem('journalEntry', data.journalEntries);
                }
                // Restore achievements
                data.achievements?.forEach(name => {
                    if (achievements[name]) {
                        achievements[name].unlocked = true;
                    }
                });
                // Refresh all views
                renderTasks();
                renderHabits();
                renderGoals();
                renderTimeLogs();
                showNotification('Data imported successfully!');
            } catch (error) {
                showNotification('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// Focus Mode
class FocusMode {
    constructor() {
        this.isActive = false;
        this.initializeFocusMode();
    }

    initializeFocusMode() {
        const focusButton = document.createElement('button');
        focusButton.id = 'focus-mode-toggle';
        focusButton.innerHTML = '<i class="fas fa-expand"></i> Focus Mode';
        focusButton.addEventListener('click', () => this.toggle());
        document.querySelector('.navbar').appendChild(focusButton);
    }

    toggle() {
        this.isActive = !this.isActive;
        document.body.classList.toggle('focus-mode');
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            if (this.isActive && section.id !== 'task-manager') {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    }
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedTaskManager = new EnhancedTaskManager();
    window.progressDashboard = new ProgressDashboard();
    window.focusMode = new FocusMode();

    // Add export/import buttons
    const dataControls = document.createElement('div');
    dataControls.className = 'data-controls';
    dataControls.innerHTML = `
        <button onclick="DataManager.exportData()">
            <i class="fas fa-download"></i> Export Data
        </button>
        <input type="file" id="import-data" accept=".json" style="display: none;">
        <button onclick="document.getElementById('import-data').click()">
            <i class="fas fa-upload"></i> Import Data
        </button>
    `;
    document.querySelector('footer').insertBefore(dataControls, document.querySelector('.copyright'));

    document.getElementById('import-data').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            DataManager.importData(e.target.files[0]);
        }
    });

    // Check achievements periodically
    setInterval(() => {
        Object.entries(achievements).forEach(([name, achievement]) => {
            if (achievement.condition() && !achievement.unlocked) {
                achievement.unlocked = true;
                showNotification(`🏆 Achievement Unlocked: ${name}!`);
            }
        });
    }, 60000); // Check every minute
}); 