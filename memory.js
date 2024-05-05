document.addEventListener('DOMContentLoaded', function () {
    const player = document.getElementById('player');
    const memoryObjects = document.querySelectorAll('.memory');
    const memoryInput = document.getElementById('memoryInput');
    const memoryQuestion = document.getElementById('memoryQuestion');
    const userResponse = document.getElementById('userResponse');
    const submitResponse = document.getElementById('submitResponse');
    const mediaUpload = document.getElementById('mediaUpload');

    let playerPosition = { x: 50, y: 50 }; 
    const stepSize = 2; 
    const playerSize = { width: 40, height: 40 }; 
    let currentMemory = null;
    const completedMemories = new Set();


    function updatePlayerPosition() {
        const halfPlayerWidth = playerSize.width / 2;
        const halfPlayerHeight = playerSize.height / 2;

        playerPosition.x = Math.max(
            halfPlayerWidth,
            Math.min(100 - halfPlayerWidth, playerPosition.x)
        );

        playerPosition.y = Math.max(
            halfPlayerHeight,
            Math.min(100 - halfPlayerHeight, playerPosition.y)
        );

        player.style.left = `${playerPosition.x}%`;
        player.style.top = `${playerPosition.y}%`;
    }

    document.addEventListener('keydown', function (event) {
        let moved = false;

        switch (event.key) {
            case 'ArrowUp':
                playerPosition.y -= stepSize;
                moved = true;
                break;
            case 'ArrowDown':
                playerPosition.y += stepSize;
                moved = true;
                break;
            case 'ArrowLeft':
                playerPosition.x -= stepSize;
                moved = true;
                break;
            case 'ArrowRight':
                playerPosition.x += stepSize;
                moved = true;
                break;
            default:
                return;
        }

        if (moved) {
            updatePlayerPosition(); 
            checkMemoryCollisions(); 
        }
    });

    function checkMemoryCollisions() {
        let hasCollision = false;
        currentMemory = null;

        memoryObjects.forEach((memory) => {
            if (completedMemories.has(memory.id)) {
                return; 
            }

            const playerRect = player.getBoundingClientRect();
            const memoryRect = memory.getBoundingClientRect();

            if (
                playerRect.left < memoryRect.right &&
                playerRect.right > memoryRect.left &&
                playerRect.top < memoryRect.bottom &&
                playerRect.bottom > memoryRect.top
            ) {
                memoryInput.style.display = 'block';
                memoryQuestion.textContent = memory.getAttribute('data-prompt'); 
                userResponse.focus();
                currentMemory = memory;
                hasCollision = true;
            }
        });

        if (!hasCollision) {
            memoryInput.style.display = 'none';
        }
    }

    submitResponse.addEventListener('click', function () {
        if (currentMemory && mediaUpload.files.length > 0) {
            const file = mediaUpload.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const imageDataUrl = e.target.result;
                currentMemory.style.backgroundImage = `url(${imageDataUrl})`; 
                currentMemory.style.backgroundSize = 'cover';
                currentMemory.style.backgroundPosition = 'center';

                currentMemory.setAttribute('data-user-response', userResponse.value);

                completedMemories.add(currentMemory.id);
                memoryInput.style.display = 'none';
                userResponse.value = ''; 
                mediaUpload.value = ''; 
            };

            reader.readAsDataURL(file); 
        }
    });

    const tooltip = document.getElementById('tooltip'); 

    memoryObjects.forEach((memory) => {
        memory.addEventListener('mouseover', function (event) {
            const userResponse = memory.getAttribute('data-user-response');
            if (userResponse) {
                tooltip.textContent = userResponse; 
                tooltip.style.display = 'block'; 
                tooltip.style.left = `${event.pageX + 10}px`; 
                tooltip.style.top = `${event.pageY + 10}px`;
            }
        });

        memory.addEventListener('mouseout', function () {
            tooltip.style.display = 'none'; 
        });

        memory.addEventListener('mousemove', function (event) {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
        });
    });

    const greetings = [
        'Thank you for playing!',
        'Great job! Thanks for playing!',
        'You did it! Thanks for participating!',
        'Congratulations! You finished the game!',
        'Well done! Thanks for your time!',
        'Amazing effort! Thank you for playing!',
        'Awesome job! Thanks for your participation!',
        'Fantastic work! Thanks for joining!',
        'Bravo! You completed the game!',
        'Superb! Thank you for your efforts!'
    ];

    const endButton = document.getElementById('endButton');
    const backButton = document.getElementById('backButton');
    const restartButton = document.getElementById('restartButton');

    endButton.addEventListener('click', function () {
        const randomIndex = Math.floor(Math.random() * greetings.length);
        const randomGreeting = greetings[randomIndex];
        alert(randomGreeting);
        window.location.href = 'r_detect.html';
    });

    restartButton.addEventListener('click', function () {
        window.location.reload();
    });

    backButton.addEventListener('click', function () {
        window.history.back();
    });
});
