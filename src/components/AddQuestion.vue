<template>
  <div class="add-question">
    <h2>Poser une nouvelle question</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="contenu">Contenu de la question :</label><br>
        <textarea id="contenu" v-model="question.contenu" rows="4" cols="50" required></textarea>
      </div>
      <div>
        <label for="theme">Thème :</label><br>
        <select id="theme" v-model="question.theme_id" required>
          <option v-for="theme in themes" :key="theme.id" :value="theme.id">{{ theme.libelle }}</option>
        </select>
      </div>
      <button type="submit">Ajouter</button>
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
    name: 'AddQuestion',
    data() {
    return {
      question: {},
        contenu: '',
       
        errors:[],
        themes: [] // Ajout de la propriété classes pour stocker les classes récupérées
     
    }
   
},
mounted() {
    this.getThemes(); // Appel de la méthode getClasses lors du montage du composant
  },
methods:{
  
  async getThemes() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/themes');
        this.themes = response.data.theme;
      } catch (error) {
        console.error('Erreur lors de la récupération des classes :', error);
      }
    },
  async handleSubmit() {
  this.errors = [];
  if (!this.question.contenu) {
    this.errors.push("Le champ contenu doit être rempli");
  }
  if (!this.question.theme_id) {
    this.errors.push("Le champ thème doit être sélectionné");
  }

  const user_id = localStorage.getItem('user_id');
  console.log('user_id:', user_id);

  if (!this.errors.length) {
    try {
      const formData = new FormData();
      formData.append('contenu', this.question.contenu);
      formData.append('theme_id', this.question.theme_id);
      formData.append('user_id', user_id);
      

      const url = 'http://127.0.0.1:8000/api/questions';
      const response = await axios.post(url, formData, config); // Utilisation de `config` ici

      if (response.status === 201) {
        this.question.contenu = '';
        this.question.theme_id = '';
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
}
</script>



<style scoped>
.add-question {
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
textarea, select {
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
