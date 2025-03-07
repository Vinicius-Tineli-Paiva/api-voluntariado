const API_URL = "http://localhost:8080/api";

// Verifica se o usuário está logado
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "index.html"; // Redireciona para login se não estiver logado
}

// Envio do formulário de login
document.getElementById("login-form")?.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar recarregamento da página

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("login-error");
    const successMessage = document.getElementById("login-success");

    // Limpar mensagens anteriores
    errorMessage.textContent = "";
    successMessage.textContent = "";

    try {
        // Envia a senha em texto plano para o backend
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }) // Senha em texto plano
        });

        const data = await response.json();

        if (response.ok) {
            successMessage.textContent = "Login realizado com sucesso";
            localStorage.setItem("token", data.token); // Armazena o token no localStorage
            setTimeout(() => {
                window.location.href = "activities.html"; // Redireciona para a página de atividades
            }, 1500); // Aguarda 1.5 segundos antes de redirecionar
        } else {
            errorMessage.textContent = "Erro: " + data.message;
        }
    } catch (error) {
        errorMessage.textContent = "Erro ao conectar com o servidor";
    }
});

// Envio do formulário de cadastro
document.getElementById("register-form")?.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar recarregamento da página

    const name = document.getElementById("name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const isAdmin = document.getElementById("isAdmin").checked;
    const errorMessage = document.getElementById("register-error");
    const successMessage = document.getElementById("register-success");

    // Limpar mensagens anteriores
    errorMessage.textContent = "";
    successMessage.textContent = "";

    // Validação do formulário
    if (!name || !email || !password) {
        return errorMessage.textContent = "Todos os campos são obrigatórios!";
    }

    try {
        // Envia a senha em texto plano para o backend
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, isAdmin }) // Senha em texto plano
        });

        const data = await response.json();

        if (response.ok) {
            successMessage.textContent = "Cadastro realizado com sucesso!";
            document.getElementById("register-form").reset(); // Limpar o formulário
        } else {
            errorMessage.textContent = "Erro: " + data.message;
        }
    } catch (error) {
        errorMessage.textContent = "Erro ao conectar com o servidor";
    }
});

// Buscar atividades disponíveis
async function loadActivities() {
    const container = document.getElementById("activities-container");
    container.innerHTML = "<p>Carregando atividades...</p>";

    try {
        const response = await fetch(`${API_URL}/activities`);
        const activities = await response.json();

        // Renderiza atividades
        if (response.ok) {
            container.innerHTML = activities.map(activity => {
                const isUserLoggedIn = localStorage.getItem("token");
                const userToken = isUserLoggedIn ? JSON.parse(atob(localStorage.getItem("token").split('.')[1])) : null;
                const isAdmin = userToken && userToken.role === 'admin';
                const isUserRegistered = activity.participants.includes(userToken?.id);

                return `
                    <div class="activity">
                      <h3>${activity.title}</h3>
                      <p>${activity.description}</p>
                      <p><strong>Data:</strong> ${activity.date}</p>
                      <p><strong>Local:</strong> ${activity.location}</p>
                      <p><strong>Vagas disponíveis:</strong> ${activity.maxParticipants - activity.participants.length}</p>
                      <button ${isUserRegistered || activity.participants.length >= activity.maxParticipants ? 'disabled' : ''} onclick="registerForActivity('${activity.id}')">Inscrever-se</button>
                      ${isUserRegistered ? 
                        `<button onclick="cancelRegistration('${activity.id}')">Cancelar Inscrição</button>` : 
                        ''}
                    </div>
                `;
            }).join("");
        } else {
            container.innerHTML = "<p>Erro ao carregar atividades</p>";
        }
    } catch (error) {
        container.innerHTML = "<p>Erro ao conectar com o servidor</p>";
    }
}

// Buscar as atividades do usuário
async function loadUserActivities() {
    const userContainer = document.getElementById("user-activities-container");
    userContainer.innerHTML = "<p>Carregando suas atividades...</p>";

    try {
        const response = await fetch(`${API_URL}/users/activities`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const userActivities = await response.json();

        // Renderiza atividades do usuário
        if (response.ok) {
            userContainer.innerHTML = userActivities.map(activity => {
                return `
                    <div class="activity">
                      <h3>${activity.title}</h3>
                      <p>${activity.description}</p>
                      <p><strong>Data:</strong> ${activity.date}</p>
                      <p><strong>Local:</strong> ${activity.location}</p>
                      <button onclick="cancelRegistration('${activity.id}')">Cancelar Inscrição</button>
                    </div>
                `;
            }).join("");
        } else {
            userContainer.innerHTML = "<p>Erro ao carregar suas atividades</p>";
        }
    } catch (error) {
        userContainer.innerHTML = "<p>Erro ao conectar com o servidor</p>";
    }
}

// Para inscrever um usuário em uma atividade
async function registerForActivity(activityId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para se inscrever");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/activities/${activityId}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inscrição realizada com sucesso");
            loadActivities(); // Atualiza lista de atividades
            loadUserActivities(); // Atualiza atividades do usuário
        } else {
            alert("Erro: " + data.message);
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor");
    }
}

// Cancelar inscrição em uma atividade
async function cancelRegistration(activityId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para cancelar sua inscrição");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/activities/${activityId}/register`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inscrição cancelada com sucesso");
            loadActivities(); // Atualiza lista de atividades
            loadUserActivities(); // Atualiza atividades do usuário
        } else {
            alert("Erro: " + data.message);
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor");
    }
}

// Carrega as atividades ao iniciar a página (somente na página activities.html)
if (window.location.pathname.includes("activities.html")) {
    loadActivities();
    loadUserActivities();
}