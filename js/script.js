console.log("Plataforma Academia Digital - JavaScript inicializado.");

// ============ DATOS DE LA RUTA DE APRENDIZAJE ============
const pathData = {
    1: {
        title: "Fundamentos Web",
        status: "Completado",
        statusClass: "badge-completed",
        desc: "Has dominado la estructura semántica y los estilos en cascada. Ya puedes crear maquetaciones estáticas responsive.",
        resources: [
            "Certificado de HTML5",
            "Proyecto: Landing Page Personal",
            "Examen final: 95/100"
        ],
        btnText: "Ver Repaso"
    },
    2: {
        title: "JavaScript Moderno",
        status: "En Progreso",
        statusClass: "badge-active",
        desc: "Actualmente estás aprendiendo manipulación del DOM y peticiones asíncronas (Fetch API). ¡Sigue así!",
        resources: [
            "Módulo actual: Promesas y Async/Await",
            "Reto pendiente: App de Clima",
            "Mentoría disponible"
        ],
        btnText: "Continuar Aprendiendo"
    },
    3: {
        title: "Frameworks (React)",
        status: "Bloqueado",
        statusClass: "badge-locked",
        desc: "Este módulo se desbloqueará cuando termines JavaScript Moderno. Aprenderás a crear SPAs (Single Page Applications).",
        resources: [
            "Introducción a JSX",
            "Hooks básicos",
            "Gestión de estado"
        ],
        btnText: "Ver Previsualización"
    }
};

// ============ FUNCIONES DE LA LISTA DE REPRODUCCIÓN ============

// Función para inicializar la lista de reproducción de videos
function initVideoPlaylist() {
    // Verificar si estamos en una página que tiene lista de reproducción
    const playlistContainer = document.querySelector('.playlist-container');
    if (!playlistContainer) {
        return; // Salir si no hay lista de reproducción
    }

    const currentVideo = document.getElementById('current-video');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const prevBtn = document.getElementById('prev-video');
    const nextBtn = document.getElementById('next-video');
    const videoCounter = document.getElementById('video-counter');
    
    let currentIndex = 0;
    const totalVideos = playlistItems.length;
    
    function updateVideo(index) {
        // Remover clase active de todos los items
        playlistItems.forEach(item => item.classList.remove('active'));
        
        // Agregar clase active al item actual
        playlistItems[index].classList.add('active');
        
        // Obtener el ID del video del item seleccionado
        const videoId = playlistItems[index].getAttribute('data-video-id');
        
        // Actualizar el iframe con el nuevo video
        // Nota: ahora asumimos que el iframe es de YouTube (como en el HTML actual)
        currentVideo.src = `https://www.youtube.com/embed/${videoId}`;
        
        // Actualizar contador
        videoCounter.textContent = `Video ${index + 1} de ${totalVideos}`;
        
        // Actualizar índice actual
        currentIndex = index;
        
        // Actualizar estado de los botones
        if (prevBtn) prevBtn.disabled = (index === 0);
        if (nextBtn) nextBtn.disabled = (index === totalVideos - 1);
    }
    
    // Evento click en los items de la lista
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateVideo(index);
        });
    });
    
    // Evento para botón anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                updateVideo(currentIndex - 1);
            }
        });
    }
    
    // Evento para botón siguiente
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalVideos - 1) {
                updateVideo(currentIndex + 1);
            }
        });
    }
    
    // Inicializar con el primer video
    updateVideo(0);
}

// ============ FUNCIONES DEL SISTEMA DE CURSO ============

// Función para guardar progreso del curso
function saveProgress() {
    const progressElement = document.querySelector('.progress');
    if (progressElement) {
        const currentWidth = progressElement.style.width || '0%';
        localStorage.setItem('courseProgress', currentWidth);
        console.log(`Progreso guardado: ${currentWidth}`);
    }
}

