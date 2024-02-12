import { Layout, Spin } from 'antd';
import AppHeader from '../appHeader/AppHeader';
import AppSider from '../appSider/AppSider';
import AppContent from '../AppContent';
import { useContext } from 'react';
import CryptoContext from '../../../context/crypto-context';

export default function AppLayout() {
	const { isLoading } = useContext(CryptoContext);
	return isLoading ? (
		<Spin fullscreen />
	) : (
		<Layout>
			<AppHeader />
			<Layout>
				<AppSider />
				<AppContent />
			</Layout>
		</Layout>
	);
}
