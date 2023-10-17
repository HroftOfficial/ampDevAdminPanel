import $api from '../http';
import config from '../settings/config';
// import axios from 'axios';
// import {AuthResponse} from "../models/response/AuthResponse";

export default class UserServicePortal {
	//

	/**
	 * активировать-деактивировать пользователя портала
	 */
	static async stateUserPortal(id, enabled) {
		return await $api.post(`/${config?.userPrefix}/state/${id}`, {
			enabled,
		});
	}

	/**
	 * пометка на удаление пользователя
	 */
	static async deleteUserPortal(id, deleted) {
		return await $api.post(`/${config?.userPrefix}/delete/${id}`, {
			deleted,
		});
	}

	/**
	 * признак служебного пользователя
	 */
	static async serviceUserPortal(id, service) {
		return await $api.post(`/${config?.userPrefix}/service/${id}`, {
			service,
		});
	}

	/**
	 * отправить на почту пользователю новый пароль
	 */
	static async changePassword(id, email) {
		return await $api.post(`/${config?.userPrefix}/cp/${id}`, { email });
	}

	//    * TODO
	//    * удаляем пользователя по его ID
	//    */
	//   static async deleteUserAmp(id) {
	//     return await $api.post(`/${config?.userPrefix}/delete/${id}`);
	//   }

	static async stateService(id, service) {
		return await $api.post(`/${config?.userPrefix}/service/${id}`, {
			service,
		});
	}

	static async getToms() {
		return await $api.get(`/${config?.userPrefix}/toms`);
	}

	static async getWorkGroup() {
		return await $api.get('/work_group');
	}

	/**
	 * TODO
	 * создать нового пользователя
	 */
	static async createUserAmp(data) {
		return $api.post(`/${config?.userPrefix}/registration`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async updateUserAmp(id, data) {
		return $api.post(
			`/${config?.userPrefix}/update/${id}`,
			data
			// ,  {
			//     headers:{
			//         'Content-Type': 'multipart/form-data'
			//       }
			// }
		);
	}

	// обновляем логотип
	static async changeImage(id, data) {
		return $api.post(`/${config?.userPrefix}/cl/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static getUserAmpToId(id) {
		const result = $api.get(`/${config?.userPrefix}/get_user_adm/${id}`);
		return result;
	}

	static fetchUsers() {
		const result = $api.get(`/${config?.userPrefix}`); // ========================================================================>
		return result;
	}

	static fetchInhereUser() {
		const result = $api.get(`/${config?.userPrefix}/iu`);
		return result;
	}

	/**
	 * TODO
	 * смена населенного пункта
	 * */
	static async changeCities(id, cities) {
		return await $api.post(`/${config?.userPrefix}/cs/${id}`, { cities });
	}

	/**
	 * TODO
	 * смена сортировки
	 * */
	static async changeSortNumber(id, formData) {
		return await $api.post(
			`/${config?.userPrefix}/extended_sorting/${id}`,
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true,
			}
		);
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
		const result = $api.post(`/${config?.userPrefix}/${id}`);
		return result;
	}

	static async update(name, email, position, enabled, id) {
		return $api.post(`/${config?.userPrefix}/update/${id}`, {
			name,
			email,
			position,
			enabled,
		});
	}

	// static async changePassword(password, id) {
	//     return $api.post(`/users/update_password/${id}`,{password})
	// }
}
