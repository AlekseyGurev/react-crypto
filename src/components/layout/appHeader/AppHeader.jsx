import { Layout, Select, Space, Button, Modal, Drawer } from 'antd';
import styles from './AppHeader.module.css';
import { useCrypto } from '../../../context/crypto-context';
import { useEffect, useState } from 'react';
import CryptoInfoModal from '../cryptoInfoModal/CryptoInfoModal';
import AddAssetForm from '../addAssetForm/AddAssetForm';

export default function AppHeader() {
	const { crypto } = useCrypto();
	const [select, setSelect] = useState(false);
	const [coin, setCoin] = useState('');
	const [modal, setModal] = useState(false);
	const [drawer, setDrawer] = useState(false);
	const handleSelect = (value) => {
		setCoin(crypto.find((c) => c.id === value));
		setModal(true);
	};

	useEffect(() => {
		const keypress = (event) => {
			if (event.key === '/') {
				setSelect((prev) => !prev);
			}
		};

		document.addEventListener('keypress', keypress);
		return () => document.removeEventListener('keypress', keypress);
	}, []);
	return (
		<Layout.Header className={styles.headerStyle}>
			<Select
				style={{
					width: '20%',
				}}
				open={select}
				onSelect={handleSelect}
				onClick={() => setSelect((prev) => !prev)}
				value="press/ to open"
				options={crypto.map((coin) => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon,
				}))}
				optionRender={(option) => (
					<Space>
						<img
							style={{ width: 20 }}
							src={option.data.icon}
							alt={option.data.label}
						/>{' '}
						{option.data.label}
					</Space>
				)}
			/>
			<Button type="primary" onClick={() => setDrawer(true)}>
				Add Asset
			</Button>
			<Modal open={modal} onCancel={() => setModal(false)} footer={null}>
				<CryptoInfoModal coin={coin} />
			</Modal>
			<Drawer
				title="Add Asset"
				width={600}
				onClose={() => setDrawer(false)}
				open={drawer}
			>
				<AddAssetForm />
			</Drawer>
		</Layout.Header>
	);
}
