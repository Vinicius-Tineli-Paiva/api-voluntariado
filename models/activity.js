const { addData, getData, getAllData, removeData } = require('../database/rocksdb');

class Activity {
    // Cria uma nova atividade
    static async create(title, description, date, location, maxParticipants) {
        const activity = { title, description, date, location, maxParticipants, participants: [] };
        await addData(`activity:${title}`, JSON.stringify(activity)); // Salva no banco de dados
        return activity;
    }

    // Busca todas as atividades
    static async getAll() {
        const activities = await getAllData();
        return activities.filter(activity => activity.title.startsWith('activity:')); // Filtra apenas atividades
    }

    // Busca uma atividade pelo ID (título)
    static async getById(activityId) {
        const activity = await getData(`activity:${activityId}`);
        return activity ? JSON.parse(activity) : null; // Retorna a atividade ou null se não existir
    }

    // Atualiza uma atividade existente
    static async update(activityId, updatedActivity) {
        await addData(`activity:${activityId}`, JSON.stringify(updatedActivity)); // Atualiza no banco de dados
    }

    // Remove uma atividade
    static async remove(activityId) {
        await removeData(`activity:${activityId}`); // Remove do banco de dados
    }
}

module.exports = Activity;