import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Root from "./pages/Root";

const App: React.FC = () => {
	return (
		<DndProvider backend={HTML5Backend}>
			<Root />
		</DndProvider>
	);
};

export default App;
