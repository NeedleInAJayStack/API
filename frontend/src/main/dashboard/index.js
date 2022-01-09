import { useAuth } from "../auth";

export default function Dashboard() {
	let auth = useAuth();

	return (
		<h3>Logged in as {auth.state.user}</h3>
	);
}