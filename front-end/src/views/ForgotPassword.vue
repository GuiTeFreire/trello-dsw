<template>
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
        <v-card class="pa-8" width="600">
            <v-card-title>Esqueci minha senha</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="requestPasswordReset">
                    <v-text-field v-model="email"
                                  label="E-mail"
                                  type="email"
                                  :error-messages="emailError"
                                  outlined />
                    <v-btn type="submit" class="mt-4" block color="primary">
                        Enviar
                    </v-btn>
                </v-form>
                <v-alert v-if="message" type="info" class="mt-4">
                    {{ message }}
                </v-alert>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      emailError: "",
      message: "",
    };
  },
  methods: {
    async requestPasswordReset() {
      this.emailError = "";
      if (!this.email) {
        this.emailError = "O e-mail é obrigatório.";
        return;
      }
      try {
        const response = await axios.post("/api/auth/forgot-password", { email: this.email });
        this.message = response.data.message || "Se um usuário com este e-mail existir, um link será enviado.";
      } catch (error) {
        this.message = "Erro ao solicitar redefinição de senha.";
      }
    },
  },
};
</script>
