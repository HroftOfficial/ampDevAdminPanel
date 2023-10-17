import $api from '../http';
import config from '../settings/config';

export default class AuthService {
	static async login(email, password) {
		return $api.post(`/${config?.adminPrefix}/login`, { email, password });
	}

	static async registration(name, email, position, password, enabled) {
		return $api.post(`/${config?.adminPrefix}/registration`, {
			name,
			email,
			position,
			password,
			enabled,
		});
	}

	static async logout() {
		return $api.post(`/${config?.adminPrefix}/logout`);
	}

	// static fetchUsers(page, limit) {
	//     const result = $api.get(`/users/${page}/${limit}`);
	//     return result;
	// }

	static fetchUsers() {
		const result = $api.get(`/${config?.adminPrefix}`);
		return result;
	}

	// static fetchUsersAmp() {
	//     const result = $api.get('/users_amp');
	//     return result;
	// }

	static fetchItemUser(id) {
		const result = $api.post(`/${config?.adminPrefix}/${id}`);
		return result;
	}

	static async update(name, email, position, enabled, id) {
		return $api.post(`/${config?.adminPrefix}/update/${id}`, {
			name,
			email,
			position,
			enabled,
		});
	}

	static async changePassword(password, id) {
		return $api.post(`/${config?.adminPrefix}/update_password/${id}`, {
			password,
		});
	}

	static async stateUser(id, enabled) {
		return await $api.post(`/${config?.adminPrefix}/delete/${id}`, {
			enabled,
		});
	}
}
