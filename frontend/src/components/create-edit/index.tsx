import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid2";
import { object, string } from "yup";
import { Form, Formik, FormikValues } from "formik";
import TextFieldWrapper from "../text-field";
import DatePicker from "../date-picker";
import { useCallback, useMemo, useState } from "react";
import ImageInput from "../image-input";
import { useUsers } from "../../hooks/users";
import { Casino } from "@mui/icons-material";
import { Stack, Tooltip } from "@mui/material";
import dayjs from "dayjs";

interface CreateEditUserProps {
  editingId: number;
  open: boolean;
  onClose: () => void;
}

export default function CreateEditUser({
  editingId,
  open,
  onClose,
}: CreateEditUserProps) {
  const [avatar, setAvatar] = useState<File | undefined>();
  const {
    getRandomUserData,
    getRandomUserLoading,
    createUser,
    updateUser,
    user,
    setUser,
    getUsers,
  } = useUsers();
  const isEditing = useMemo(() => !!editingId, [editingId]);
  const handleClose = useCallback(() => {
    setUser(undefined);
    onClose();
  }, [onClose, setUser]);
  const handleSubmit = useCallback(
    async (values: FormikValues) => {
      if (isEditing) {
        await updateUser();
      } else {
        await createUser({
          name: values.name,
          email: values.email,
          phone: values.phone,
          birthDate: user?.birthDate || "",
          avatar: user?.avatar || "",
        });
      }
      await getUsers();
      handleClose();
    },
    [
      createUser,
      getUsers,
      handleClose,
      isEditing,
      updateUser,
      user?.avatar,
      user?.birthDate,
    ]
  );
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Cadastrar usuário</DialogTitle>
      <Formik
        enableReinitialize
        initialValues={{
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          birthDate: user?.birthDate,
        }}
        validationSchema={object({
          name: string().required("Informe um nome!"),
          email: string().required("Informe um email!"),
          phone: string().required("Informe um telefone!"),
        })}
        onSubmit={handleSubmit}
      >
        <Form>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={6}>
                <ImageInput imgUrl={user?.avatar} setFile={setAvatar} />
              </Grid>
              <Grid size={6}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Tooltip title="Gerar usuário aleatório">
                    <IconButton
                      color="primary"
                      size="large"
                      type="button"
                      onClick={getRandomUserData}
                      disabled={getRandomUserLoading}
                    >
                      <Casino fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid size={6}>
                <TextFieldWrapper
                  name="name"
                  label="Nome"
                  type="text"
                  value={user?.name || ""}
                  required
                  setValue={(value) =>
                    setUser((u) => ({
                      ...u,
                      name: value,
                    }))
                  }
                />
              </Grid>
              <Grid size={6}>
                <TextFieldWrapper
                  name="email"
                  label="Email"
                  type="email"
                  value={user?.email || ""}
                  required
                  setValue={(value) =>
                    setUser((u) => ({
                      ...u,
                      email: value,
                    }))
                  }
                />
              </Grid>
              <Grid size={6}>
                <TextFieldWrapper
                  name="phone"
                  label="Telefone"
                  type="text"
                  value={user?.phone || ""}
                  required
                  setValue={(value) =>
                    setUser((u) => ({
                      ...u,
                      phone: value,
                    }))
                  }
                />
              </Grid>
              <Grid size={6}>
                <DatePicker
                  label="Data de Aniversário"
                  value={user?.birthDate ? dayjs(user?.birthDate) : null}
                  setValue={(value) =>
                    setUser((u) => ({
                      ...u,
                      birthDate: value?.toISOString() || "",
                    }))
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              color="error"
              onClick={handleClose}
              type="button"
            >
              Cancelar
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Salvar
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
}
