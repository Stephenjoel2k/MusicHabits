<template>
    <v-container width=80 justify-center>

        <Header header_title="Discover Artists" header_background='discover' />
        
        <!-- Toolbar to search a song -->
            <v-autocomplete dark :search-input.sync="search" :items="items" :loading="isLoading" chips clearable
            hide-details hide-selected item-text="name" item-value="id" :label="query_label" @input="onInput" return-object solo rounded>

                <template v-slot:no-data>
                    <v-list-item>
                        <v-list-item-title>
                            Find Similar Artists
                        </v-list-item-title>
                    </v-list-item>
                </template>

                <template v-slot:selection="{ attr, on, item, selected }">
                    <v-chip v-bind="attr" :input-value="selected" color="blue-grey" class="white--text" v-on="on">
                        <v-avatar left>
                            <v-img v-if="type == 'track'" :src="item.album.images[0].url"></v-img>
                            <v-img v-else-if="item.images.length > 1" :src="item.images[0].url"></v-img>
                        </v-avatar>
                        <span v-text="item.name"></span>
                    </v-chip>
                </template>

                <template v-slot:item="{ item }">
                    <v-list-item-avatar  v-if="item != undefined && item != null">
                        <v-img v-if="type == 'track'" :src="item.album.images[0].url"></v-img>
                        <v-img v-else-if="item.images.length > 1" :src="item.images[0].url"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                    
                    <v-list-item-subtitle v-if="type == 'track'" v-text="item.artists[0].name"></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                    <v-icon>{{icon}}</v-icon>
                    </v-list-item-action>
                </template>

            </v-autocomplete>

        <!-- The top "similar to" artist -->
        <v-card dark class="mt-5" v-if="selected != null">
            <h3 class="text-center grey">Artists similar to</h3>
            <div class="d-flex flex-no-wrap justify-space-between"> 
              <div>
                <v-card-title >
                    {{selected.name}}
                    <a :href=selected.external_urls.spotify target="_blank">
                        <img class="ml-2" height="24" src="https://img.icons8.com/fluent/48/000000/spotify.png"/>
                    </a>
                    
                </v-card-title>
                
                <v-flex class="d-flex flex-wrap ma-2">
                    <v-btn outlined small  @click="playPreview(selected.id)">Preview</v-btn>
                </v-flex>
              </div>
              <v-avatar class="ma-3" size="100" tile>
                <v-img :src="selected.images[1].url"></v-img>
              </v-avatar>
            </div>
        </v-card>

        <v-divider class="ma-3"></v-divider>

            <div class="text-center" v-if="selected != null" @click="shuffle">
                <v-btn class="green ma-2">
                    Random <v-icon>
                        mdi-shuffle
                    </v-icon>
                </v-btn>
            </div>
        
    
    <div class="text-center">
        <v-btn class="error ma-2" v-if="preview != null" @click="stopAudio">
            Stop <v-icon>
                mdi-stop
            </v-icon>
        </v-btn>
        <v-btn class="warning ma-2" v-if="player == false && track != null" @click="player = !player">
            Play <v-icon>
                mdi-play
            </v-icon>
        </v-btn>
    </div>



  <div class="text-center" v-if="track!=null">
    <v-bottom-sheet dark inset v-model="player">

      <v-card tile>
        <v-progress-linear
          :value="20"
          class="my-0"
          height="3"
        ></v-progress-linear>

        <v-list>
          <v-list-item>
              <v-list-item-avatar tile>
                    <img :src="track.album.images[0].url">
                </v-list-item-avatar>
            <v-list-item-content>
                
              <v-list-item-title>{{track.artists[0].name}}</v-list-item-title>
              <v-list-item-subtitle>{{track.name}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-spacer></v-spacer>

            <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
              <v-btn icon @click="stopAudio">
                <v-icon>mdi-stop</v-icon>
              </v-btn>
              <v-btn icon @click="togglePlayState">
                <v-icon>{{playback_icon}}</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon :color="color" @click="toggleLike">mdi-heart</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon
              class="ml-0"
              :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }"
            >
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-card>
    </v-bottom-sheet>
  </div>

    <v-row dense>

        <!-- The component tracks -->
        <v-col v-for="(item) in related_artists" :key="item.id" cols="12">
          <v-card dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title>
                    {{item.name}}
                    <a :href=item.external_urls.spotify target="_blank">
                        <img class="ml-2" height="24" src="https://img.icons8.com/fluent/48/000000/spotify.png"/>
                    </a>
                </v-card-title>
                <v-flex class="d-flex flex-wrap">
                    <v-btn outlined small class="ma-2" @click="playPreview(item.id)">Preview</v-btn>
                <!-- Add function to preview similar -->
                    <v-btn outlined small class="ma-2" @click="displaySimilar(item)">Find Similar</v-btn>
                </v-flex>
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
import _ from 'lodash';

