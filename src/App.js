import React from 'react';
import './App.css';
import RequireAuth from './hoc/RequireAuth';
import { AuthProvider } from './hoc/AuthProvider';
import { observer } from 'mobx-react-lite';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';

import Login from './pages/login/Login';
import Home from './pages/home/Home';
import UserList from './pages/userDomain/userList/UserList';
import User from './pages/userDomain/user/User';
import NewUser from './pages/userDomain/newUser/NewUser';
import { SortUser } from './pages/userDomain/SortUser/SortUser';

import UserAmp from './pages/userDomain/userAmp/UserAmp';
import NewUserAmp from './pages/userDomain/newUserAmp/NewUserAmp';
import UserListPortals from './pages/userDomain/userListPortals/UserListPortals';

/**
 * Новые справочники start
 */
import { PlantMainGroup } from './pages/plantDomain/plantMainGroup/PlantMainGroup';
import AddPlantMainGroup from './pages/plantDomain/plantMainGroup/AddPlantMainGroup/AddPlantMainGroup';
import EditPlantMainGroup from './pages/plantDomain/plantMainGroup/EditPlantMainGroup/EditPlantMainGroup';
import PlantGroupNew from './pages/plantDomain/plantGroupNew/PlantGroupNew';
import AddPlantGroupNew from './pages/plantDomain/plantGroupNew/AddPlantGroupNew/AddPlantGroupNew';
import EditPlantGroupNew from './pages/plantDomain/plantGroupNew/EditPlantGroupNew/EditPlantGroupNew';
import PlantNew from './pages/plantDomain/plantNew/PlantNew';
import AddPlantNew from './pages/plantDomain/plantNew/addPlantNew/AddPlantNew';
import EditPlantNew from './pages/plantDomain/plantNew/editPlantNew/EditPlantNew';
/**
 * Новые справочники end
 */
/**


/**группа предприятий */
import WorkGroup from './pages/workGroupDomain/workGroup/WorkGroup';
import WorkListGroup from './pages/workGroupDomain/workListGroup/WorkListGroup';
import NewWorkGroup from './pages/workGroupDomain/newWorkGroup/NewWorkGroup';

/**группы видов обработки */
import TomsListGroup from './pages/tomsGroupDomain/tomsListGroup/TomsListGroup';
import TomsGroup from './pages/tomsGroupDomain/tomsGroup/TomsGroup';
import NewTomsGroup from './pages/tomsGroupDomain/newTomsGroup/NewTomsGroup';

/** виды обработки*/
import TomsList from './pages/tomsGroupDomain/tomsList/TomsList';
import NewToms from './pages/tomsGroupDomain/newToms/NewToms';
import Toms from './pages/tomsGroupDomain/toms/Toms';

/**новости */
import NewsList from './pages/newsDomain/newsList/NewsList';
import NewNews from './pages/newsDomain/newNews/NewNews';
import News from './pages/newsDomain/news/News';

/*заказы*/
import ZakazList from './pages/zakazDomain/zakazList/ZakazList';
import AddZakazAdm from './pages/zakazDomain/AddZakaz/AddZakazAdm';
import EditZakaz from './pages/zakazDomain/EditZakaz/EditZakaz';

//telegram
import ZakazTelegramList from './pages/zakazDomain/zakazTelegramList/ZakazTelegramList';

import PageNotFound from './pages/pageNotFound/PageNotFound';

/* Reklama*/
import Reklama from './pages/reklama/ReklamaList';
import NewReklama from './pages/reklama/NewReklama';
import EditReklama from './pages/reklama/EditReklama';

/**Chat page */
import Chat from './pages/chat/Chat';

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route element={<RequireAuth />}>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="users" element={<UserList />} />
						<Route path="user/:id" element={<User />} />
						<Route path="newUser" element={<NewUser />} />
						<Route path="usersPortals" element={<UserListPortals />} />
						<Route path="usersPortals/sortUser" element={<SortUser />} />
						<Route path="usersPortals/:id" element={<UserAmp />} />
						<Route
							path="usersPortals/newUsersPortals"
							element={<NewUserAmp />}
						/>
						<Route path="chats" element={<Chat />} />

						{/* новые справочники */}
						<Route path="plantMainGroups" element={<PlantMainGroup />} />
						<Route
							path="plantMainGroups/addPlantMainGroup"
							element={<AddPlantMainGroup />}
						/>
						<Route
							path="plantMainGroups/:id"
							element={<EditPlantMainGroup />}
						/>

						<Route path="plantGroupsNew" element={<PlantGroupNew />} />
						<Route
							path="plantGroupsNew/addPlantGroupNew"
							element={<AddPlantGroupNew />}
						/>
						<Route path="plantGroupsNew/:id" element={<EditPlantGroupNew />} />
						<Route path="plantNew" element={<PlantNew />} />
						<Route path="plantNew/addPlant" element={<AddPlantNew />} />
						<Route path="plantNew/:id" element={<EditPlantNew />} />

						{/* новые справочники */}
						<Route path="workGroup" element={<WorkListGroup />} />
						<Route path="workGroup/:id" element={<WorkGroup />} />
						<Route path="workGroup/newWorkGroup" element={<NewWorkGroup />} />
						<Route path="tomsGroup" element={<TomsListGroup />} />
						<Route path="tomsGroup/:id" element={<TomsGroup />} />
						<Route path="tomsGroup/newTomsGroup" element={<NewTomsGroup />} />
						<Route path="toms" element={<TomsList />} />
						<Route path="toms/:id" element={<Toms />} />
						<Route path="toms/newToms" element={<NewToms />} />
						<Route path="news" element={<NewsList />} />
						<Route path="news/:id" element={<News />} />
						<Route path="news/newNews" element={<NewNews />} />
						<Route path="zakazes" element={<ZakazList />} />
						<Route path="zakazes/new" element={<AddZakazAdm />} />
						<Route path="zakazes/edit/:id" element={<EditZakaz />} />
						<Route path="reklama" element={<Reklama />} />
						<Route path="reklama/new" element={<NewReklama />} />
						<Route path="reklama/edit/:id" element={<EditReklama />} />
						<Route path="telegram" element={<ZakazTelegramList />} />
						<Route path="*" element={<PageNotFound />} />
					</Route>
				</Route>
			</Routes>
		</AuthProvider>
	);
}

export default observer(App);
