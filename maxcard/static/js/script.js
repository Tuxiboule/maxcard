function initializeScript(inputField, validCardsList, validCount, importButton, exportButton, cards) {
    let validCards = [];
    let rejectedCards = [];
    let score = 0;

    // Fonction pour ajouter une carte valide à la liste
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

    // Événement déclenché lorsque la touche "Entrée" est pressée dans le champ d'entrée
    inputField.addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            const inputValue = inputField.value.trim(); 
            const isInCardList = cards.some(card => card.name === inputValue);
            display = document.querySelector('#time');
            if (display.style.display==="") {
                display.style.display="block";
                startTimer(120, display);
            }

            if (isInCardList) {
                const cardInfo = cards.find(card => card.name === inputValue);
                const imageUrl = cardInfo.url;
                addValidCard(inputValue, imageUrl);
                scoreCard(cardInfo, score);
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
            validCards = [] ;
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
        var timer = duration, minutes, seconds;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = duration;
            }
        }, 1000);
    }

    function scoreCard(card, score) {
        score += card.name.length;
        console.log(score);
    
        var scoreDisplay = document.getElementById("score");
        console.log(scoreDisplay);

        if (scoreDisplay) {
            var scoreText = scoreDisplay.innerHTML.trim();
            var currentScore = parseInt(scoreText, 10);
    
            if (!isNaN(currentScore)) {
                scoreDisplay.innerHTML = currentScore + score;
            } else {
                console.error('Invalid current score in scoreDisplay:', scoreText);
                scoreDisplay.innerHTML = score;
            }
        } else {
            console.error('Element not found: scoreDisplay');
        }
    }
    
}
