  class SentioApp {
            constructor() {
                this.init = this.init.bind(this);
                this.setupLoadingScreen = this.setupLoadingScreen.bind(this);
                this.initParticles = this.initParticles.bind(this);
                this.createAdvancedParticles = this.createAdvancedParticles.bind(this);
                this.handleScroll = this.handleScroll.bind(this);
                this.setupIntersectionObserver = this.setupIntersectionObserver.bind(this);
                this.setupEventListeners = this.setupEventListeners.bind(this);
                this.animateChatMessages = this.animateChatMessages.bind(this);
                this.addChatMessage = this.addChatMessage.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
                this.initSmoothScrolling = this.initSmoothScrolling.bind(this);
                this.debounce = this.debounce.bind(this);
            }
            
            init() {
                this.setupLoadingScreen();
                this.initParticles();
                this.setupIntersectionObserver();
                this.setupEventListeners();
            }
            
            setupLoadingScreen() {
                const loadingScreen = document.getElementById('loadingScreen');
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    loadingScreen.addEventListener('transitionend', () => {
                        loadingScreen.style.display = 'none';
                    }, { once: true });
                }, 2000);
            }
            
            initParticles() {
                ['headerParticles', 'bannerParticles', 'footerParticles'].forEach((id, i) => {
                    this.createAdvancedParticles(id, [20, 35, 15][i]);
                });
            }
            
            createAdvancedParticles(containerId, count = 25) {
                const container = document.getElementById(containerId);
                if (!container) return;
                
                const fragment = document.createDocumentFragment();
                
                for (let i = 0; i < count; i++) {
                    const particle = document.createElement('div');
                    const type = Math.floor(Math.random() * 3) + 1;
                    particle.className = `particle type-${type}`;
                    
                    Object.assign(particle.style, {
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 6 + 2}px`,
                        height: particle.style.width,
                        animationDelay: `${Math.random() * 8}s`,
                        animationDuration: `${Math.random() * 4 + 6}s`
                    });
                    
                    fragment.appendChild(particle);
                }
                
                container.appendChild(fragment);
            }
            
            handleScroll() {
                const header = document.getElementById('header');
                const scrolled = window.scrollY > 100;
                header.classList.toggle('scrolled', scrolled);
            }
            
            setupIntersectionObserver() {
                const observerOptions = {
                    threshold: 0.15,
                    rootMargin: '0px 0px -80px 0px'
                };
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            
                            // Animación especial para la sección de soporte
                            if (entry.target.id === 'soporte') {
                                setTimeout(this.animateChatMessages, 800);
                                observer.unobserve(entry.target);
                            }
                        }
                    });
                }, observerOptions);
                
                document.querySelectorAll('.section').forEach(section => {
                    observer.observe(section);
                });
            }
            
            animateChatMessages() {
                const messages = document.querySelectorAll('.message');
                messages.forEach((message, index) => {
                    setTimeout(() => {
                        message.style.opacity = '1';
                        message.style.transform = 'translateX(0)';
                        message.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, index * 1200);
                });
            }
            
            addChatMessage() {
                const chatMessages = document.getElementById('chatMessages');
                const questions = [
                    "¿Puedes ayudarme con la configuración inicial?",
                    "¿Cómo actualizo el firmware del escritorio?",
                    "¿Qué hacer si la pizarra no responde al tacto?",
                    "¿Cómo interpretar los datos biométricos?",
                    "¿Puedo conectar dispositivos externos?"
                ];
                
                const responses = [
                    "¡Por supuesto! Te guiaré paso a paso en la configuración inicial de tu escritorio Sentio. Primero, asegúrate de que esté conectado a la red.",
                    "Para actualizar el firmware, ve a Configuración > Sistema > Actualizaciones. El proceso es automático y toma aproximadamente 5 minutos.",
                    "Si la pizarra no responde, intenta reiniciar el sistema manteniendo presionado el botón de encendido por 10 segundos. Si persiste, contacta soporte técnico.",
                    "Los datos biométricos se muestran en tiempo real en el panel de control. Verde indica estado óptimo, amarillo precaución y rojo requiere descanso.",
                    "Sí, Sentio es compatible con tablets, smartphones y laptops vía Bluetooth y WiFi. Ve a Configuración > Conectividad para emparejar dispositivos."
                ];
                
                const randomIndex = Math.floor(Math.random() * questions.length);
                
                // Mensaje del usuario
                const newMessage = document.createElement('div');
                newMessage.className = 'message user';
                newMessage.innerHTML = `<div class="message-bubble">${questions[randomIndex]}</div>`;
                newMessage.style.opacity = '0';
                newMessage.style.transform = 'translateX(30px)';
                chatMessages.appendChild(newMessage);
                
                setTimeout(() => {
                    newMessage.style.opacity = '1';
                    newMessage.style.transform = 'translateX(0)';
                    newMessage.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    // Respuesta de la IA con efecto de escritura
                    setTimeout(() => {
                        const aiResponse = document.createElement('div');
                        aiResponse.className = 'message ai';
                        aiResponse.innerHTML = `<div class="message-bubble">${responses[randomIndex]}</div>`;
                        aiResponse.style.opacity = '0';
                        aiResponse.style.transform = 'translateX(-30px)';
                        chatMessages.appendChild(aiResponse);
                        
                        setTimeout(() => {
                            aiResponse.style.opacity = '1';
                            aiResponse.style.transform = 'translateX(0)';
                            aiResponse.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }, 100);
                    }, 1500);
                }, 100);
            }
            
            handleSubmit(event) {
                event.preventDefault();
                const button = event.target.querySelector('.submit-button');
                const originalText = button.textContent;
                
                // Estado de carga
                button.textContent = 'Enviando...';
                button.style.background = 'linear-gradient(45deg, #6c757d, #495057)';
                button.disabled = true;
                
                setTimeout(() => {
                    // Estado de éxito
                    button.textContent = '¡Mensaje enviado!';
                    button.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
                    
                    setTimeout(() => {
                        // Resetear estado
                        button.textContent = originalText;
                        button.style.background = 'var(--blue-gradient)';
                        button.disabled = false;
                        event.target.reset();
                        
                        // Restablecer etiquetas flotantes
                        document.querySelectorAll('.form-group label').forEach(label => {
                            const input = label.previousElementSibling;
                            if (!input.value) {
                                label.style.top = '1.2rem';
                                label.style.left = '1.5rem';
                                label.style.fontSize = '';
                                label.style.color = '';
                                label.style.background = '';
                                label.style.padding = '';
                                label.style.fontWeight = '';
                            }
                        });
                    }, 3000);
                }, 2000);
            }
            
            initSmoothScrolling() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        e.preventDefault();
                        const target = document.querySelector(this.getAttribute('href'));
                        if (target) {
                            const headerHeight = document.querySelector('.header').offsetHeight;
                            const targetPosition = target.offsetTop - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                            
                            // Manejar el foco para accesibilidad
                            if (target.hasAttribute('tabindex')) {
                                target.setAttribute('tabindex', '-1');
                                target.focus();
                            }
                        }
                    });
                });
            }
            
            setupEventListeners() {
                window.addEventListener('scroll', this.debounce(this.handleScroll, 16));
                window.addEventListener('load', () => {
                    document.body.style.opacity = '1';
                });
                
                document.getElementById('aiButton')?.addEventListener('click', this.addChatMessage);
                document.getElementById('contactForm')?.addEventListener('submit', this.handleSubmit);
                
                this.initSmoothScrolling();
            }
            
            debounce(func, wait) {
                let timeout;
                return function() {
                    const context = this, args = arguments;
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        func.apply(context, args);
                    }, wait);
                };
            }
        }

        // Inicialización cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            const app = new SentioApp();
            app.init();
        });

//Api GEMINI
generarBtn.addEventListener("click", async () => {
  const prompt = mensaje.value; // tomamos el texto del usuario

  // Fetch hacia la función serverless
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    respuestaDiv.textContent = data.receta || "Error al obtener respuesta";
  } catch (error) {
    respuestaDiv.textContent = "Seguimos pensando...";
    console.error(error);
  }
});
