import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import UsersList from "./components/list";
import UsersContextProvider from "./contexts/user";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <UsersContextProvider>
      <UsersList />
    </UsersContextProvider>
    </LocalizationProvider>
  );
}

export default App;
