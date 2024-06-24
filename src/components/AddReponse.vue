<template>
  <div class="add-reponse">
    <h2>Répondre à une question</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="contenu">Contenu de la réponse :</label><br>
        <textarea id="contenu" v-model="reponse.contenu" rows="4" cols="50" required></textarea>
      </div>
      <div v-if="errors.length > 0" class="alert alert-danger">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </div>
      <button type="submit" class="btn btn-primary">Ajouter Réponse</button>
    </form>
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
  name: 'AddReponse',
  data() {
    return {
      reponse: {
        contenu: '',
        
      },
      errors: [] // Tableau pour stocker les erreurs de validation
    };
  },
  methods: {

    async handleSubmit() {
  this.errors = [];
  if (!this.reponse.contenu) {
    this.errors.push("Le champ contenu doit être rempli");
  }

  const user_id = localStorage.getItem('user_id');
  console.log('user_id:', user_id);

  if (!this.errors.length) {
    try {
      const formData = new FormData();
      formData.append('contenu', this.reponse.contenu);
      formData.append('user_id', user_id);
      

      const url = `http://127.0.0.1:8000/api/questions/${this.$route.params.id}/reponses`;
      const response = await axios.post(url, formData, config); // Utilisation de `config` ici

      if (response.status === 201) {
        this.reponse.contenu = '';
        alert(response.data.message);
        this.$router.push('/questions');
      } else {
        console.error('Statut de réponse inattendu :', response.status);
      }
    } catch (error) {
      this.errors.push(error.response.data.message);
      console.error('Erreur lors de la soumission :', error);
    }
  }
}
  }
};
</script>

<style scoped>
.add-reponse {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

textarea {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
