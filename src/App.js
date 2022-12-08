import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Home from "./components/Home";

const App = () => {
	return (
		<div className="app">
			<BrowserRouter>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