// Función para cargar progreso guardado
function loadProgress() {
    const progressElement = document.querySelector('.progress');
    if (progressElement) {
        const savedProgress = localStorage.getItem('courseProgress');
        if (savedProgress) {
            progressElement.style.width = savedProgress;
            console.log(`Progreso cargado: ${savedProgress}`);
        }
    }
}

// Función para manejar comentarios dinámicos
function setupComments() {
    const commentTextarea = document.querySelector('textarea[placeholder="Escribe tu comentario..."]');
    const commentButton = document.querySelector('.btn');
    const commentsContainer = document.querySelector('.clase-main');
    
    if (commentTextarea && commentButton && commentsContainer) {
        commentButton.addEventListener('click', () => {
            const commentText = commentTextarea.value.trim();
            
            if (commentText) {
                // Crear nuevo elemento de comentario
                const newComment = document.createElement('div');
                newComment.className = 'comentario';
                
                // Obtener nombre de usuario (podría venir de un sistema de autenticación)
                const userName = localStorage.getItem('userName') || 'Usuario';
                
                newComment.innerHTML = `
                    <strong>${userName}:</strong>
                    <p>${commentText}</p>
                `;
                
                // Insertar el nuevo comentario antes del textarea
                commentsContainer.insertBefore(newComment, commentTextarea.parentNode);
                
                // Limpiar el textarea
                commentTextarea.value = '';
                
                // Guardar comentario en localStorage
                saveComment(userName, commentText);
                
                console.log('Comentario agregado:', commentText);
            }
        });
        
        // Permitir enviar comentario con Ctrl+Enter
        commentTextarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                commentButton.click();
            }
        });
    }
}

// Función para guardar comentario en localStorage
function saveComment(user, text) {
    const comments = JSON.parse(localStorage.getItem('courseComments') || '[]');
    comments.push({
        user: user,
        text: text,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('courseComments', JSON.stringify(comments));
}

// Función para cargar comentarios guardados
function loadComments() {
    const comments = JSON.parse(localStorage.getItem('courseComments') || '[]');
    const commentsContainer = document.querySelector('.clase-main');
    
    if (commentsContainer && comments.length > 0) {
        // Buscar el contenedor donde insertar comentarios (antes del textarea)
        const textarea = document.querySelector('textarea[placeholder="Escribe tu comentario..."]');
        
        if (textarea) {
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comentario';
                commentElement.innerHTML = `
                    <strong>${comment.user}:</strong>
                    <p>${comment.text}</p>
                    <small>${new Date(comment.timestamp).toLocaleDateString()}</small>
                `;
                commentsContainer.insertBefore(commentElement, textarea.parentNode);
            });
        }
    }
}

// Función para botón siguiente clase
function setupNextClassButton() {
    // Verificar si estamos en una página de clase
    const sidebarLinks = document.querySelectorAll('.sidebar-list a');
    const currentUrl = window.location.pathname;
    
    if (sidebarLinks.length > 0) {
        let nextClassUrl = null;
        
        // Buscar el enlace actual y obtener el siguiente
        for (let i = 0; i < sidebarLinks.length; i++) {
            if (sidebarLinks[i].getAttribute('href') === currentUrl) {
                if (i < sidebarLinks.length - 1) {
                    nextClassUrl = sidebarLinks[i + 1].getAttribute('href');
                }
                break;
            }
        }
        
        // Si hay una siguiente clase, agregar botón
        if (nextClassUrl) {
            const nextButton = document.createElement('a');
            nextButton.href = nextClassUrl;
            nextButton.className = 'btn';
            nextButton.textContent = 'Siguiente clase →';
            nextButton.style.marginTop = '20px';
            nextButton.style.display = 'block';
            
            // Insertar antes del área de comentarios
            const commentsSection = document.querySelector('h3:contains("Comentarios")') || 
                                   document.querySelector('textarea');
            if (commentsSection) {
                commentsSection.parentNode.insertBefore(nextButton, commentsSection);
            }
        }
    }
}

// ============ FUNCIONES DEL MODAL DE RUTA DE APRENDIZAJE ============

