let tasks = [];
let dailyTasks = [];
let quests = [];
let habits = [];
let skills = [];
let achievements = [];
let timer;
let timerSeconds = 1500; // 25 minutes
let streaks = 0;
let habitStreaks = {};
let completedDailyTasks = new Set();
let completedHabits = new Set();

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  renderDailyTasks();
  renderQuests();
  renderHabits();
  renderSkills();
  renderAchievements();
  renderTracker();
  renderStreak();

  // Reset daily tasks at 12 PM
  setInterval(resetDailyTasks, 60 * 1000); // Check every minute
});

function resetDailyTasks() {
  const now = new Date();
  if (now.getHours() === 12 && now.getMinutes() === 0) {
    const allCompleted = dailyTasks.every(task => task.completed);

    if (allCompleted) {
      streaks++;
    } else {
      streaks = 0; // Reset streak if not all tasks were completed
    }

    dailyTasks.forEach(task => task.completed = false);
    completedDailyTasks.clear();
    renderDailyTasks();
    renderStreak();
  }
}

function resetHabits() {
  completedHabits.clear();
  habits.forEach(habit => habit.streak = 0);
  renderHabits();
}

function scheduleReset() {
  const now = new Date();
  const nextReset = new Date();
  nextReset.setHours(12, 0, 0, 0);
  if (now.getHours() >= 12) {
    nextReset.setDate(nextReset.getDate() + 1);
  }
  const timeUntilReset = nextReset - now;
  setTimeout(() => {
    resetDailyTasks();
    resetHabits();
    scheduleReset();
  }, timeUntilReset);
}

scheduleReset();

function checkDailyStreak() {
  const allCompleted = dailyTasks.every(task => task.completed);
  if (allCompleted) {
    streaks++;
  }
  renderStreak();
}

function addTask() {
  const taskTitle = document.getElementById('task-title').value;
  const taskDate = document.getElementById('task-date').value;
  const taskReward = document.getElementById('task-reward').value;
  const taskPunishment = document.getElementById('task-punishment').value;
  const taskPriority = document.getElementById('task-priority').value;

  if (!taskTitle || !taskDate) {
    alert('Please enter a task title and deadline.');
    return;
  }

  const task = {
    id: Date.now(),
    title: taskTitle,
    date: taskDate,
    reward: taskReward,
    punishment: taskPunishment,
    priority: taskPriority,
    completed: false,
  };

  tasks.push(task);
  renderTasks();
  renderTracker();

  document.getElementById('task-title').value = '';
  document.getElementById('task-date').value = '';
  document.getElementById('task-reward').value = '';
  document.getElementById('task-punishment').value = '';
}

function deleteDailyTask(taskId) {
  dailyTasks = dailyTasks.filter(task => task.id !== taskId);
  if (dailyTasks.length === 0) {
    streaks = 0;
    renderStreak();
  }
  renderDailyTasks(); // Re-render daily tasks after deletion
}

function deleteQuest(quest) {
  quests = quests.filter(q => q !== quest);
}

function deleteTask(task) {
  tasks = tasks.filter(t => t !== task);
}

function deleteHabit(habitName) {
  habits = habits.filter(habit => habit.name !== habitName);
  renderHabits(); // Re-render habits after deletion
}

function addDailyTask() {
  const taskTitle = document.getElementById('task-title').value;

  if (!taskTitle) {
    alert('Please enter a task title.');
    return;
  }

  const task = {
    id: Date.now(),
    title: taskTitle,
    completed: false,
  };

  dailyTasks.push(task);
  renderDailyTasks();

  document.getElementById('task-title').value = '';
}

