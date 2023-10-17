import $api from "../http";
import config from "../settings/config";
// import {AxiosResponse} from 'axios';
// import {AuthResponse} from "../models/response/AuthResponse";

export default class UserAdmService {
  static async createAdmin(name, email, password, position) {
    return await $api.post(`/${config?.adminPrefix}/registration`, {
      name,
      email,
      password,
      position,
    });
  }

  static async create(name, email, position, password, enabled) {
    return $api.post(`/${config?.adminPrefix}/registration`, {
      name,
      email,
      position,
      password,
      enabled,
    });
  }

  static async registration(email, password) {
    return $api.post(`/${config?.adminPrefix}/registration`, {
      email,
      password,
    });
  }

  static async logout() {
    return $api.post(`/${config?.adminPrefix}/logout`);
  }

  static async fetchDataToId(id) {
    return $api.get(`/${config?.adminPrefix}/${id}`);
  }

  /**
   * активировать - деактивировать пользователя adm
   */
  static async stateUserPortal(id, state) {
    return await $api.post(`/${config?.adminPrefix}/state/${id}`, {
      state,
    });
  }

  static async stateUserAdmin(id, state) {
    return await $api.post(`/${config?.adminPrefix}/admin/${id}`, {
      state,
    });
  }

  /**
   * удаление пользователя
   */
  static async deleteUser(id) {
    return await $api.post(`/${config?.adminPrefix}/delete/${id}`);
  }
}