function initLearningPathModal() {
    // Verificar si estamos en una página que tiene la ruta de aprendizaje
    const modalOverlay = document.getElementById('pathModal');
    if (!modalOverlay) {
        return; // Salir si no hay modal de ruta de aprendizaje
    }

    // ELEMENTOS DEL DOM
    const closeModalBtn = document.querySelector('.close-modal');
    const pathSteps = document.querySelectorAll('.path-step');

    // Elementos internos del modal a actualizar
    const mTitle = document.getElementById('modalTitle');
    const mStatus = document.getElementById('modalStatus');
    const mDesc = document.getElementById('modalDesc');
    const mList = document.getElementById('modalList');
    const mBtn = document.getElementById('modalAction');

    // FUNCIONES INTERNAS
    function openModal(stepId) {
        const data = pathData[stepId];

        if (!data) return; // Si no hay datos, no hace nada

        // Inyectar datos en el modal
        mTitle.textContent = data.title;
        mDesc.textContent = data.desc;
        mBtn.textContent = data.btnText;

        // Configurar badge de estado
        mStatus.textContent = data.status;
        mStatus.className = 'modal-badge ' + data.statusClass; // Limpia clases anteriores

        // Limpiar y llenar lista de recursos
        mList.innerHTML = '';
        data.resources.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            mList.appendChild(li);
        });

        // Mostrar modal
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    // EVENT LISTENERS

    // Click en los pasos de la ruta
    pathSteps.forEach(step => {
        step.addEventListener('click', () => {
            const stepId = step.getAttribute('data-step');
            openModal(stepId);
        });
    });

    // Click en cerrar (X)
    closeModalBtn.addEventListener('click', closeModal);

    // Click fuera del modal (en el fondo oscuro) para cerrar
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============ FUNCIONES DE INICIALIZACIÓN ============

// Función para inicializar todo cuando el DOM esté listo (para páginas de curso)
function initCoursePage() {
    console.log("Inicializando página del curso...");
    
    // Inicializar lista de reproducción (actualizada para YouTube)
    initVideoPlaylist();
    
    // Cargar progreso guardado
    loadProgress();
    
    // Configurar sistema de comentarios
    setupComments();
    
    // Cargar comentarios guardados
    loadComments();
    
    // Configurar botón de siguiente clase
    setupNextClassButton();
    
    // Guardar progreso automáticamente al salir de la página
    window.addEventListener('beforeunload', saveProgress);
    
    // Guardar progreso cada 30 segundos
    setInterval(saveProgress, 30000);
    
    console.log("Página del curso inicializada correctamente");
}

// Función para inicializar el dashboard principal
function initDashboard() {
    console.log("Inicializando dashboard...");
    
    // Inicializar modal de ruta de aprendizaje
    initLearningPathModal();
    
    // Cargar progreso guardado (también aplicable al dashboard)
    loadProgress();
    
    console.log("Dashboard inicializado correctamente");
}

// ============ INICIALIZACIÓN PRINCIPAL ============

function initAll() {
    // Verificar qué tipo de página estamos inicializando
    const isCoursePage = document.querySelector('.clase-main') !== null;
    const isDashboard = document.querySelector('.main') !== null;
    
    if (isCoursePage) {
        initCoursePage();
        console.log("Página interna del curso lista.");
    }
    
    if (isDashboard) {
        initDashboard();
    }
    
    // Funciones que pueden aplicarse a ambas páginas
    if (!isCoursePage && !isDashboard) {
        // Si es otra página, al menos cargar progreso si existe
        loadProgress();
    }
}

// Inicializar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

/* Funcionalidades implementadas:
  - Lista de reproducción de videos ✓ (para páginas de curso)
  - Guardar progreso ✓ (para todas las páginas)
  - Comentarios dinámicos ✓ (para páginas de curso)
  - Reproducción automática ✓
  - Botón siguiente clase ✓ (para páginas de curso)
  - Modal de ruta de aprendizaje ✓ (para dashboard)
  - Sistema de notificaciones modal ✓ (para dashboard)
*/