import { Add, Delete, Edit, Search } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import TablePagination from "@mui/material/TablePagination";
import { useUsers } from "../../hooks/users";
import { useCallback, useState } from "react";
import CreateEditUser from "../create-edit";
import dayjs from "dayjs";
import { User } from "../../interfaces/user";
import { Tooltip } from "@mui/material";

const DEFAULT_CREATE_EDIT_MODAL_PROPS: {
  editingUser: User | undefined;
  open: boolean;
} = {
  editingUser: undefined,
  open: false,
};

export default function UsersList() {
  const [createEditModalProps, setCreateEditModalProps] = useState(
    DEFAULT_CREATE_EDIT_MODAL_PROPS
  );
  const {
    count,
    error,
    setError,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    users,
    deleteUser,
    getUsers,
    search,
    setSearch,
  } = useUsers();
  const closeCreateEditModal = useCallback(() => {
    setCreateEditModalProps(DEFAULT_CREATE_EDIT_MODAL_PROPS);
  }, []);
  const createUser = useCallback(() => {
    setCreateEditModalProps({ open: true, editingUser: undefined });
  }, []);
  const edit = useCallback((editingUser: User) => {
    setCreateEditModalProps({ open: true, editingUser });
  }, []);
  const remove = useCallback(
    async (userId: number) => {
      if (confirm("Tem certeza que deseja remover este usuário?")) {
        await deleteUser(userId);
        await getUsers();
      }
    },
    [deleteUser, getUsers]
  );
  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );
  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [setPage, setRowsPerPage]
  );
  return (
    <>
      <Stack
        width="100%"
        height="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        rowGap={2}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          columnGap={1}
        >
          <Tooltip title="Novo usuário">
            <IconButton color="success" onClick={createUser}>
              <Add />
            </IconButton>
          </Tooltip>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            placeholder="Pesquisar..."
          />
          <Tooltip title="Pesquisar">
            <IconButton color="info">
              <Search />
            </IconButton>
          </Tooltip>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Data de Nascimento</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>
                    <img
                      src={u.avatar}
                      alt="avatar"
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: "50%",
                        border: "solid #777 1px",
                      }}
                    />
                  </TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>
                    {dayjs(u.birthDate).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => edit(u)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        type="button"
                        color="error"
                        onClick={() => remove(u.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Stack>
      <CreateEditUser
        editingUser={createEditModalProps.editingUser}
        open={createEditModalProps.open}
        onClose={closeCreateEditModal}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError("")}
        message={error}
      />
    </>
  );
}
