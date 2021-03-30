<template>
    

    <v-container width=80 justify-center>
 
      <Header header_title="Recently Played" header_background='cool' />

      <!-- Can be a separate component called as tracks/artists cards -->
      <Preloader :items="items" />

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
  import Header from '../components/Header'
  import Preloader from '../components/Preloader.vue';

  export default {
    components: {Header, Preloader},
    data() {
      return {
        items: [],
      }
    },
    methods : {
      format(value){
        if(value){
          return moment(String(value)).format('MM/DD hh:mm A')
        }
      },
      async getRecentlyPlayed(){
        if(sessionStorage.recents){
          await this.getRecentlyPlayedFromLocal();
        }else{
          await this.getRecentlyPlayedFromAPI();
        }
      },
      async getRecentlyPlayedFromAPI(){
        const url = "https://yourmusichabit.herokuapp.com/api/user/recently-played"
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token,
                    "Access-Control-Allow-Origin": "*",
                }
            });
        const data = response.data.data;
        sessionStorage.setItem('recents', JSON.stringify(data));
        this.items = data.items;
      },
      async getRecentlyPlayedFromLocal(){
        this.items = JSON.parse(sessionStorage.getItem('recents')).items;
      },
    },
    async mounted(){
      if(!localStorage.access_token){
        this.$router.push('/');
      }
      await this.getRecentlyPlayed();
    }
  }
</script>