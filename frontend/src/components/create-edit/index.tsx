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
import { useCallback, useEffect, useMemo, useState } from "react";
import ImageInput from "../image-input";
import { useUsers } from "../../hooks/users";
import { Casino } from "@mui/icons-material";
import { Stack, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { User } from "../../interfaces/user";

interface CreateEditUserProps {
  editingUser: User | undefined;
  open: boolean;
  onClose: () => void;
}

export default function CreateEditUser({
  editingUser,
  open,
  onClose,
}: CreateEditUserProps) {
  const [avatar, setAvatar] = useState<File | undefined>();
  const {
    getRandomUserData,
    getRandomUserLoading,
    createOrUpdateUserLoading,
    createUser,
    updateUser,
    user,
    setUser,
    getUsers,
    uploadAvatar,
  } = useUsers();
  const isEditing = useMemo(() => !!editingUser, [editingUser]);
  const handleClose = useCallback(() => {
    setUser(undefined);
    setAvatar(undefined);
    onClose();
  }, [onClose, setUser]);
  const handleSubmit = useCallback(
    async (values: FormikValues) => {
      let avatarUrl: string | undefined = "";
      if (avatar) {
        avatarUrl = await uploadAvatar(avatar);
      }
      const createOrUpdateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: user?.birthDate || "",
        avatar: avatarUrl || user?.avatar || "",
      };
      if (isEditing) {
        await updateUser(editingUser!.id, createOrUpdateData);
      } else {
        await createUser(createOrUpdateData);
      }
      await getUsers();
      handleClose();
    },
    [
      avatar,
      createUser,
      editingUser,
      getUsers,
      handleClose,
      isEditing,
      updateUser,
      uploadAvatar,
      user?.avatar,
      user?.birthDate,
    ]
  );
  useEffect(() => {
    if (editingUser) {
      setUser(editingUser);
    }
  }, [editingUser, open, setUser]);
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
              disabled={createOrUpdateUserLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={createOrUpdateUserLoading}
            >
              Salvar
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
}
