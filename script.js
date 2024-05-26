document.addEventListener('DOMContentLoaded', function() {
    let startTime, interval;
    let lapTimes = [];

    // Branş Modu
    const digitalClock = document.getElementById('digital-clock');
    const startButton = document.getElementById('start-button');
    const lapButton = document.getElementById('lap-button');
    const resetButton = document.getElementById('reset-button');
    const lapTimesList = document.getElementById('lap-times');
    const bestLapElement = document.getElementById('best-lap');
    const worstLapElement = document.getElementById('worst-lap');
    const averageLapElement = document.getElementById('average-lap');

    function updateClock() {
        const now = new Date();
        const elapsedTime = new Date(now - startTime);
        const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
        const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
        digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    function startTimer() {
        startTime = new Date();
        interval = setInterval(updateClock, 1000);
        startButton.disabled = true;
        lapButton.disabled = false;
        resetButton.disabled = false;
    }

    function stopTimer() {
        clearInterval(interval);
        startButton.disabled = false;
        lapButton.disabled = true;
        resetButton.disabled = true;
    }

    function resetTimer() {
        stopTimer();
        digitalClock.textContent = '00:00:00';
        lapTimes = [];
        lapTimesList.innerHTML = '';
        bestLapElement.textContent = '00:00:00';
        worstLapElement.textContent = '00:00:00';
        averageLapElement.textContent = '00:00:00';
    }

    function lapTimer() {
        const now = new Date();
        const elapsedTime = new Date(now - startTime);
        lapTimes.push(elapsedTime);
        const li = document.createElement('li');
        li.textContent = elapsedTime.toISOString().substr(11, 8);
        lapTimesList.appendChild(li);
        updateLapSummary();
    }

    function updateLapSummary() {
        if (lapTimes.length === 0) return;
        const bestLap = new Date(Math.min(...lapTimes));
        const worstLap = new Date(Math.max(...lapTimes));
        const averageLap = new Date(lapTimes.reduce((a, b) => a + b.getTime(), 0) / lapTimes.length);
        bestLapElement.textContent = bestLap.toISOString().substr(11, 8);
        worstLapElement.textContent = worstLap.toISOString().substr(11, 8);
        averageLapElement.textContent = averageLap.toISOString().substr(11, 8);
    }

    startButton.addEventListener('click', startTimer);
    lapButton.addEventListener('click', lapTimer);
    resetButton.addEventListener('click', resetTimer);

    // Sınav Modu
    const examTypeSelect = document.getElementById('exam-type');
    const classicClock = document.getElementById('classic-clock');
    const digitalExamClock = document.getElementById('digital-exam-clock');
    const startExamButton = document.getElementById('start-exam-button');
    const extraTimeUsedElement = document.getElementById('extra-time-used');
    let examStartTime, examEndTime, examInterval;

    function initializeClassicClock() {
        const now = new Date();
        const examDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 15, 0);
        if (now > examDate) {
            examDate.setDate(examDate.getDate() + 1);
        }
        classicClock.textContent = '10:15';
        examStartTime = examDate;
    }

    function updateExamClock() {
        const now = new Date();
        const elapsedTime = now - examStartTime;
        const remainingTime = examEndTime - now;
        
        if (remainingTime < 0) {
            clearInterval(examInterval);
            extraTimeUsedElement.textContent = formatTime(-remainingTime);
            digitalExamClock.textContent = formatTime(elapsedTime);
        } else {
            digitalExamClock.textContent = formatTime(elapsedTime);
        }
    }

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function startExamTimer() {
        initializeClassicClock();
        const now = new Date();
        const examDuration = getSelectedExamDuration();
        examEndTime = new Date(examStartTime.getTime() + examDuration);
        if (now >= examStartTime) {
            examStartTime = new Date(now.getTime() - (now - examStartTime) % 86400000 + 86400000 + examStartTime.getTime() % 86400000);
        }
        examInterval = setInterval(updateExamClock, 1000);
    }

    function getSelectedExamDuration() {
        const examType = examTypeSelect.value;
        return (examType === 'tyt' ? 165 : 180) * 60000; // dakika cinsinden milisaniyeye çevirme
    }

    startExamButton.addEventListener('click', startExamTimer);

    // Sayfa yüklendiğinde klasik saat başlatılır
    initializeClassicClock();
});