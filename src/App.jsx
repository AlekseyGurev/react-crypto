import AppLayout from './components/layout/appLayout/AppLayout';
import { CryptoContextProvider } from './context/crypto-context';

export default function App() {
	return (
		<CryptoContextProvider>
			<AppLayout />
		</CryptoContextProvider>
	);
}
