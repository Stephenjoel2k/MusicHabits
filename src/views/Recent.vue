<template>
    

    <v-container width=80 justify-center>
 
      <v-card flat class="py-5" color="#EAEBEB">
        <v-img src="../assets/recent.jpg" class="white--text align-end" height="200px">
        <v-card-text>
          <v-row align="center" justify="center">
            <h1 class="text-center display-2">
                Recently Played
              </h1>
            <v-col cols="12" class="mb-5">
              
            </v-col>
          </v-row>
        </v-card-text>
        </v-img>
      </v-card>



      <!-- Can be a separate component called as tracks/artists cards -->
      <v-row dense>
        <v-col v-for="(item, i) in items" :key="i" cols="12">
          <v-card dark :href=item.track.external_urls.spotify target="_blank">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title>{{item.track.name}}</v-card-title>
                <v-card-subtitle>{{item.track.album.artists[0].name}}</v-card-subtitle>
                <v-card-subtitle>{{format(item.played_at)}}</v-card-subtitle>
              </div>
    
              <v-avatar class="ma-3" size="100" tile>
                <v-img :src="item.track.album.images[1].url"></v-img>
              </v-avatar>
            </div>

          </v-card>
        </v-col>
      </v-row>

    </v-container>

</template>

<script>

  import axios from 'axios';
  import moment from 'moment'

  export default {
    data() {
      return {
        items: [],
      }
    },
    methods : {
      async getRecentlyPlayed(){
        const access_token = localStorage.access_token;
        const url = "https://api.spotify.com/v1/me/player/recently-played?limit=50"
        const response = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + access_token
          }
        });
        this.items = response.data.items;
      },
      format(value){
        if(value){
          return moment(String(value)).format('MM/DD hh:mm A')
        }
      }
    },
    async mounted(){
      if(!localStorage.access_token){
        this.$router.push('/');
      }

      await this.getRecentlyPlayed();
    }
  }
</script>