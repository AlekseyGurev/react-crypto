import { useEffect, useState, createContext, useContext } from 'react';
import { fakeFetchCrypto, fakeAssets } from '../api';
import { percentDifference } from '../utils';

const CryptoContext = createContext({
	assets: [],
	crypto: [],
	isLoading: false,
});

export function CryptoContextProvider({ children }) {
	const [isLoading, setIsLoading] = useState(false);
	const [crypto, setCrypto] = useState([]);
	const [assets, setAssets] = useState([]);

	function mapAssets(assets, result) {
		return assets.map((asset) => {
			const coin = result.find((c) => c.id === asset.id);
			return {
				grow: asset.price < coin.price,
				growPercent: percentDifference(asset.price, coin.price),
				totalAmount: asset.amount * coin.price,
				totalProfit: asset.amount * coin.price - asset.amount * asset.price,
				...asset,
			};
		});
	}

	function addAsset(newAsset) {
		setAssets((prev) => mapAssets([...prev, newAsset], crypto));
	}

	useEffect(() => {
		async function getData() {
			setIsLoading(true);
			try {
				const { result } = await fakeFetchCrypto();
				const assets = await fakeAssets();

				setAssets(mapAssets(assets, result));
				setCrypto(result);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
		getData();
	}, []);
	return (
		<CryptoContext.Provider value={{ isLoading, crypto, assets, addAsset }}>
			{children}
		</CryptoContext.Provider>
	);
}

export default CryptoContext;

export function useCrypto() {
	return useContext(CryptoContext);
}
