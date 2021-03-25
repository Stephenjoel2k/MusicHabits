<template>


    <v-container width=80 justify-center >

      <Header header_title="Top Artists" header_background='artist' />
      
      <!-- Can eb a separate buttons component -->
      <v-row align="center" justify="center">
        <v-btn-toggle mandatory class="mb-3">
          <v-btn @click="displayTop('long_term')" class="caption black white--text">All Time</v-btn>
          <v-btn @click="displayTop('medium_term')" class="caption black white--text">~ 6 Months</v-btn>
          <v-btn @click="displayTop('short_term')" class="caption black white--text" >~ 1 Month</v-btn>
        </v-btn-toggle>
      </v-row>
      

      <!-- Can be a separate component called as tracks/artists cards -->
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

  export default {
    components: {Header},
    data() {
      return {
        items: [],
        term: "long_term"
      }
    },
    methods : {
      async displayTop(term){
        const access_token = localStorage.access_token;
        this.term = term;

        const url = "https://api.spotify.com/v1/me/top/artists?time_range=" + this.term + "&limit=50";
        const response = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + access_token
          }
        });
        this.items = response.data.items;
      }
    },
    async mounted(){
      if(!localStorage.access_token){
        this.$router.push('/');
      }
      await this.displayTop(this.term);
    }
  }
</script>

