import $api from "../http";
export default class TomsService {

    /**
     * TODO
     * получить данные для Toms
     */
         static async fetchToms() {
            return await $api.get('/toms');
            
        }

/**
 * TODO 
 * пометить на удаление или вернуть назад
 * */
 static async stateToms(id, enabled, deleted) {
    return await $api.post(`/toms/delete/${id}`, {
        enabled, deleted
    });
}
    /**
     * TODO
     * создать новый вид обработки
     */
     static async createToms(name, group, enabled) {
        return $api.post('/toms/create', {name, group, enabled});
    }

    /**
     * TODO
     * получить данные для item по id для вида обработки
     */
     static async fetchItemToms(id) {
        return await $api.post(`/toms/${id}`);
    }

        /**
     * TODO
     * обновить данные для item по id для вида обработки
     */
         static async updateAll(name, group, enabled, id) {
            return $api.post(`toms/update/${id}`, {
                name, group, enabled
            });
        }








    /**
     * TODO
     * сохраняем изменения ID TomsGroup
     */
    static async updateTomsGroup(id,name_rus, name_eng) {
        return await $api.post(`/toms_group/update/${id}`,{name_rus, name_eng})
    }













}

