import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import router from './router';

import { VApp, VMain, VAppBar, VBtn, VToolbarTitle, VSpacer } from 'vuetify/components';

const vuetify = createVuetify({
  components: {
    VApp,
    VMain,
    VAppBar,
    VBtn,
    VToolbarTitle,
    VSpacer,
  },
});

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.mount('#app');
