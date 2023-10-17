import $api from '../http';

const PLANT_GROUP_URL = '/plant_group_ap';

export default class PlantGroupNewService {
	/**
	 * активировать-деактивировать группу оборудования adm
	 */
	static async statePlantPortal(id, enabled) {
		return await $api.post(`${PLANT_GROUP_URL}/state/${id}`, {
			enabled,
		});
	}

	/**
	 * смена логотипа оборудования adm
	 */
	// обновляем логотип
	static async changeImage(id, data) {
		return $api.post(`${PLANT_GROUP_URL}/cl/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	/**
	 * TODO
	 * создать новую группу оборудования
	 */
	static async createPlantGroupWitchFile(data) {
		return $api.post(`${PLANT_GROUP_URL}/create`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}
	/**
	 *
	 * TODO
	 * получить данные для ListGroup
	 */
	static fetchPlantsGroup() {
		const result = $api.get(PLANT_GROUP_URL);
		return result;
	}
	/**
	 * TODO
	 * получить данные для item по id для группы оборудования
	 */
	static fetchItemPlantGroup(id) {
		const result = $api.post(`${PLANT_GROUP_URL}/${id}`);
		return result;
	}

	/**
	 * TODO
	 * обновить данные для item по id для группы оборудования
	 */
	static async updateAll(data, id) {
		return $api.post(`${PLANT_GROUP_URL}/update_all/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async statePlantGroup(id, enabled) {
		return await $api.post(`${PLANT_GROUP_URL}/delete/${id}`, {
			enabled,
		});
	}
}
