<template>
 
    <!-- This page should display the member's history with the app -->
     <v-container width=80 justify-center>

        <Header :header_title=profile.display_name header_background="profile" />

        <h3>Name : {{ profile.display_name }}</h3>
        <h3>Email : {{ profile.email }}</h3>
        <h3>Followers : {{ profile.followers.total }}</h3>
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
            const access_token = localStorage.access_token;
            const url = "https://api.spotify.com/v1/me"
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + access_token
                }
            });
            this.profile = response.data;
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