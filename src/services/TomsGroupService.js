import $api from "../http";
export default class TomsGroupService {

    /**
     * TODO
     * получить данные для TomsGroup
     */
         static async fetchWTomsGroup() {
            return await $api.get('/toms_group');
            
        }

    /**
     * TODO
     * получить данные для item по id для TomsGroup
     */
     static async fetchItemTomsGroup(id) {
        return await $api.post(`/toms_group/${id}`);
    }


    /**
     * TODO
     * сохраняем изменения ID TomsGroup
     */
    static async updateTomsGroup(id,name_rus, name_eng) {
        return await $api.post(`/toms_group/update/${id}`,{name_rus, name_eng})
    }

    /**
 * TODO 
 * пометить на удаление или вернуть назад
 * */
 static async stateToms(id, enabled, deleted) {
    return await $api.post(`/toms_group/delete/${id}`, {
        enabled, deleted
    });
}






    /**
     * TODO
     * создать новую группу оборудования
     */
    static async createTomsGroup(name_rus, name_eng) {
        return $api.post('/toms_group/create', {name_rus, name_eng});
    }



    /**
     * TODO
     * обновить данные для item по id для группы оборудования
     */
    static async updateAll(data, id) {
        return $api.post(`plant_group/update_all/${id}`, data, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
    }

        // static async createPlantGroup(name, sortNumber, enabled) {
    //     return $api.post('/plant_group/create', {name, sortNumber, enabled})
    // }
    
    // static async update(name, sortNumber, enabled, id) {
    //     return $api.post(`/plant_group/update/${id}`, {name, sortNumber, enabled})
    // }
    // static async uploadImg(data, id) {
    //     return $api.post(`plant_group/upload/${id}`, data, {
    //         headers:{
    //             'content-type':'multipart/form-data'
    //           }
    //     });
    // }

    // static async changePassword(password, id) {
    //     return $api.post(`/users/update_password/${id}`,{password})
    // }

}

