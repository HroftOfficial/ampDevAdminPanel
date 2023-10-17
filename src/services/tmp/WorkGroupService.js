import $api from "../http";
export default class WorkGroupService {

    /**
     * TODO
     * получить данные для WorkGroup
     */
         static async fetchWorkGroup() {
            return await $api.get('/work_group');
            
        }

    /**
     * TODO
     * получить данные для item по id для группы предприятия
     */
     static async fetchItemWorkGroup(id) {
        return await $api.post(`/work_group/${id}`);
    }


    /**
     * TODO
     * сохраняем изменения ID
     */
    static async updateWorkGroup(id,name,raiting,legend) {
        return await $api.post(`/work_group/update/${id}`,{name, raiting, legend})
    }

    //state
    static async stateWorkGroup (id, enabled) {
        return await $api.post(`/work_group/delete/${id}`, {
            enabled
        });
    }






    /**
     * TODO
     * создать новую группу оборудования
     */
    static async createWorkGroup(name, raiting, legend) {
        return $api.post('/work_group/create', {name, raiting, legend });
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

