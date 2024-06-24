<template>
<div class="col-md-6">
<div v-for="question in questions" :key="question.id" class="d-flex post-entry">
 
      <div class="custom-thumbnail">
        <img src="images/person_1.jpg" alt="Image" class="img-fluid">
      </div>
      <div class="post-content">
        <h3>{{ question.contenu }}</h3>
        <div class="post-meta">
          <span>Posted:</span> {{ formatDate(question.created_at) }}
          <router-link class="btn btn-primary ml-2" :to="{name:'AddReponse', params:{id: question.id}}" >Repondre</router-link>
          <router-link v-if="isLoggedIn()" class="btn btn-warning ml-2" :to="{name:'DetailEtudiant', params:{id: question.id}}" >Les reponses</router-link>
        </div>
      </div>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

const token = localStorage.getItem('token'); // Récupère le token JWT (JSON Web Token) depuis le localStorage

const config = { 
  headers: { 
    Authorization: `Bearer ${token}` // Ajoute le token JWT dans l'en-tête Authorization
  }
};

export default {
  name: 'QuestionList',
  data() {
    return {
      questions: [],
      themes: [],
      error: ''
    };
  },
  created() {
    this.getQuestions();
    this.getThemes();
  },
  methods: {
    async getQuestions() {
      try {
        let url = 'http://127.0.0.1:8000/api/question';
        const response = await axios.get(url, config); 
        this.questions = response.data.question;
        console.log(this.questions);
      } catch (error) {
        console.log('Erreur lors de la récupération des questions :', error);
        this.error = 'Erreur lors de la récupération des questions';
      }
    },
    async getThemes() {
      try {
        let url = 'http://127.0.0.1:8000/api/themes';
        const response = await axios.get(url, config); // Utilisation de config ici
        this.themes = response.data.theme;
        console.log(this.themes);
      } catch (error) {
        console.log('Erreur lors de la récupération des thèmes :', error);
        this.error = 'Erreur lors de la récupération des thèmes';
      }
    },
    getClassById(theme_id) {
      const theme = this.themes.find(theme => theme.id === theme_id);
      return theme ? theme.libelle : 'Thème inconnu';
    },
    isLoggedIn() {
      return !!localStorage.getItem('user_id'); // Vérifie si user_id est présent dans localStorage
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  mounted() {
    console.log('Question List Component mounted');
  }
};
</script>


