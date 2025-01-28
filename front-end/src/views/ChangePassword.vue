<template>
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
        <v-card class="pa-8" width="600">
            <v-card-title>Alterar Senha</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="changePassword">
                    <v-text-field v-model="currentPassword"
                                  label="Senha Atual"
                                  type="password"
                                  outlined />
                    <v-text-field v-model="newPassword"
                                  label="Nova Senha"
                                  type="password"
                                  outlined />
                    <v-text-field v-model="confirmPassword"
                                  label="Confirmar Nova Senha"
                                  type="password"
                                  outlined />
                    <v-btn type="submit" class="mt-4" block color="primary">
                        Alterar Senha
                    </v-btn>
                </v-form>
                <v-alert v-if="message" :type="alertType" class="mt-4">
                    {{ message }}
                </v-alert>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ChangePassword",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      message: "",
      alertType: "info",
    };
  },
        methods: {
            async changePassword() {
                this.error = "";
                if (!this.currentPassword || !this.newPassword) {
                    this.error = "Por favor, preencha todos os campos.";
                    return;
                }

                try {
                    const token = localStorage.getItem("token"); // Certifique-se de que o token está armazenado
                    const response = await axios.post(
                        "/api/auth/change-password",
                        {
                            currentPassword: this.currentPassword,
                            newPassword: this.newPassword,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Inclua o token no cabeçalho
                            },
                        }
                    );
                    this.message = response.data.message || "Senha alterada com sucesso!";
                } catch (error) {
                    this.error = error.response?.data?.message || "Erro ao alterar senha.";
                }
            },
  },
};
</script>
