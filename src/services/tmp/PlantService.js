import $api from "../http";
// import axios from 'axios';
// import {AuthResponse} from "../models/response/AuthResponse";

export default class PlantService {

    /**
     * TODO
     * создать новуое оборудование
     */
         static async createPlantWitchFile(data) {
            return await $api.post('/plant/create', data, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                  }
            });
        }

            /**
     * TODO
     * обновляем оборудование
     */
             static async updateAll(data, id) {
                return $api.post(`plant/update/${id}`, data, {
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

     /**
     * TODO
     * получить все оборудование
     */
        static async fetchPlants() {
            const result = await $api.get('/plant');
            return result;
        }
     /**
     * TODO
     * получить оборудование по его ID
     */
        static async fetchItemPlant(id) {
            const result = await $api.post(`/plant/${id}`);
            return result;
        }



        /**
 * TODO 
 * пометить на удаление или вернуть назад
 * */
 static async statePlant(id, enabled, deleted) {
    return await $api.post(`/plant/delete/${id}`, {
        enabled, deleted
    });
}



    /**
     * TODO
     * получаем имя грыппы оборудования по id
     *  */

    // /**
    //  * TODO
    //  * узнаем количество элементов оборудования * 10. 
    //  * Для рекомендации в поле "номер сортировки"  
    //  * */

    // static getCountPlant() {
    //     const response = $api.get('/plant/sort');
    //     return response?.data
    // }



    static async create(name, sortNumber, enabled) {
        return $api.post('/plant/create', {name, sortNumber, enabled})
    }



    static fetchUsersAmp() {
        const result = $api.get('/usersamp');
        return result;
    }

    static fetchItemUser(id) {
        const result = $api.post(`/users/${id}`);
        return result;
    }

    static async update(name, email, position,enabled, id) {
        return $api.post(`/users/update/${id}`, {name, email, position,enabled})
    }

    static async changePassword(password, id) {
        return $api.post(`/users/update_password/${id}`,{password})
    }

}

