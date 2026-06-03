// 1. Todoリストの基本機能

const taskInput = document.getElementById('taskInput');
const deadline = document.getElementById('deadline'); 
const Button = document.getElementById('Button');
const taskList = document.getElementById('taskList');
const deletebut = document.getElementById('deletebut');

Button.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const deadlineText = deadline.value; 
    if (taskText !== '') {
        const li = document.createElement('li');
        li.style.marginBottom = "10px";

        // タスク内容のテキスト
        const textSpan = document.createElement('span');
        textSpan.textContent = taskText + " ";
        li.appendChild(textSpan);

        // 期限表示用のスパン
        if (deadlineText) {
            const deadlineSpan = document.createElement('span');
            deadlineSpan.className = "task-deadline";
            const deadlineTime = new Date(deadlineText).getTime();
            deadlineSpan.setAttribute('data-deadline', deadlineTime);
            
            const date = new Date(deadlineText);
            const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            deadlineSpan.textContent = ` 【期限: ${formattedDate}】`;
            li.appendChild(deadlineSpan);
        }

        // 削除ボタンの追加
        const deleteBtn = deletebut.cloneNode(true);
        deleteBtn.id = ""; 
        deleteBtn.style.display = "inline";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });
        
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        
        // 入力欄をクリア
        taskInput.value = '';   
        deadline.value = ''; 
        
        checkDeadlines();
    }
});

// 期限を定期的にチェックして警告を出す関数
function checkDeadlines() {
    const now = new Date().getTime();
    const deadlineSpans = document.querySelectorAll('.task-deadline');

    deadlineSpans.forEach(span => {
        const deadlineTime = parseInt(span.getAttribute('data-deadline'));
        const timeLeft = deadlineTime - now; // 期限までの残り時間

        
        if (!span.getAttribute('data-original-text')) {
            span.setAttribute('data-original-text', span.textContent);
        }
        const originalText = span.getAttribute('data-original-text');

        if (timeLeft < 0) {
            // 期限を過ぎている場合
            span.textContent = originalText + " ⚠️期限切れ！";
            span.style.color = "red";
            span.style.fontWeight = "bold";
        } else if (timeLeft <= 60 * 60 * 1000) { 
            // 期限まで1時間
            span.textContent = originalText + " ⏰まもなく期限！";
            span.style.color = "orange";
            span.style.fontWeight = "bold";
        } else {
            // まだ余裕がある場合
            span.textContent = originalText;
            span.style.color = "black";
            span.style.fontWeight = "normal";
        }
    });
}

setInterval(checkDeadlines, 1000);


// 2. 時間と天気の連動
const API_URL = "https://www.jma.go.jp/bosai/forecast/data/forecast/250000.json";

async function updateBackground() {
    // --- 時間の取得と判定 ---
    const now = new Date();
    const hour = now.getHours();
    let timeZone = "";
    let bgImage = "";

    // 時間帯によって画像を割り当て
    if (hour >= 5 && hour < 10) {
        timeZone = "朝";
        bgImage = "otu 1.png";
    } else if (hour >= 10 && hour < 15) {
        timeZone = "昼";
        bgImage = "otu 2.png";
    } else if (hour >= 15 && hour < 18) {
        timeZone = "夕方";
        bgImage = "otu 3.jpg"; 
    } else {
        timeZone = "夜";
        bgImage = "otu 4.png";
    }
    
    // 時間帯表示
    var object1 = document.getElementById('otutime');
    if(object1) object1.innerText = timeZone;

    fetch('https://weather.tsukumijima.net/api/forecast?city=250010')
        .then((response) => response.json())
        .then((data) => {
          const todayForecast = data.forecasts[0];
          var message = todayForecast.telop;
          var object = document.getElementById('otuWeather');
          if(object) object.innerText = message;
        })
        .catch(err => console.error("天気APIの取得に失敗しました:", err));

   
    document.body.style.backgroundImage = `url('${bgImage}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";
}

updateBackground();

setInterval(updateBackground, 900000);