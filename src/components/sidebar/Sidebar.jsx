import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import {
	PrecisionManufacturing,
	PermIdentity,
	AttachMoney,
	Newspaper,
	ChatBubbleOutline,
	Groups,
} from '@mui/icons-material';
export default function Sidebar() {
	return (
		<div className="sidebar">
			<div className="sidebarWrapper">
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Пользователи</h3>
					<ul className="sidebarList">
						<NavLink to="/users" className="link">
							<li className="sidebarListItem">
								<PermIdentity className="sidebarIcon" />
								Администраторы
							</li>
						</NavLink>
						{/* пользователи портала  */}
						<NavLink to="/usersPortals" className="link">
							<li className="sidebarListItem">
								<PermIdentity className="sidebarIcon" />
								Пользователи
							</li>
						</NavLink>
						<NavLink to="/chats" className="link">
							<li className="sidebarListItem">
								<ChatBubbleOutline className="sidebarIcon" />
								Чаты
							</li>
						</NavLink>
					</ul>
				</div>
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Новые справочники</h3>

					<ul className="sidebarList">
						<NavLink to="/workGroup" className="link">
							<li className="sidebarListItem">
								<Groups className="sidebarIcon" />
								Группы предприятий
							</li>
						</NavLink>
						<NavLink to="/plantMainGroups" className="link">
							<li className="sidebarListItem">
								<Groups className="sidebarIcon" />
								Основные группы оборудования
							</li>
						</NavLink>
						<NavLink to="/plantGroupsNew" className="link">
							<li className="sidebarListItem">
								<Groups className="sidebarIcon" />
								Группы оборудования
							</li>
						</NavLink>
						<NavLink to="/plantNew" className="link">
							<li className="sidebarListItem">
								<PrecisionManufacturing className="sidebarIcon" />
								Оборудование
							</li>
						</NavLink>
						<h3 className="sidebarTitle">Мех обработка</h3>
						<NavLink to="/tomsGroup" className="link">
							<li className="sidebarListItem">
								<Groups className="sidebarIcon" />
								Виды мех обработки(группы)
							</li>
						</NavLink>
						<NavLink to="/toms" className="link">
							<li className="sidebarListItem">
								<Groups className="sidebarIcon" />
								Виды мех обработки
							</li>
						</NavLink>
					</ul>
				</div>
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Рабочая область</h3>
					<ul className="sidebarList">
						<NavLink to="/zakazes" className="link">
							<li className="sidebarListItem">
								<AttachMoney className="sidebarIcon" />
								Заказы
							</li>
						</NavLink>
						<NavLink to="/telegram" className="link">
							<li className="sidebarListItem">
								<AttachMoney className="sidebarIcon" />
								Заказы - телеграм
							</li>
						</NavLink>
						<NavLink to="/news" className="link">
							<li className="sidebarListItem">
								<Newspaper className="sidebarIcon" />
								Новости
							</li>
						</NavLink>
						<NavLink to="/reklama" className="link">
							<li className="sidebarListItem">
								<Newspaper className="sidebarIcon" />
								Реклама
							</li>
						</NavLink>
					</ul>
				</div>
			</div>
		</div>
	);
}
