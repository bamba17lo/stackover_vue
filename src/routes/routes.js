import QuestionList from '../components/QuestionList';
import ConnexionPage from '../components/ConnexionPage';
import AddQuestion from '../components/AddQuestion';
import AddReponse from '../components/AddReponse';
import DetailEtudiant from '../components/DetailEtudiant';
import { createRouter, createWebHistory } from 'vue-router';

const routes =[

    {
        path: '/',
        redirect: '/login' // Rediriger par défaut vers /questions
      },

      {
        name:'DetailEtudiant',
        path: '/etudiant/show/:id?',
        component:DetailEtudiant
    },

    {
        name:'AddReponse',
        path: '/etudiant/edit/:id?',
        component:AddReponse
    },

      {
        name:'ConnexionPage',
        path: '/login',
        component: ConnexionPage
    },
    
    {
        name:'QuestionList',
        path: '/questions',
        component: QuestionList
    },

    {
        name:'AddQuestion',
        path: '/addquestion',
        component: AddQuestion
    },
    
];

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router;