function addQuest() {
  const taskTitle = document.getElementById('task-title').value;
  const taskDate = document.getElementById('task-date').value;
  const taskReward = document.getElementById('task-reward').value;
  const taskPunishment = document.getElementById('task-punishment').value;
  const taskPriority = document.getElementById('task-priority').value;

  if (!taskTitle || !taskDate) {
    alert('Please enter a quest title and date.');
    return;
  }

  const quest = {
    id: Date.now(),
    title: taskTitle,
    date: taskDate,
    reward: taskReward,
    punishment: taskPunishment,
    priority: taskPriority,
    completed: false,
  };

  quests.push(quest);
  renderQuests();
  renderTracker();

  document.getElementById('task-title').value = '';
  document.getElementById('task-date').value = '';
  document.getElementById('task-reward').value = '';
  document.getElementById('task-punishment').value = '';
}
function addHabit() {
  const habitName = document.getElementById('task-title').value;

  if (!habitName) {
    alert('Please enter a habit name.');
    return;
  }

  if (!habits.some(habit => habit.name === habitName)) {
    habits.push({
      name: habitName,
      createdAt: new Date().toLocaleDateString(),
      streak: 0,
    });
    renderHabits();
  } else {
    alert('This habit already exists.');
  }

  document.getElementById('habit-name').value = '';
}

function addSkill() {
  const skillName = document.getElementById('task-title').value;

  if (!skillName) {
    alert('Please enter a skill name.');
    return;
  }

  if (!skills.some(skill => skill.name === skillName)) {
    skills.push({
      name: skillName,
      progress: 0,
    });
    renderSkills();
  } else {
    alert('This skill already exists.');
  }

  document.getElementById('skill-name').value = '';
}

function completeDailyTask(task) {
  const today = new Date().toISOString().slice(0, 10);

  if (completedDailyTasks.has(task.id + today)) {
    alert('You can only complete this task once today.');
    return;
  }

  task.completed = true;
  completedDailyTasks.add(task.id + today);
  renderDailyTasks();

  const allCompleted = dailyTasks.every(task => task.completed);
  if (allCompleted) {
    streaks++;
  }
  renderStreak();
}

function completeHabit(habit) {
  const today = new Date().toLocaleDateString();

  if (completedHabits.has(habit.name)) {
    alert('You can only complete this habit once today.');
    return;
  }

  if (!habitStreaks.hasOwnProperty(habit.name)) {
    habitStreaks[habit.name] = {
      lastCompleted: today,
      streak: 0,
    };
  }

  const lastCompleted = new Date(habitStreaks[habit.name].lastCompleted);
  const currentDay = new Date(today);

  if ((currentDay - lastCompleted) / (1000 * 60 * 60 * 24) > 1) {
    habitStreaks[habit.name].streak = 0;
  }

  habitStreaks[habit.name].lastCompleted = today;
  habitStreaks[habit.name].streak++;
  habit.streak++;

  if (habit.streak === 21) {
    const confirmFormed = confirm('Congratulations! You formed a habit. Do you want to move it to the Achievements section?');
    if (confirmFormed) {
      addAchievement(habit.name);
      habits = habits.filter(h => h.name !== habit.name);
    }
  }

  completedHabits.add(habit.name);
  renderHabits();
}


function completeQuest(quest) {
  quest.completed = true;
  renderQuests();
  renderTracker();
}

function addAchievement(name) {
  const achievement = {
    name,
  };

  achievements.push(achievement);
  renderAchievements();
}

function deleteSkill(skill) {
  skills = skills.filter(s => s !== skill);
}

function decreaseSkillProgress(skill) {
  skill.progress -= 5;
  if (skill.progress < 0) {
    skill.progress = 0;
  }
  renderSkills();
}

function increaseSkillProgress(skill) {
  skill.progress += 5;
  if (skill.progress >= 100) {
    skill.progress = 100;
    addAchievement(skill.name); // Move to achievements on completion
    deleteSkill(skill);
  }
  renderSkills();
}

function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  tasks.forEach(task => {
    if (!task.completed) { // Only show uncompleted tasks
      const li = document.createElement('li');
      li.textContent = `${task.title} - ${task.date} (${task.priority}) Reward: ${task.reward}, Punishment: ${task.punishment}`;
      
      const completeBtn = document.createElement('button');
      completeBtn.textContent = 'Complete';
      completeBtn.classList.add('complete-btn');
      completeBtn.addEventListener('click', () => {
        task.completed = true;
        renderTasks();
        renderTracker();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => {
        deleteTask(task);
        renderTasks();
        renderTracker();
      });

      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    }
  });
}

