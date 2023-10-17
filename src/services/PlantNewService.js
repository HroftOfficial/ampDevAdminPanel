import $api from '../http';
// import axios from 'axios';
// import {AuthResponse} from "../models/response/AuthResponse";

const PLANT_URL = '/plant_ap';

export default class PlantNewService {
	/**
	 * TODO
	 * создать новуое оборудование
	 */
	static async createPlantWitchFile(data) {
		return await $api.post(`${PLANT_URL}/create`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	/**
	 * TODO
	 * обновляем оборудование
	 */
	static async updateAll(data, id) {
		return $api.post(`${PLANT_URL}/update/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	/**
	 * TODO
	 * получить все оборудование
	 */
	static async fetchPlants() {
		const result = await $api.get(`${PLANT_URL}`);
		return result;
	}
	/**
	 * TODO
	 * получить оборудование по его ID
	 */
	static async fetchItemPlant(id) {
		const result = await $api.get(`${PLANT_URL}/${id}`);
		return result;
	}

	/**
	 * TODO
	 * пометить на удаление или вернуть назад
	 * */
	static async deletedPlant(id, deleted) {
		return await $api.post(`${PLANT_URL}/delete/${id}`, {
			deleted,
		});
	}
	static async enabledPlant(id, enabled) {
		return await $api.post(`${PLANT_URL}/enabled/${id}`, {
			enabled,
		});
	}

	/**
	 * TODO
	 * Удалить имеющиеся файлы при редактировании
	 * */
	static async deletePlantFile(id, data) {
		return await $api.post(`${PLANT_URL}/deletef/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	/**
	 * получить историю изменения оборудования
	 */
	static async getHistory(id) {
		return await $api.get(`${PLANT_URL}/history/${id}`);
	}

	/**
	 * TODO
	 * смена населенного пункта
	 * */
	static async changeCities(id, cities) {
		return await $api.post(`${PLANT_URL}/cs/${id}`, { cities });
	}

	// /**
	//  * TODO
	//  * узнаем количество элементов оборудования * 10.
	//  * Для рекомендации в поле "номер сортировки"
	//  * */

	// static getCountPlant() {
	//     const response = $api.get('/plant/sort');
	//     return response?.data
	// }

	// static async create(name, sortNumber, enabled) {
	// 	return $api.post(`${PLANT_URL}/create`, { name, sortNumber, enabled });
	// }

	// static fetchUsersAmp() {
	// 	const result = $api.get('/usersamp');
	// 	return result;
	// }

	// static fetchItemUser(id) {
	// 	const result = $api.post(`/users/${id}`);
	// 	return result;
	// }

	// static async update(name, email, position, enabled, id) {
	// 	return $api.post(`/users/update/${id}`, { name, email, position, enabled });
	// }

	// static async changePassword(password, id) {
	// 	return $api.post(`/users/update_password/${id}`, { password });
	// }
}
