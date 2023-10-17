import React from 'react';

const ErrorMessage = ({ message }) => {
	return (
		<div
			style={{
				fontSize: '2rem',
				fontWeight: 500,
				color: 'red',
				textAlign: 'center',
			}}
		>
			{message}
		</div>
	);
};

export default ErrorMessage;
