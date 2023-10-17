import $api from '../http';

export default class ZakazService {
	/**
	 * активировать-деактивировать заказ
	 */
	static async stateZakaz(id, enabled) {
		console.log('state zakaz');
		return await $api.post(`/zakazes/state/${id}`, {
			enabled,
		});
	}

	/**
	 * пометка на удаление заказа
	 */
	static async deleteZakaz(id, deleted) {
		console.log('delete zakaz');
		return await $api.post(`/zakazes/delete/${id}`, {
			deleted,
		});
	}

	static async addZakaz(data) {
		return await $api.post('/zakazes/add_zakazes_adm/', data);
	}

	static async editZakaz(id, data) {
		return await $api.put(`/zakazes/update_zakaz_adm/${id}`, data);
	}

	/**смена фото телеграм */
	static async changeImageTelegram(id, data) {
		return await $api.post(`/zakazes/update_telegram/${id}`, data);
	}

	/**передаем id для публикации в телеграм */
	static async pullTelegram(id) {
		return await $api.post(`/telegram/${id}`);
	}

	/**
	 * TODO
	 * получить все закзаы
	 */
	static fetchZakazes() {
		const result = $api.get('/zakazes');
		return result;
	}

	/**
	 * получить историю заказа
	 */
	static async getHistory(id) {
		return await $api.get(`/zakazes/history/${id}`);
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
			service,
		});
	}

	static async getToms() {
		return await $api.get('/users_amp/toms');
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
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async updateUserAmp(id, data) {
		return $api.post(
			`/users_amp/update/${id}`,
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
		return $api.post(`/users_amp/cl/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
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
		return await $api.post(`/users_amp/cp/${id}`, { email });
	}

	/**
	 * TODO
	 * смена населенного пункта
	 * */
	static async changeCities(id, cities) {
		return await $api.post(`/users_amp/cs/${id}`, { cities });
	}

	/**
	 * TODO
	 * Удалить имеющиеся файлы при редактировании
	 * */
	static async deleteZakazFile(id, data) {
		return await $api.post(`/zakazes/deletef/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
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

	static async update(name, email, position, enabled, id) {
		return $api.post(`/users/update/${id}`, { name, email, position, enabled });
	}

	// static async changePassword(password, id) {
	//     return $api.post(`/users/update_password/${id}`,{password})
	// }
}
