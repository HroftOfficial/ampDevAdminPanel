import $api from '../http';

const PLANT_MAIN_GROUP_URL = '/main_plant';

export default class PlantMainGroupService {
	/**
	 * TODO
	 * создать новую основную группу оборудования
	 */
	static async createPlantMainGroup(data) {
		return $api.post(`${PLANT_MAIN_GROUP_URL}/create`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}
	/**
	 *
	 * TODO
	 * получить все основные группы оборудования
	 */
	static fetchPlantsMainGroup() {
		const result = $api.get(`${PLANT_MAIN_GROUP_URL}`);
		return result;
	}
	/**
	 *
	 * TODO
	 * активируем/деактивируем
	 */
	static async statePlantMainPortal(id, enabled) {
		return await $api.post(`${PLANT_MAIN_GROUP_URL}/state/${id}`, {
			enabled,
		});
	}
	/**
	 * TODO
	 * получить данные для item по id для группы оборудования
	 */
	static fetchItemPlantMainGroup(id) {
		const result = $api.post(`${PLANT_MAIN_GROUP_URL}/${id}`);
		return result;
	}

	/**
	 *
	 * TODO
	 * обновляем основную группу оборудования
	 */
	static async updatePlantMainGroup(data, id) {
		return $api.post(`${PLANT_MAIN_GROUP_URL}/update_all/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async changeImage(id, data) {
		return $api.post(`${PLANT_MAIN_GROUP_URL}/cl/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}
}
