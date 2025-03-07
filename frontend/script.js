const API_URL = "http://localhost:8080/api";

// Verifica se o usuário está logado
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "index.html"; // Redireciona para login se não estiver logado
}

// Verifica se o usuário é administrador
let isAdmin = false;
const userToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
if (userToken && userToken.role === 'admin') {
    isAdmin = true;
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
        const response = await fetch(`${API_URL}/activities`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const activities = await response.json();

        if (response.ok) {
            if (activities.length === 0) {
                container.innerHTML = "<p>Nenhuma atividade disponível no momento.</p>";
            } else {
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
                          ${isAdmin ? 
                            `<button onclick="showParticipants('${activity.id}')">Ver Participantes</button>
                             <button onclick="editActivity('${activity.id}')">Editar Atividade</button>
                             <button onclick="deleteActivity('${activity.id}')">Deletar Atividade</button>` : 
                            ''}
                        </div>
                    `;
                }).join("");
            }
        } else {
            container.innerHTML = "<p>Erro ao carregar atividades</p>";
        }
    } catch (error) {
        container.innerHTML = "<p>Erro ao conectar com o servidor</p>";
    }
}

// Função para adicionar uma nova atividade (formulário de criação de atividade)
function showCreateActivityForm() {
    const form = `
        <h2>Criar Nova Atividade</h2>
        <form id="create-activity-form">
            <input type="text" id="title" placeholder="Título" required><br>
            <textarea id="description" placeholder="Descrição" required></textarea><br>
            <input type="datetime-local" id="date" required><br>
            <input type="text" id="location" placeholder="Local" required><br>
            <input type="number" id="maxParticipants" placeholder="Máximo de participantes" required><br>
            <button type="submit">Criar Atividade</button>
        </form>
    `;
    document.getElementById("create-activity-container").innerHTML = form;

    // Adicionar o evento para enviar o formulário
    document.getElementById("create-activity-form")?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const date = document.getElementById("date").value;
        const location = document.getElementById("location").value;
        const maxParticipants = document.getElementById("maxParticipants").value;

        const newActivity = {
            title,
            description,
            date,
            location,
            maxParticipants
        };

        try {
            const response = await fetch(`${API_URL}/activities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newActivity)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Atividade criada com sucesso!");
                loadActivities(); // Atualiza lista de atividades
            } else {
                alert("Erro: " + data.message);
            }
        } catch (error) {
            alert("Erro ao conectar com o servidor");
        }
    });
}

// Exibir participantes de uma atividade (apenas para administradores)
async function showParticipants(activityId) {
    try {
        const response = await fetch(`${API_URL}/activities/${activityId}/participants`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const participants = await response.json();

        if (response.ok) {
            alert(`Participantes: ${participants.join(', ')}`);
        } else {
            alert('Erro ao carregar participantes');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
}

// Para editar uma atividade
async function editActivity(activityId) {
    console.log(`Editando a atividade: ${activityId}`);
}

// Para deletar uma atividade
async function deleteActivity(activityId) {
    const confirmation = confirm("Tem certeza que deseja deletar essa atividade?");
    if (confirmation) {
        try {
            const response = await fetch(`${API_URL}/activities/${activityId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Atividade deletada com sucesso!");
                loadActivities(); // Atualiza lista de atividades
            } else {
                alert("Erro ao deletar atividade");
            }
        } catch (error) {
            alert("Erro ao conectar com o servidor");
        }
    }
}

// Exibir o formulário de criação de atividade para admins
if (isAdmin) {
    const createButton = document.createElement('button');
    createButton.textContent = "Criar Nova Atividade";
    createButton.onclick = showCreateActivityForm;
    document.getElementById("admin-actions").appendChild(createButton);
}

// Carrega as atividades ao iniciar a página (somente na página activities.html)
if (window.location.pathname.includes("activities.html")) {
    loadActivities();
    loadUserActivities();
}