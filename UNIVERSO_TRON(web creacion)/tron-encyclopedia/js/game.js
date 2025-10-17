/* 
15 preguntas sobre las películas de TRON (desde la original hasta TRON: Ares)
Control de tiempo con límite de 5 minutos
Cálculo de puntuación sobre 100 puntos
Interfaz visual inspirada en el universo TRON
Barra de progreso para ver el avance en el cuestionario
Sistema de navegación entre preguntas
Pantalla de resultados con detalles de respuestas correctas/incorrectas
Opción para reiniciar el cuestionario
*/

document.addEventListener('DOMContentLoaded', function() {
    // Variables del juego
    let currentQuestion = 0;
    let userAnswers = new Array(15).fill(null);
    let score = 0;
    let timeLeft = 300; // 5 minutos en segundos
    let timerInterval;
    let quizCompleted = false;
    
    // Elementos DOM
    const timerElement = document.getElementById('timer');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const submitButton = document.getElementById('submit-btn');
    const resultsElement = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const resultDetailsElement = document.getElementById('result-details');
    const restartButton = document.getElementById('restart-btn');
    const quizContainer = document.getElementById('quiz-container');
    const progressElement = document.getElementById('progress');
    const questionCounterElement = document.getElementById('question-counter');
    
    // Preguntas del cuestionario
    const questions = [
        {
            question: "¿Quién es el protagonista de la película original TRON (1982)?",
            options: [
                "Kevin Flynn",
                "Sam Flynn",
                "Alan Bradley",
                "Clu"
            ],
            correct: 0
        },
        {
            question: "En TRON: Legacy, ¿quién interpreta a Kevin Flynn?",
            options: [
                "Jeff Bridges",
                "Bruce Boxleitner",
                "Garrett Hedlund",
                "Olivia Wilde"
            ],
            correct: 0
        },
        {
            question: "¿Cómo se llama el mundo virtual en las películas de TRON?",
            options: [
                "La Matriz",
                "El Grid",
                "OASIS",
                "Cyberspace"
            ],
            correct: 1
        },
        {
            question: "¿Qué empresa desarrolló el videojuego original TRON?",
            options: [
                "Atari",
                "Midway Games",
                "Bally Manufacturing",
                "Sega"
            ],
            correct: 2
        },
        {
            question: "En TRON: Legacy, ¿cómo se llama el programa creado por Kevin Flynn para gobernar El Grid?",
            options: [
                "Rinzler",
                "Clu",
                "Tron",
                "Zuse"
            ],
            correct: 1
        },
        {
            question: "¿Qué actor interpreta a Sam Flynn en TRON: Legacy?",
            options: [
                "Chris Pine",
                "Garrett Hedlund",
                "Michael Sheen",
                "James Frain"
            ],
            correct: 1
        },
        {
            question: "¿Qué objeto utiliza Kevin Flynn para entrar a El Grid en la película original?",
            options: [
                "Un láser especial",
                "Un dispositivo de teletransportación",
                "Un ordenador personal",
                "Un videojuego arcade"
            ],
            correct: 0
        },
        {
            question: "En TRON: Legacy, ¿cómo se llama el programa que ayuda a Sam Flynn?",
            options: [
                "Yori",
                "Ram",
                "Quorra",
                "Dumont"
            ],
            correct: 2
        },
        {
            question: "¿Qué significa ISO en el contexto de TRON: Legacy?",
            options: [
                "International Standards Organization",
                "Isomorphic Algorithms",
                "Isolated System Operators",
                "Integrated Software Objects"
            ],
            correct: 1
        },
        {
            question: "¿Quién es el director de TRON: Legacy?",
            options: [
                "Steven Lisberger",
                "Joseph Kosinski",
                "Tim Burton",
                "Christopher Nolan"
            ],
            correct: 1
        },
        {
            question: "En la película original, ¿qué programa ayuda a Flynn a luchar contra el MCP?",
            options: [
                "Clu",
                "Yori",
                "Tron",
                "Dumont"
            ],
            correct: 2
        },
        {
            question: "¿Qué famoso DJ compuso la banda sonora de TRON: Legacy?",
            options: [
                "Skrillex",
                "Deadmau5",
                "Daft Punk",
                "David Guetta"
            ],
            correct: 2
        },
        {
            question: "¿Qué empresa de software representa el MCP (Master Control Program) en la película original?",
            options: [
                "Microsoft",
                "Apple",
                "ENCOM",
                "IBM"
            ],
            correct: 2
        },
        {
            question: "En TRON: Legacy, ¿qué personaje es interpretado por Olivia Wilde?",
            options: [
                "Gem",
                "Yori",
                "Quorra",
                "Ma3a"
            ],
            correct: 2
        },
        {
            question: "¿Cuál es el nombre del proyecto para la tercera película de TRON anunciada en 2023?",
            options: [
                "TRON: Destiny",
                "TRON: Ascension",
                "TRON: Ares",
                "TRON: Rebirth"
            ],
            correct: 2
        }
    ];
    
    // Inicializar el juego
    function initGame() {
        currentQuestion = 0;
        userAnswers.fill(null);
        score = 0;
        timeLeft = 300;
        quizCompleted = false;
        
        updateTimerDisplay();
        showQuestion();
        startTimer();
        
        resultsElement.style.display = 'none';
        quizContainer.style.display = 'block';
    }
    
    // Mostrar pregunta actual
    function showQuestion() {
        const question = questions[currentQuestion];
        questionElement.textContent = question.question;
        
        // Actualizar contador de preguntas
        questionCounterElement.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
        
        // Actualizar barra de progreso
        progressElement.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
        
        // Limpiar opciones anteriores
        optionsElement.innerHTML = '';
        
        // Crear nuevas opciones
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            
            if (userAnswers[currentQuestion] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.addEventListener('click', () => selectOption(index));
            optionsElement.appendChild(optionElement);
        });
        
        // Actualizar estado de los botones
        prevButton.disabled = currentQuestion === 0;
        
        if (currentQuestion === questions.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'inline-block';
        } else {
            nextButton.style.display = 'inline-block';
            submitButton.style.display = 'none';
        }
    }
    
    // Seleccionar una opción
    function selectOption(index) {
        userAnswers[currentQuestion] = index;
        
        // Actualizar visualización de opciones seleccionadas
        const options = optionsElement.querySelectorAll('.option');
        options.forEach((option, i) => {
            if (i === index) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    // Navegar a la pregunta anterior
    function prevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
        }
    }
    
    // Navegar a la siguiente pregunta
    function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        }
    }
    
    // Iniciar temporizador
    function startTimer() {
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }
    
    // Actualizar visualización del temporizador
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `Tiempo: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 60) {
            timerElement.classList.add('time-warning');
        } else {
            timerElement.classList.remove('time-warning');
        }
    }
    
    // Finalizar el juego
    function endGame() {
        quizCompleted = true;
        clearInterval(timerInterval);
        
        // Calcular puntuación
        calculateScore();
        
        // Mostrar resultados
        showResults();
    }
    
    // Calcular puntuación
    function calculateScore() {
        let correctAnswers = 0;
        
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correct) {
                correctAnswers++;
            }
        });
        
        score = Math.round((correctAnswers / questions.length) * 100);
    }
    
    // Mostrar resultados
    function showResults() {
        quizContainer.style.display = 'none';
        resultsElement.style.display = 'block';
        
        scoreElement.textContent = `Puntuación: ${score}/100`;
        
        let resultHTML = '<h3>Detalles de respuestas:</h3><ul>';
        
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            resultHTML += `<li class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">`;
            resultHTML += `Pregunta ${index + 1}: ${isCorrect ? 'Correcta' : 'Incorrecta'}`;
            
            if (!isCorrect) {
                resultHTML += `<br>Tu respuesta: ${userAnswer !== null ? question.options[userAnswer] : 'Sin responder'}`;
                resultHTML += `<br>Respuesta correcta: ${question.options[question.correct]}`;
            }
            
            resultHTML += '</li>';
        });
        
        resultHTML += '</ul>';
        resultDetailsElement.innerHTML = resultHTML;
    }
    
    // Event listeners
    prevButton.addEventListener('click', prevQuestion);
    nextButton.addEventListener('click', nextQuestion);
    submitButton.addEventListener('click', endGame);
    restartButton.addEventListener('click', initGame);
    
    // Iniciar el juego al cargar la página
    initGame();
});
