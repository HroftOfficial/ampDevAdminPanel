import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';

export const TomsList = ({ group, selected, setSelected }) => {
	const handleSkillChange = (event) => {
		// const index = skills?.indexOf(event.target.value);
		const index = selected?.findIndex((el) => el.id === event.target.id);
		if (index === -1) {
			setSelected((prevState) => [
				...prevState,
				{ name: event.target.name, id: event.target.id },
			]);
		} else {
			setSelected(selected?.filter((skill) => skill.id !== event.target.id));
		}
	};
	return (
		<>
			{group?.items.map((item) => (
				<FormControlLabel
					sx={{ width: '100%' }}
					key={item.id_name}
					id={item.id_name}
					name={item.name}
					control={
						<Checkbox
							id={item.id_name}
							// defaultChecked={
							// 	props.selected.includes(item.id_name) ? true : false
							// }
							checked={Boolean(selected?.find((el) => el.id === item?.id_name))}
							onChange={handleSkillChange}
							name={item.name}
						/>
					}
					label={item?.name}
				/>
			))}
		</>
	);
};
