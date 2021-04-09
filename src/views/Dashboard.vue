<template>
 
     <v-container justify-center>

       <div class="hidden-sm-and-up">
         <Dashboard :profile="profile" />
       </div>

      <div class="hidden-sm-and-down">
        <Miniboard title="Your Top Artists" background='artist' route='/top-artists' />
        <Miniboard title="Your Top Tracks" background='track' route='/top-tracks' />
        <Miniboard title="Your Recents" background='recent' route='/recently-played' />
        <Miniboard title="Discover Artists" background='discover' route='/discover-artists' />
      </div>

      <Redirect />
    </v-container>



</template>

<script>

  import Dashboard from '@/components/Dashboard';
  import Miniboard from '@/components/common/Miniboard';
  import Redirect from '@/components/common/Redirect';

  import axios from 'axios';

  export default {
    components: {Miniboard, Redirect, Dashboard},
    data() {
      return {
          profile: null,
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
      await this.getUser();
    }
  }
</script>

<style scoped>
  .container{
    padding: 0;
  }
</style>