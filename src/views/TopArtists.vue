<template>


    <v-container width=80 justify-center >
      
      <Header header_title="Top Artists" header_background='artist' />
      <TermButtons @display-top="getUserTop" />
      <Preloader :items="items"/>
      
      <!-- Display the Artists -->
      <v-row dense>
        <v-col v-for="(item, i) in items" :key="i" cols="12">
          <v-card dark :href=item.external_urls.spotify target="_blank">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title>{{i+1}} - {{item.name}}</v-card-title>
                <v-card-subtitle>{{item.genres}}</v-card-subtitle>
                <v-card-subtitle> popularity: {{item.popularity}}%</v-card-subtitle>
              </div>
              <v-avatar class="ma-3" size="100" tile>
                <v-img :src="item.images[1].url"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

    </v-container>

</template>

<script>

  import axios from 'axios';
  import Header from '../components/Header';
  import Preloader from '../components/Preloader';
  import TermButtons from '../components/TermButtons';

  export default {
    components: {Header, Preloader, TermButtons},
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
         var queryName = "artists" + term;
         const artist = sessionStorage.getItem(queryName);
        if(artist){
          await this.getUserTopFromLocal(queryName);
        }else{
          await this.getUserTopFromAPI(queryName);
        }
      },
      async getUserTopFromAPI(queryName){
        const url = "https://yourmusichabit.herokuapp.com/api/user/top-artists?term=" + this.term;
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
      if(!localStorage.access_token){
        this.$router.push('/');
      }
      await this.getUserTop(this.term);
    }
  }
</script>

