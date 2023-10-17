import $api from "../http";

export default class ChatService {

/**получить все чаты которые имеются */
  static async getChats() {
    return await $api.get('/chats/all_chats');
  }

  /**получить чат по ID */
  static async getChatItem(id) {
    return await $api.get(`/messages/${id}`)
}

}