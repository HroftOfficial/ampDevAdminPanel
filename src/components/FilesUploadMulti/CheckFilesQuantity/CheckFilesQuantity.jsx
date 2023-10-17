export const CheckFilesQuantity = ({ needPhoto, manyPhoto, manyFiles }) => {
	if (needPhoto) {
		return (
			<div style={{ margin: '0 auto', marginTop: 30 }}>
				<b style={{ color: 'red' }}>
					Необходимо добавить хотя бы одно изображение!
				</b>
			</div>
		);
	}
	if (manyPhoto) {
		return (
			<div style={{ margin: '0 auto', marginTop: 30 }}>
				<b style={{ color: 'red' }}>Слишком много изображений (Максимум 10!)</b>
			</div>
		);
	}
	if (manyFiles) {
		return (
			<div style={{ margin: '0 auto', marginTop: 30 }}>
				<b style={{ color: 'red' }}>Слишком много файлов (Максимум 10!)</b>
			</div>
		);
	}

	return null;
};
