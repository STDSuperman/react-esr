import { useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "./logo.svg";
import "./index.css";
import {
	DatePicker,
	Space,
	Button,
	Rate,
	Card,
	Avatar,
	Descriptions,
	Badge,
} from "antd";
import {
	EditOutlined,
	EllipsisOutlined,
	SettingOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const { RangePicker } = DatePicker;

function App() {
	const [count, setCount] = useState(0);
	const history = useHistory();

	return (
		<div className="App">
			<Space direction="vertical" size={12}>
				<img src={logo} className="App-logo" alt="logo" />
				<h1>Hello Vite + React!</h1>
				<Space direction="vertical" size={12} className="btn-group">
					<Button onClick={() => history.push("/about")}>
						to about page
					</Button>
					<Button
						onClick={() => {
							setCount((count: number) => count + 1);
						}}
					>
						count is: {count}
					</Button>
				</Space>
				<RangePicker />
				<Rate allowHalf defaultValue={2.5} />
			</Space>
			<div className="body-container">
				<Space direction="vertical" size={12} className="card">
					<Card
						style={{ width: 300 }}
						cover={
							<img
								alt="example"
								src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
							/>
						}
						actions={[
							<SettingOutlined key="setting" />,
							<EditOutlined key="edit" />,
							<EllipsisOutlined key="ellipsis" />,
						]}
					>
						<Meta
							avatar={
								<Avatar src="https://joeschmoe.io/api/v1/random" />
							}
							title="Card title"
							description="This is the description"
						/>
					</Card>
				</Space>
        <Descriptions title="User Info" bordered>
						<Descriptions.Item label="Product">
							Cloud Database
						</Descriptions.Item>
						<Descriptions.Item label="Billing Mode">
							Prepaid
						</Descriptions.Item>
						<Descriptions.Item label="Automatic Renewal">
							YES
						</Descriptions.Item>
						<Descriptions.Item label="Order time">
							2018-04-24 18:00:00
						</Descriptions.Item>
						<Descriptions.Item label="Usage Time" span={2}>
							2019-04-24 18:00:00
						</Descriptions.Item>
						<Descriptions.Item label="Status" span={3}>
							<Badge status="processing" text="Running" />
						</Descriptions.Item>
						<Descriptions.Item label="Negotiated Amount">
							$80.00
						</Descriptions.Item>
						<Descriptions.Item label="Discount">
							$20.00
						</Descriptions.Item>
						<Descriptions.Item label="Official Receipts">
							$60.00
						</Descriptions.Item>
						<Descriptions.Item label="Config Info">
							Data disk type: MongoDB
							<br />
							Database version: 3.4
							<br />
							Package: dds.mongo.mid
							<br />
							Storage space: 10 GB
							<br />
							Replication factor: 3
							<br />
							Region: East China 1<br />
						</Descriptions.Item>
					</Descriptions>
			</div>
		</div>
	);
}

export default App;
