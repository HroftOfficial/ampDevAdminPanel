import $api from "../../http";

export default class ChatService {


         /**
     * TODO
     * получить все чаты
     */
          static async fetchChats() {
            return await $api.get('/chat');
        }

    /**
     * TODO
     * создать новость
     */
         static async createNews(data) {
            return await $api.post('/news/create', data, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                  }
            });
        }



     /**
     * TODO
     * получить новость по его ID
     */
        static async fetchItemNews(id) {
            const result = await $api.get(`/news/${id}`);
            return result;
        }

    /**
     * TODO 
     * пометить на удаление или вернуть назад
     * */
    static async stateNews(id, enabled, deleted) {
        return await $api.post(`/news/delete/${id}`, {
            enabled, deleted
        });
    }

    /**
     * TODO 
     * обновить фото новости
     * */
     static async changeImage(id,data) {
        return $api.post(`/news/ci/${id}`, data, {
            headers:{
                'Content-Type': 'multipart/form-data'
              }
        });
    }

    /**
     * TODO 
     * обновить дату новости
     * */
    static async changeDate(id, date) {
        return await $api.post(`/news/cd/${id}`, {
            date
        });
    }

        /**
     * TODO 
     * обновить данные новости
     * */
         static async updateNews(id, title, details) {
            return await $api.post(`/news/update/${id}`, {
                title, details
            });
        }

}