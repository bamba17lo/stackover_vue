<template>
  <div>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'; // Assurez-vous que votre importation d'axios est correcte ici

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    login() {

        axios.post('http://127.0.0.1:8000/api/login', {
      email: this.email,
      password: this.password
    })
    .then(/* eslint-disable-next-line */ response => {
      // Enregistrement du token dans le localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('user_role', response.data.user_role);

      // Calcul de l'expiration du token (exemple : 1 heure)
      const tokenExpiration = Date.now() + 3600 * 1000;
      localStorage.setItem('tokenExpiration', tokenExpiration);

      // Redirection vers la route 'questions'
      this.$router.push('/questions');
    })
    .catch(error => {
      this.handleError(error); // Gestion de l'erreur
    });


   

    },

    handleError(error) {
      this.error = 'Informations Invalides';
      console.error(error);
    },

    refreshToken(oldToken) {
      axios.post('http://127.0.0.1:8000/api/refresh', {
          token: oldToken
        })
        .then(response => {
            console.log(response); // Exemple de débogage
          // Calcul de l'expiration du token (exemple : 1 heure)
          const tokenExpiration = Date.now() + 3600 * 1000;
          localStorage.setItem('tokenExpiration', tokenExpiration);
        })
        .catch(error => {
          this.handleError(error); // Gestion de l'erreur
        });
    },

    checkTokenAndRefresh() {
      const token = localStorage.getItem('token');
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      
      if (token && tokenExpiration) {
        const now = Date.now();
        if (now > tokenExpiration) {
          // Le token est expiré, procédez au rafraîchissement du token
          this.refreshToken(token);
        }
      }
    }

  },
   
mounted() {
    this.checkTokenAndRefresh(); // Vérifie le token lors du chargement de l'application
  }

    
};
</script>
