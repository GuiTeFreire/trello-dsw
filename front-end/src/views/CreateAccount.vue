<template>
  <v-container class="d-flex align-center justify-center" style="height: 100vh;">
    <v-card class="pa-8" width="600">
      <v-card-title>
        Criar Conta
      </v-card-title>
      <v-card-subtitle>
        Preencha as informações abaixo.
      </v-card-subtitle>
      <v-card-text>
        <v-form @submit.prevent="processCreateAccount">
          <v-text-field
            v-model="form.username"
            label="Nome de Usuário"
            :error-messages="usernameError"
            outlined
          />
          <v-text-field
            v-model="form.email"
            label="E-mail"
            type="email"
            :error-messages="emailError"
            outlined
          />
          <v-text-field
            v-model="form.password"
            label="Senha"
            type="password"
            :error-messages="passwordError"
            outlined
          />
          <v-btn type="submit" class="mt-4" block color="primary">
            Criar Conta
          </v-btn>
        </v-form>
        <v-alert v-if="error" type="error" class="mt-4">
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <router-link to="/login" class="ml-auto">
          Já tem conta? Faça login
        </router-link>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import api from '@/services/api'; // Importa o serviço configurado
export default {
  name: 'CreateAccount',
  data() {
    return {
      form: { username: '', email: '', password: '' },
      error: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
    };
  },
  methods: {
    async processCreateAccount() {
      // Reset errors
      this.error = '';
      this.usernameError = '';
      this.emailError = '';
      this.passwordError = '';

      // Validate inputs
      if (!this.form.username) this.usernameError = 'O nome de usuário é obrigatório.';
      if (!this.form.email) this.emailError = 'O e-mail é obrigatório.';
      if (!this.form.password) this.passwordError = 'A senha é obrigatória.';

      // Exit if validation failed
      if (this.usernameError || this.emailError || this.passwordError) return;

      try {
        // API request to register a new user
        await axios.post('/api/auth/register', this.form);
        this.$router.push('/login'); // Redirect to login on success
      } catch (err) {
        // Handle errors
        this.error = err.response?.data?.message || 'Erro ao criar conta.';
      }
    },
  },
};
</script>

<style scoped>
    .ml-auto {
        margin-top: 8px;
        text-decoration: none;
        color: #1976D2;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .ml-auto:hover {
        text-decoration: underline;
    }
</style>
