<template>
    <v-container>
        <v-card class="mx-auto pa-4 elevation-12" max-width="600">
            <v-card-title class="text-h5">Perfil do Usuário</v-card-title>
            <v-card-subtitle>Preencha as informações abaixo para atualizar seu perfil.</v-card-subtitle>

            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="user.username"
                                  label="Nome de Usuário"
                                  :rules="[rules.required]"
                                  outlined
                                  dense></v-text-field>
                    <v-text-field v-model="user.email"
                                  label="E-mail"
                                  type="email"
                                  :rules="[rules.required, rules.email]"
                                  outlined
                                  dense></v-text-field>
                    <v-btn :disabled="!valid"
                           color="success"
                           class="mr-4"
                           @click="updateProfile">
                        Salvar Alterações
                    </v-btn>
                    <router-link to="/change-password" class="caption">
                        <v-btn text color="primary">Alterar Senha</v-btn>
                    </router-link>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>


<script>
    import axios from 'axios';
    import api from '@/services/api'; // Importa o serviço configurado

    export default {
        name: 'UserProfile',
        data() {
            return {
                valid: true,
                user: {
                    username: '',
                    email: '',
                },
                rules: {
                    required: value => !!value || 'Required.',
                    email: value => {
                        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return pattern.test(value) || 'Invalid e-mail.';
                    },
                }
            };
        },
        created() {
            this.fetchUserProfile();
        },
        methods: {
            async fetchUserProfile() {
                try {
                    const token = localStorage.getItem('token');
                    const response = await api.get('/api/users/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    this.user = response.data;
                } catch (error) {
                    console.error('Falha ao acessar os dados do usuário:', error);
                }
            },
            async updateProfile() {
                if (this.$refs.form.validate()) {
                    try {
                        await api.put('/api/users/profile', this.user); // Endpoint para atualizar os dados
                        this.$router.push('/'); // Redirecionar após a atualização
                    } catch (error) {
                        console.error('Falha ao atualizar os dados do usuário:', error);
                    }
                }
            }
        },
    };</script>

<style scoped>
    .caption {
        margin-top: 8px;
        display: flex;
        justify-content: flex-start;
        text-decoration: none;
    }

    .ml-auto {
        margin-left: auto;
    }

    .text-h5 {
        font-size: 1.6rem; /* Tamanho do texto para o título */
        font-weight: bold; /* Negrito para dar ênfase */
    }

    .v-card {
        border-radius: 10px; /* Bordas arredondadas para o card */
        background-color: #f5f5f5; /* Cor de fundo mais suave */
        box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* Sombra sutil */
    }

    .v-btn {
        transition: all 0.3s ease; /* Suaviza a transição de estados do botão */
    }

    .v-btn:hover {
        transform: translateY(-2px); /* Efeito de levitação ao passar o mouse */
        box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* Sombra mais intensa ao hover */
    }
</style>
