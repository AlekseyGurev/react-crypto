import { Layout, Card, Statistic, List, Typography, Spin, Tag } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { fakeFetchCrypto, fakeAssets } from '../../../api';
import styles from './AppSider.module.css';
import { useEffect, useState } from 'react';
import { percentDifference, capitalize } from '../../../utils';

export default function AppSider() {
	const [isLoading, setIsLoading] = useState(false);
	const [crypto, setCrypto] = useState([]);
	const [assets, setAssets] = useState([]);

	useEffect(() => {
		async function getData() {
			setIsLoading(true);
			try {
				const { result } = await fakeFetchCrypto();
				const assets = await fakeAssets();

				setAssets(
					assets.map((asset) => {
						const coin = result.find((c) => c.id === asset.id);
						return {
							grow: asset.price < coin.price,
							growPercent: percentDifference(asset.price, coin.price),
							totalAmount: asset.amount * coin.price,
							totalProfit:
								asset.amount * coin.price - asset.amount * asset.price,
							...asset,
						};
					}),
				);
				setCrypto(result);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
		getData();
	}, []);

	return isLoading ? (
		<Spin fullscreen />
	) : (
		<Layout.Sider width="25%" className={styles.siderStyle}>
			{assets.map((asset) => (
				<Card key={asset.id} className={styles.card}>
					<Statistic
						title={capitalize(asset.id)}
						value={asset.totalAmount}
						precision={2}
						valueStyle={{ color: asset.grow ? '#3f8600' : '#cf1322' }}
						prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
						suffix="$"
					/>
					<List
						size="small"
						dataSource={[
							{
								title: 'Total Profit',
								value: asset.totalProfit,
								withTag: true,
							},
							{ title: 'Asset Amount', value: asset.amount, isPlain: true },
							// { title: 'Difference', value: asset.growPercent },
						]}
						renderItem={(item) => (
							<List.Item className={styles.listItem}>
								<span>{item.title}</span>
								<span>
									{item.withTag && (
										<Tag color={asset.grow ? 'green' : 'red'}>
											{asset.growPercent}%
										</Tag>
									)}
								</span>

								{item.isPlain && <span>{item.value}</span>}
								{!item.isPlain && (
									<Typography.Text
										type={asset.grow ? 'success' : 'danger'}
									>
										{item.value.toFixed(2)}$
									</Typography.Text>
								)}
							</List.Item>
						)}
					/>
				</Card>
			))}
		</Layout.Sider>
	);
}