function renderQuests() {
  const questList = document.getElementById('quest-list');
  questList.innerHTML = '';

  quests.forEach(quest => {
    if (!quest.completed) { // Only show uncompleted quests
      const li = document.createElement('li');
      li.textContent = `${quest.title} - ${quest.date} (Priority: ${quest.priority}) Reward: ${quest.reward}, Punishment: ${quest.punishment}`;

      const completeBtn = document.createElement('button');
      completeBtn.textContent = 'Complete';
      completeBtn.classList.add('complete-btn');
      completeBtn.addEventListener('click', () => {
        quest.completed = true;
        renderQuests();
        renderTracker();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => {
        deleteQuest(quest);
        renderQuests();
        renderTracker();
      });

      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      questList.appendChild(li);
    }
  });
}

function renderDailyTasks() {
  const dailyTaskList = document.getElementById('daily-task-list');
  dailyTaskList.innerHTML = '';

  dailyTasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;
    if (task.completed) {
      li.style.textDecoration = 'line-through';
    }

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';
    completeBtn.classList.add('complete-btn');
    completeBtn.addEventListener('click', () => {
      completeDailyTask(task);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      deleteDailyTask(task.id);
    });

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    dailyTaskList.appendChild(li);
  });
}

function renderHabits() {
  const habitList = document.getElementById('habit-list');
  habitList.innerHTML = '';

  habits.forEach(habit => {
    const li = document.createElement('li');
    li.textContent = `${habit.name} - Created At: ${habit.createdAt}, Streak: ${habit.streak}`;

    if (completedHabits.has(habit.name)) {
      li.style.textDecoration = 'line-through';
    }

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';
    completeBtn.classList.add('complete-btn');
    completeBtn.addEventListener('click', () => {
      completeHabit(habit);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      deleteHabit(habit.name);
    });

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    habitList.appendChild(li);
  });
}

// Update the skill rendering function
function renderSkills() {
  const skillList = document.getElementById('skill-list');
  skillList.innerHTML = '';

  skills.forEach(skill => {
    const li = document.createElement('li');
    li.textContent = `${skill.name} Progress: ${skill.progress}%`;

    const progressBar = document.createElement('progress');
    progressBar.value = skill.progress;
    progressBar.max = 100;

    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+5%';
    increaseBtn.addEventListener('click', () => {
      increaseSkillProgress(skill);
    });

    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '-5%';
    decreaseBtn.addEventListener('click', () => {
      decreaseSkillProgress(skill);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      deleteSkill(skill);
      renderSkills();
    });

    li.appendChild(progressBar);
    li.appendChild(decreaseBtn);
    li.appendChild(increaseBtn);
    li.appendChild(deleteBtn);
    skillList.appendChild(li);
  });
}

function renderTracker() {
  const taskTracker = document.getElementById('task-tracker');
  taskTracker.innerHTML = '';

  const completedTasks = tasks.filter(task => task.completed);
  const completedQuests = quests.filter(quest => quest.completed);

  taskTracker.innerHTML += '<h3>Completed Tasks:</h3>';
  completedTasks.forEach(task => {
    const div = document.createElement('div');
    div.textContent = `${task.title} - Completed Reward: ${task.reward}, Punishment: ${task.punishment}`;
    taskTracker.appendChild(div);
  });

  taskTracker.innerHTML += '<h3>Completed Quests:</h3>';
  completedQuests.forEach(quest => {
    const div = document.createElement('div');
    div.textContent = `${quest.title} - Completed Reward: ${quest.reward}, Punishment: ${quest.punishment}`;
    taskTracker.appendChild(div);
  });
}

function renderAchievements() {
  const achievementList = document.getElementById('achievement-list');
  achievementList.innerHTML = '';

  achievements.forEach(achievement => {
    const li = document.createElement('li');
    li.textContent = achievement.name;
    achievementList.appendChild(li);
  });
}

function renderStreak() {
  const streakElement = document.getElementById('streak');
  streakElement.textContent = `Daily Streak: ${streaks}`;
}

function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        alert('Time is up!');
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  timerSeconds = 1500;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  document.getElementById('timer-display').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}