export default {
    components: {Header},
    data(){
        return{
            items: [],
            related_artists: [],
            query_label: "Search Artist",
            type: "artist",
            search: null,
            icon: "mdi-account",
            isLoading: false,
            model: null,
            tab: null,
            selected: null,
            preview: null,
            track: null,
            player: false,
            playback_icon: "mdi-pause",
            color: null
        }
    },
    watch: {
        search() {
            this.doSearch();
        },
        model (val) {
        if (val != null) this.tab = 0
        else this.tab = null
      },
    },
    methods: {
        displaySimilar: function(val){
            this.selected = val;
            this.getSimilarArtists();
        },
        onInput: function(val) {
            this.selected = val;
            this.getSimilarArtists();
        },

        doSearch: _.debounce(function() {
            if(this.search == null || this.search.length == 0){
                return;
            }

             this.isLoading = true

            var url = "https://api.spotify.com/v1/search?q=" + this.search + "&type=" + this.type;
            if(localStorage.profile){
                const profile = JSON.parse(localStorage.getItem('profile'));
                url = "https://api.spotify.com/v1/search?q=" + this.search + "&type=" + this.type + "&market=" + profile.country;
            }
            axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token
                }
            })
            
            .then((response) => {
                if(response.data.error || !response.data){
                    this.items = [];
                }else if(response.data){
                    this.items = response.data[this.type + "s"].items;
                }
            })    
            .catch(e => console.log(e))
            .finally(() => (this.isLoading = false))
        },200),

        //THIS IS THE FUNCTION WE NEED TO WOK ON
        async playPreview(id) {
            var url = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`;
            if(localStorage.profile){
                const profile = JSON.parse(localStorage.getItem('profile'));
                url = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${profile.country}`;
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token,
                }
            })
            const tracks = [] 
            response.data.tracks.forEach(track => {
                if(track.preview_url != null){
                    tracks.push(track);
                }
            })
            if(this.preview != null){
                this.stopAudio()
            }
            const length = tracks.length;
            const random = this.getRandomInt(length-1);
            if(tracks.length > 1){
                this.track = tracks[random];
                console.log(this.track);
                this.preview = new Audio(this.track.preview_url);
            }
            this.playAudio()
        },
        async shuffle(){
            var length = this.related_artists.length;
            var random = this.getRandomInt(length-1);
            var id = this.related_artists[random].id;
            await this.playPreview(id);
        },
        playAudio(){
            this.player = !this.player;
            this.playback_icon = "mdi-pause";
            this.preview.play();
        },
        togglePlayState(){
            if(this.playback_icon == "mdi-pause"){
                this.preview.pause();
                this.playback_icon = "mdi-play";
            }else{
                this.preview.play();
                this.playback_icon = "mdi-pause";
            }
        },
        toggleLike(){
            if(this.color){
                this.color = null;
            }else{
                this.color = "error";
            }
        },
        stopAudio(){
            this.preview.pause();
            this.preview = null;
            this.track = null
        },

        async getSimilarArtists(){
            const url = `https://api.spotify.com/v1/artists/${this.selected.id}/related-artists`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token,
                }
            })
            this.related_artists = response.data.artists;
            
        },
        getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
    },
    async mounted(){
        if(!localStorage.access_token){
            this.$router.push('/');
        }
    }
}
</script>


<style scoped>
    /* CSS Reset */
a { margin:0; padding:0; font-size:100%; line-height:1; text-underline-offset: none;}
</style>