<template>
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
        <v-card class="pa-8" width="600">
            <v-card-title>Login</v-card-title>
            <v-card-subtitle>Entre com suas credenciais para acessar.</v-card-subtitle>
            <v-card-text>
                <v-form @submit.prevent="processLogin">
                    <v-text-field v-model="form.email"
                                  label="E-mail"
                                  type="email"
                                  :error-messages="emailError"
                                  outlined />
                    <v-text-field v-model="form.password"
                                  label="Senha"
                                  type="password"
                                  :error-messages="passwordError"
                                  outlined />
                    <v-btn type="submit" class="mt-4" block color="primary">
                        Entrar
                    </v-btn>
                </v-form>
                <v-alert v-if="error" type="error" class="mt-4">
                    {{ error }}
                </v-alert>
            </v-card-text>
            <v-card-actions class="d-flex flex-column">
                <router-link to="/forgot-password" class="mt-2">Recuperar senha</router-link>
                <router-link to="/create-account" class="mt-2">Criar conta</router-link>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import axios from "axios";
    import api from '@/services/api'; // Importa o serviço configurado

export default {
  name: "Login",
  data() {
    return {
      form: { email: "", password: "" },
      error: "",
      emailError: "",
      passwordError: "",
    };
  },
  methods: {
    async processLogin() {
      this.error = "";
      this.emailError = "";
      this.passwordError = "";

      if (!this.form.email) this.emailError = "O e-mail é obrigatório.";
      if (!this.form.password) this.passwordError = "A senha é obrigatória.";

      if (this.emailError || this.passwordError) return;

      try {
          const response = await axios.post("/api/auth/login", this.form);
          const token = response.data.token;
          localStorage.setItem("token", token);

        this.$router.push("/boards");
      } catch (err) {
        this.error = err.response?.data?.message || "Erro ao fazer login.";
      }
    },
  },
};
</script>

<style scoped>
     .v-btn {
         transition: all 0.3s ease; /* Suaviza a transição de estados do botão */
     }

     .v-btn:hover {
         transform: translateY(-2px); /* Efeito de levitação ao passar o mouse */
         box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* Sombra mais intensa ao hover */
     }
    .mt-2 {
        margin-top: 8px;
        text-decoration: none;
        color: #1976D2;
        font-size: 0.875rem;
        font-weight: 500; 
    }

    .mt-2:hover {
        text-decoration: underline;
    }
</style>
