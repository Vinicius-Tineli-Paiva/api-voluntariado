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
        const allData = await getAllData();
        return allData.filter(entry => entry.key.startsWith('activity:')).map(entry => entry.value);
    }

   // Busca uma atividade pelo ID
   static async getById(activityId) {
    const activity = await getData(activityId);
    return activity ? JSON.parse(activity) : null;
}

// Atualiza uma atividade existente
static async update(activityId, updatedActivity) {
    await addData(activityId, JSON.stringify(updatedActivity));
}

// Remove uma atividade
static async remove(activityId) {
    await removeData(activityId);
}
}

module.exports = Activity;