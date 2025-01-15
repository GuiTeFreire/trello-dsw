<template>
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
        <v-card class="pa-8" max-width="400">
            <v-card-title>Redefinir Senha</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="resetPassword">
                    <v-text-field v-model="password"
                                  label="Nova Senha"
                                  type="password"
                                  :error-messages="passwordError"
                                  outlined />
                    <v-text-field v-model="confirmPassword"
                                  label="Confirmar Nova Senha"
                                  type="password"
                                  :error-messages="confirmPasswordError"
                                  outlined />
                    <v-btn type="submit" class="mt-4" block color="primary">
                        Redefinir Senha
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
  name: "ResetPassword",
  data() {
    return {
      password: "",
      confirmPassword: "",
      passwordError: "",
      confirmPasswordError: "",
      message: "",
    };
  },
  methods: {
    async resetPassword() {
      this.passwordError = "";
      this.confirmPasswordError = "";

      if (!this.password) this.passwordError = "A senha é obrigatória.";
      if (this.password !== this.confirmPassword) this.confirmPasswordError = "As senhas não coincidem.";

      if (this.passwordError || this.confirmPasswordError) return;

      try {
        const token = this.$route.query.token; // Token enviado no link
        const response = await axios.post("/api/auth/reset-password", { newPassword: this.password, token });
        this.message = "Senha redefinida com sucesso!";
      } catch (error) {
        this.message = "Erro ao redefinir senha.";
      }
    },
  },
};
</script>
