import $api from "../http";
export default class PlantGroupService {
    /**
     * TODO
     * создать новую группу оборудования
     */
    static async createPlantGroupWitchFile(data) {
        return $api.post('/plant_group/create', data, {
            headers:{
                'Content-Type': 'multipart/form-data'
              }
        });
    }
    /**
     * 
     * TODO
     * получить данные для ListGroup
     */
    static fetchPlantsGroup() {
        const result = $api.get('/plant_group');
        return result;
    }
    /**
     * TODO
     * получить данные для item по id для группы оборудования
     */
     static fetchItemPlantGroup(id) {
        const result = $api.post(`/plant_group/${id}`);
        return result;
    }

    /**
     * TODO
     * обновить данные для item по id для группы оборудования
     */
    static async updateAll(data, id) {
        return $api.post(`plant_group/update_all/${id}`, data, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async statePlantGroup(id, enabled) {
        return await $api.post(`/plant_group/delete/${id}`, {
            enabled
        });
    }

}

