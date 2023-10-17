import $api from "../http";

export default class ReklamaService {

  static async getReklamas() {
    return await $api.get('/ad');
  }

  static async getReklamaById(id) {
    return await $api.get(`/ad/${id}`);
  }

  static async addReklama(data) {
    return await $api.post('/ad/add', data);
  }

  static async updateReklama(id, data) {
    return await $api.put(`/ad/update/${id}`, data);
  }

  static async stateReklama(id, data) {
    return await $api.post(`/ad/state/${id}`, data);
  }

  static async deleteReklama(id) {
    return await $api.delete(`/ad/delete/${id}`);
  }

}
