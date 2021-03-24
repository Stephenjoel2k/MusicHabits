<template>
 
     <v-container width=80 justify-center>

      
      <v-card flat class="py-5" color="#EAEBEB">
        <v-img src="../assets/track.jpg" class="white--text align-end" height="200px">
        <v-card-text>
         
          <v-row align="center" justify="center">
            <v-col cols="12" class="mb-5">
              <h1 class="text-center display-2">
                Top Tracks
              </h1>
            </v-col>
          </v-row>

          
          <v-row align="center" justify="center">
            <v-btn-toggle mandatory class="mb-5">
              <v-btn @click="displayTop('long_term')" class="caption black white--text">All Time</v-btn>
              <v-btn @click="displayTop('medium_term')" class="caption black white--text">~ 6 Months</v-btn>
              <v-btn @click="displayTop('short_term')" class="caption black white--text" >~ 1 Month</v-btn>
            </v-btn-toggle>
          </v-row>
        </v-card-text>
      </v-img>
      </v-card>



      <v-row dense>
        <v-col v-for="(item, i) in items" :key="i" cols="12">
          <v-card dark :href=item.external_urls.spotify target="_blank">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title>{{i+1}} - {{item.name}}</v-card-title>
                <v-card-subtitle>{{item.artists[0].name}}</v-card-subtitle>
                <v-card-subtitle> popularity: {{item.popularity}}%</v-card-subtitle>
              </div>
    
              <v-avatar class="ma-3" size="100" tile>
                <v-img :src="item.album.images[1].url"></v-img>
              </v-avatar>
            </div>

          </v-card>
        </v-col>
      </v-row>



    </v-container>

</template>

<script>

  import axios from 'axios';
  
  export default {
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

        const url = "https://api.spotify.com/v1/me/top/tracks?time_range=" + this.term + "&limit=50";
        const response = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + access_token
          }
        });
        this.items = response.data.items;
      }
    },
    // This is bruteforced. We need to make sure that we don't have to copy paste these two lines in every component
    async mounted(){
      if(!localStorage.access_token){
        this.$router.push('/');
      }
      await this.displayTop(this.term);
    }
  }
</script>