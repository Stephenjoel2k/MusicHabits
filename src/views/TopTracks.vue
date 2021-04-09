<template>
 
     <v-container width=80 justify-center>
       
      <Header header_title="Your Top Tracks" header_background='track' />
      <TermButtons @display-top="getUserTop" />
      <Preloader :items="items"/>
      <TrackCards :items="items" type="track" />
      <Redirect />

    </v-container>

</template>

<script>

  import axios from 'axios';
  
  import Header from '@/components/common/Header';
  import Preloader from '@/components/common/Preloader';
  import Redirect from '@/components/common/Redirect';

  import TermButtons from '@/components/usertop/TermButtons';
  import TrackCards from '@/components/usertop/TrackCards';

  export default {
    components: {Header, Preloader, TermButtons, TrackCards, Redirect},
    data() {
      return {
        items: [],
        term: "long_term"
      }
    },
    methods : {
       // term is emitted from button as a parameter to the function.
       // So we need to update the term 
       async getUserTop(term){
         this.term = term;
         var queryName = "tracks" + term;
         const track = sessionStorage.getItem(queryName);
        if(track){
          await this.getUserTopFromLocal(queryName);
        }else{
          await this.getUserTopFromAPI(queryName);
        }
      },
      async getUserTopFromAPI(queryName){
        const url = "https://yourmusichabit.herokuapp.com/api/user/top-tracks?term=" + this.term;
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token,
                    "Access-Control-Allow-Origin": "*",
                }
            });
        const data = response.data.data;
        sessionStorage.setItem(queryName, JSON.stringify(data));
        this.items = data.items;
      },
      async getUserTopFromLocal(queryName){
        this.items = JSON.parse(sessionStorage.getItem(queryName)).items;
      },
    },
    async mounted(){
      await this.getUserTop(this.term);
    }
  }
</script>


<style scoped>
  .container{
    padding: 0!important;
  }
</style>