import { formatRelative } from 'date-fns';
import { ru } from 'date-fns/locale';

import classes from './Message.module.css';

export const Message = ({ message, own }) => {
	return (
		<div
			className={
				own ? `${classes.message} ${classes.own}` : `${classes.message}`
			}
		>
			<div
				className={own ? `${classes.messageTopOwn}` : `${classes.messageTop}`}
			>
				{/* <Avatar sx={{ width: 30, height: 30 }} /> */}
				<div className={classes.messageText}>		
					{message?.title && (
						<div
							className={
								own ? `${classes.themeTextOwn}` : `${classes.themeText}`
							}
						>
							{message?.title}
						</div>
					)}
						<div className={classes.senderName}>
							{message?.senderNamePretty}
						</div>
					{message?.text}
					<div
						className={
							own ? `${classes.messageBottomOwn}` : `${classes.messageBottom}`
						}
					>
						{message?.createdAt &&
							formatRelative(new Date(message?.createdAt), new Date(), {
								locale: ru,
							})}
					</div>
				</div>
			</div>
		</div>
	);
};
