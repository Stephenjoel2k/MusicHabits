<template>
 
    <!-- This page should display the member's history with the app -->
     <v-container width=80 justify-center>

        <Header :header_title=profile.display_name header_background="profile" />

        <h3>Name : {{ profile.display_name }}</h3>
        <h3>Email : {{ profile.email }}</h3>
        <h3>Account Type : {{profile.product}}</h3>

    </v-container>



</template>

<script>

  import axios from 'axios';
  import Header from '../components/Header';

  export default {
    components: {Header},
    data() {
      return {
          profile: ""
      }
    },
    methods : {
        async getUser(){
            if(localStorage.profile){
              await this.getUserFromLocal();
            }else{
              await this.getUserFromAPI();
            }
        },
        async getUserFromAPI(){
          const url = "https://yourmusichabit.herokuapp.com/api/user"
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token,
                    "Access-Control-Allow-Origin": "*",
                }
            });
            const profile = response.data.data;
            this.profile = profile
            localStorage.setItem('profile', JSON.stringify(profile));
        },
        async getUserFromLocal(){
          this.profile = JSON.parse(localStorage.getItem('profile'));
        }
    },
    async mounted(){
    if(!localStorage.access_token){
        this.$router.push('/');
      }
      await this.getUser(this.term);
    }
  }
</script>