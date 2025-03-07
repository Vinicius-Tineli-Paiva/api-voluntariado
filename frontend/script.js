const API_URL = "http://localhost:3000/api";

//Envio do formulário de login
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); //Evitar recarregamento da página

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("login-error");

    
    //Requisicao de login para a API
    try {
        const response = await fetch(`${API_URL/auth/login}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            //Armazena o token no localStorage
            localStorage.setItem("token", data.token);
            alert("Login realizado com sucesso");
            window.location.reload(); //Recarrega pag para atualizar interface
        } else {
            errorMessage.textContent = "Erro: " + data.message;
        }
    } catch (error) {
        errorMessage.textContent = "Erro ao conectar com o servidor";
    }
});

//Buscar atividades disponíveis
async function loadActivities() {
    const container = document.getElementById("activities-container");
    container.innerHTML = "<p>Carregando atividades...<p>";

    try {
        const response = await fetch(`${API_URL}/activities`);
        const activities = await response.json();

        // Renderiza atividades
        if(response.ok) {
            container.innerHTML = activities.map(activity =>
                <div class="activity">
                    <h3>${activity.title}</h3>
                    <p>${activity.description}</p>
                    <p><strong>Data:</strong> ${activity.date}</p>
                    <p><strong>Local: </strong> ${activity.location}</p>
                    <p><strong>Vagas disponíveis: </strong> ${activity.maxParticipants - activity.participants.length}</p>
                    <button onclick="registerForActivity(`${activity.id}`">Inscrever-se</button>
                </div>
            ).join("");
        } else {
            container.innerHTML = "<p>Erro ao carregar atividades<p>";
        }
    } catch (error) {
        container.innerHTML = "<p>Erro ao conectar com o servidor<p>";
    }
}

//Para inscrever um usuario em uma atividade
async function registerForActivity(activityId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para se inscrever");
        return;
    }
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
        loadActivities(); //Atualiza lista de atividades
    } else {
        alert("Erro: " + data.message);
    }
} catch (error) {
    alert("Erro ao conectar com o servidor");
}

//Carrega as atividades ao iniciar a pagina
loadActivities();