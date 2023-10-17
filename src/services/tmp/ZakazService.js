import $api from "../http";


export default class ZakazService {

    /**
    * TODO
    * получить все закзаы
    */ 
    static fetchZakazes() {
        const result = $api.get('/zakazes');
        return result;
    }

    /**
    * TODO
    * удалить - восстановить заказ
    */ 
    static async stateZakaz(id, enabled, deleted) {
        return await $api.post(`/zakazes/delete/${id}`, {
            enabled, deleted
        });
    }


    static async getZakazFilesToId(id) {
        return await $api.get(`/zakazes/${id}`);
    }




    /**
     * TODO
     * удаляем пользователя по его ID
     */
         static async deleteUserAmp(id) {
            return await $api.post(`/users_amp/delete/${id}`);
        }



        
        static async stateService(id, service) {
            return await $api.post(`/users_amp/service/${id}`, {
                service
            });
        }

        static async getToms() {
            return await $api.get('/users_amp/toms')
        }
        
        static async getWorkGroup() {
            return await $api.get('/work_group');
        }

            /**
     * TODO
     * создать нового пользователя
     */
    static async createUserAmp(data) {
        return $api.post('/users_amp/registration', data, {
            headers:{
                'Content-Type': 'multipart/form-data'
              }
        });
    }

    static async updateUserAmp(id, data) {
        return $api.post(`/users_amp/update/${id}`, data
        // ,  {
        //     headers:{
        //         'Content-Type': 'multipart/form-data'
        //       }
        // }
        );
    }

    // обновляем логотип 
    static async changeImage(id,data) {
        return $api.post(`/users_amp/cl/${id}`, data, {
            headers:{
                'Content-Type': 'multipart/form-data'
              }
        });
    }

    static getUserAmpToId(id) {
        const result = $api.get(`/users_amp/${id}`);
        return result;
    }

    static fetchUsers() {
        const result = $api.get('/users_amp');
        return result;
    }

    /**
    * TODO
    * отправить на почту пользователю новый пароль
    */   
    static async changePassword(id, email) {
        return await $api.post(`/users_amp/cp/${id}`, {email});
    }

    /**
     * TODO 
     * смена населенного пункта
     * */
    static async changeCities(id, cities) {
        return await $api.post(`/users_amp/cs/${id}`, {cities});
    }

    // static async login(email, password) {
    //     return $api.post('/users/login', {email, password})
    // }

    // static async registration(name, email, position, password,enabled) {
    //     return $api.post('/users/registration', {name, email, position, password,enabled})
    // }



    // static async logout() {
    //     return $api.post('/users/logout')
    // }

    // static fetchUsers(page, limit) {
    //     const result = $api.get(`/users/${page}/${limit}`);
    //     return result;
    // }





    static fetchItemUser(id) {
        const result = $api.post(`/users_amp/${id}`);
        return result;
    }

    static async update(name, email, position,enabled, id) {
        return $api.post(`/users/update/${id}`, {name, email, position,enabled})
    }

    // static async changePassword(password, id) {
    //     return $api.post(`/users/update_password/${id}`,{password})
    // }

}

