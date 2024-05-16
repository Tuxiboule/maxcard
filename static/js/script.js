function initializeScript(inputField, validCardsList, validCount, importButton, exportButton, cards, rules) {
    let validCards = [];
    let rejectedCards = [];
    let score = 0;
    let timerInterval;

    function addValidCard(cardName, imageUrl) {
        if (!validCards.includes(cardName)) {
            validCards.push(cardName);
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'expanded');
            cardElement.setAttribute('id', 'card');
            validCardsList.appendChild(cardElement);
            cardElement.innerHTML = `<img src="${imageUrl}" alt="${cardName}">`;
            validCount.textContent = validCards.length;
            validCardsList.style.overflow = 'visible';
            setTimeout(() => {
                cardElement.classList.remove('expanded');
            }, 300);
            setTimeout(() => {
                validCardsList.style.overflow = 'auto';
                validCardsList.scrollTop = validCardsList.scrollHeight;
            }, 600);
        }
    }

    inputField.addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            rules.style.display = "none";
            const inputValue = inputField.value.trim(); 
            const isInCardList = cards.some(card => card.name.toLowerCase() === inputValue.toLowerCase());
            const isInValidCards = validCards.some(card => card.toLowerCase() === inputValue.toLowerCase());
            const display = document.querySelector('#time');
            if (display.style.display === "") {
                display.style.display = "block";
                startTimer(120, display);
            }

            if (isInCardList && !isInValidCards){
                const cardInfo = cards.find(card => card.name.toLowerCase() === inputValue.toLowerCase());
                console.log(cardInfo.url)
                if (cardInfo.url.startsWith('https://images.ygoprodeck.com/')){
                    saveCardImage(cardInfo);
                    }
                const imageUrl = cardInfo.url;
                addValidCard(inputValue, imageUrl);
                scoreCard(cardInfo);
            } else {
                if (!rejectedCards.includes(inputValue)) {
                    inputField.classList.add('shake');
                    setTimeout(() => {
                        inputField.classList.remove('shake');
                    }, 300);
                }
            }
            inputField.value = "";
        }
    });

    // Événement de clic sur le bouton d'importation
    importButton.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'text/plain';

        input.addEventListener('change', function() {
            const file = input.files[0];
            const reader = new FileReader();
            validCardsList.innerHTML = "";
            validCards = [];
            reader.onload = function(event) {
                const importedData = JSON.parse(event.target.result);
                importedData.forEach(imported_card => {
                    const cardInfo = cards.find(card => card.name === imported_card);
                    const imageUrl = cardInfo.url;
                    addValidCard(imported_card, imageUrl);
                });
            };

            reader.readAsText(file);
        });

        input.click();
    });

    // Événement de clic sur le bouton d'exportation
    exportButton.addEventListener('click', function() {
        const exportData = JSON.stringify(validCards);
        const blob = new Blob([exportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'save.txt';
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    });

    function startTimer(duration, display) {
        let timer = duration, minutes, seconds;
        timerInterval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(timerInterval);
                display.textContent = "00:00";
                showScoreModal();
            }
        }, 1000);
    }

    function scoreCard(card) {
        score += card.name.length;
        const scoreDisplay = document.getElementById("score");
        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        } else {
            console.error('Element not found: scoreDisplay');
        }
    }

    function showScoreModal() {
        const scoreModal = document.getElementById('score-modal');
        scoreModal.style.display = 'block';
        
        // Focus sur l'input du modal
        const usernameInput = document.getElementById('username');
        usernameInput.focus();
        
        const submitButton = document.getElementById('submit-score');
        submitButton.addEventListener('click', submitScore);
    }

    function submitScore() {
        const username = document.getElementById('username').value;
        if (username.trim() === "") {
            alert("Please enter a username");
            return;
        }

        const data = {
            username: username,
            score: score
        };

        fetch('/save-score/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            document.getElementById('score-modal').style.display = 'none';
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }


    function saveCardImage(cardInfo) {
        return fetch('/saveCardImage/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ cardName: cardInfo.name, imageUrl: cardInfo.url })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.localUrl;
            } else {
                throw new Error(data.message);
            }
        });
    }

    function getCsrfToken() {
        // Récupérer le token CSRF depuis le meta-tag
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }
}
