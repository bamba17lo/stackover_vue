<template>
  <div class="col-md-6">
    <div v-if="question" >
      
      
        <div v-for="reponse in question.reponses" :key="reponse.id" class="d-flex post-entry">
        <div class="custom-thumbnail">
        <h2>{{ question.user.prenom }} :</h2>
      </div>
      <div class="post-content">
          <h3 class="reponse-content">{{ reponse.contenu }}</h3>
          <div class="post-meta">
            <span>Posted : {{ formatDate(reponse.created_at) }}</span>
             <button class="btn btn-success ml-2" @click="validerReponse(reponse.id)" :disabled="reponse.validation">Valider</button>
          </div>
          </div>
        </div>
      
    </div>
    <div v-else>
      <p>Chargement des détails de la question...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const token = localStorage.getItem('token'); // Récupère le token JWT depuis le localStorage

const config = { 
  headers: { 
    Authorization: `Bearer ${token}` // Ajoute le token JWT dans l'en-tête Authorization
  }
};

export default {
  name: 'DetailEtudiant',
  data() {
    return {
      question: null,
      isLoading: true, // Indicateur de chargement initialisé à true
      error: ''
    };
  },
  created() {
    this.getQuestionDetails();
  },
  methods: {
    async getQuestionDetails() {
    let url = `http://127.0.0.1:8000/api/questions/${this.$route.params.id}`;
    try {
      const response = await axios.get(url);
      this.question = response.data.question;
      console.log("Loaded Question:", this.question);
    } catch (error) {
      console.error("Error fetching question details:", error);
      this.error = 'Une erreur est survenue lors du chargement des détails de la question.';
    } finally {
      this.isLoading = false; // Le chargement est terminé
    }
  },

      formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
async validerReponse(reponseId) {
  try {
   
    const url = `http://127.0.0.1:8000/api/reponses/${reponseId}/valider`;
    const response = await axios.put(url,null,config);

    // Vérification du statut de la réponse HTTP
    if (response.status == 200) {
  const reponseIndex = this.question.reponses.findIndex(r => r.id === reponseId);
  if (reponseIndex !== -1) {
    this.question.reponses[reponseIndex].validation = true;
  }
  alert('Réponse validée avec succès!');
} else {
  console.error('Statut de réponse inattendu :', response.status);
}
  } catch (error) {
  
    console.error('Erreur lors de la validation de la réponse :', error);

    alert('Erreur lors de la validation de la réponse.');
  }
},

isUserSupervisor() {
      // Vérifier si l'utilisateur est un superviseur
      return localStorage.getItem('user_role') === 'superviseur'; // Assurez-vous que le rôle est correctement stocké dans localStorage
    }
   
  },



  
};
</script>

