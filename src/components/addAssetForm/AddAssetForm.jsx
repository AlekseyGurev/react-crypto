import {
	Select,
	Space,
	Divider,
	Form,
	Button,
	InputNumber,
	DatePicker,
	Result,
} from 'antd';
import { useCrypto } from '../../context/crypto-context';
import { useRef, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import CoinInfo from '../ui/coinIfo/CoinInfo';

export default function AddAssetForm({ onClose }) {
	const [form] = useForm();
	const [coin, setCoin] = useState(null);
	const [isResult, setIsResult] = useState(false);
	const assetRef = useRef();
	const { crypto, addAsset } = useCrypto();

	const handleSelect = (value) => {
		setCoin(crypto.find((c) => c.id === value));
	};

	const onFinish = (values) => {
		const newAsset = {
			id: coin.id,
			amount: values.amount,
			price: values.price,
			date: values.date?.$d ?? new Date(),
		};
		assetRef.current = newAsset;
		setIsResult(true);
		addAsset(newAsset);
	};

	function handleAmountChange(value) {
		const price = form.getFieldValue('price');
		form.setFieldsValue({
			total: +(value * price).toFixed(2),
		});
	}

	function handlePriceChange(value) {
		const amount = form.getFieldValue('amount');
		form.setFieldsValue({
			total: +(amount * value).toFixed(2),
		});
	}

	const validateMessages = {
		required: "'${label}' is required!",
		types: {
			number: "'${label}' is not valid number",
		},
		number: {
			range: "'${label}' must be between '${min}' and '${max}'",
		},
	};

	if (isResult) {
		return (
			<Result
				status="success"
				title="New Asset Added"
				subTitle={`
					Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}
				`}
				extra={[
					<Button type="primary" key="console" onClick={onClose}>
						Close
					</Button>,
				]}
			/>
		);
	}

	if (!coin) {
		return (
			<Select
				style={{
					width: '100%',
				}}
				onSelect={handleSelect}
				value="Select coin"
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
		);
	}

	return (
		<Form
			form={form}
			name="basic"
			labelCol={{
				span: 4,
			}}
			wrapperCol={{
				span: 10,
			}}
			style={{
				maxWidth: 600,
			}}
			initialValues={{
				price: +coin.price.toFixed(2),
			}}
			onFinish={onFinish}
			validateMessages={validateMessages}
		>
			<Divider />
			<CoinInfo coin={coin} />
			<Form.Item
				label="Amount"
				name="amount"
				rules={[
					{
						required: true,
						type: 'number',
						min: 0,
					},
				]}
			>
				<InputNumber
					placeholder="Enter coin amount"
					onChange={handleAmountChange}
					style={{ width: '100%' }}
				/>
			</Form.Item>

			<Form.Item label="Price" name="price">
				<InputNumber onChange={handlePriceChange} style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label="Date & Time" name="date">
				<DatePicker showTime style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label="Total" name="total">
				<InputNumber disabled style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit">
					Add Asset
				</Button>
			</Form.Item>
		</Form>
	);
}
