<template>
    <v-container width=80 justify-center>

        <Header header_title="Discover Artists" header_background='discover' />
        
        <!-- Searchbar to search a artists -->
        <v-autocomplete 
            dark :search-input.sync="search" :items="items" :loading="isLoading" chips clearable hide-details hide-selected item-text="name" item-value="id" label="Search an Artist" @input="displaySimilar" return-object solo rounded>

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
                            <v-img v-else-if="item.images.length > 0" :src="item.images[0].url"></v-img>
                        </v-avatar>
                        <span v-text="item.name"></span>
                    </v-chip>
                </template>

                <template v-slot:item="{ item }">
                    <v-list-item-avatar  v-if="item != undefined && item != null">
                        <v-img v-if="type == 'track'" :src="item.album.images[0].url"></v-img>
                        <v-img v-else-if="item.images.length > 0" :src="item.images[0].url"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.name"></v-list-item-title>
                        <v-list-item-subtitle v-if="type == 'track'" v-text="item.artists[0].name"></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-action>
                </template>

        </v-autocomplete>

        <!-- The selected artist -->
        <v-card 
            dark class="mt-5" v-if="selected != null">
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
                    <v-btn outlined small  @click="previewTrackFromArtist(selected.id)">Preview</v-btn>
                </v-flex>
              </div>
              <v-avatar class="ma-3" size="100" tile>
                <v-img v-if="selected.images.length > 0 && selected.images[0].url" :src="selected.images[0].url"></v-img>
                <span v-else>N.A</span>
              </v-avatar>
            </div>
        </v-card>


        <!-- Playback button -->
        <div class="playback-buttons" v-if="selected">
            <v-divider class="ma-3"></v-divider>
            <div class="text-center">
                <v-btn class="green ma-2" v-if="selected != null" @click="shuffle">
                    <v-icon>
                        mdi-shuffle
                    </v-icon>
                </v-btn>
                <v-btn class="error ma-2" v-if="preview != null" @click="stopAudio">
                    <v-icon>
                        mdi-stop
                    </v-icon>
                </v-btn>
                <v-btn class="warning ma-2" v-if="preview != null" @click="playAudio">
                    <v-icon>
                        mdi-play
                    </v-icon>
                </v-btn>
            </div>
            <v-divider class="ma-3"></v-divider>
        </div>

        <!-- The music player -->
        <!-- Problems: The music progress bar isn't synced. -->
        <div class="text-center" v-if="track!=null">
            <v-bottom-sheet dark inset v-model="player">

            <v-card tile>
                <v-progress-linear
                :value="preview_progress"
                class="my-0"
                height="3"
                ></v-progress-linear>

                <v-list>
                <v-list-item>
                   
                    <v-list-item-avatar tile>
                        <img v-if="track.album.images[0].url" :src="track.album.images[0].url">
                        <span v-else>{{track.name[0]}}</span>
                    </v-list-item-avatar>
                    
                    <v-list-item-content>    
                        <v-list-item-title>{{track.artists[0].name}}</v-list-item-title>
                        <v-list-item-subtitle>{{track.name}}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-spacer></v-spacer>

                    <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
                        <v-btn icon @click="toggleLike">
                            <v-icon v-if="!liked">mdi-heart-outline</v-icon>
                            <v-icon v-else color="error" >mdi-heart</v-icon>
                        </v-btn>
                        <v-btn icon @click="togglePlayState">
                            <v-icon>{{playback_icon}}</v-icon>
                        </v-btn>
                        <v-btn icon @click="shuffle">
                            <v-icon>mdi-shuffle</v-icon>
                        </v-btn>
                    </v-list-item-icon>
                </v-list-item>
                </v-list>
            </v-card>
            </v-bottom-sheet>
        </div>
        

        <!-- Similar tracks component -->
        <v-row dense v-if="related_artists.length > 1">
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
                        <v-btn outlined small class="ma-2" @click="previewTrackFromArtist(item.id)">Preview</v-btn>
                    <!-- Add function to preview similar -->
                        <v-btn outlined small class="ma-2" @click="displaySimilar(item)">Find Similar</v-btn>
                    </v-flex>
                </div>
                <v-avatar class="ma-3" size="100" tile>
                    <v-img v-if="item.images.length > 0 && item.images[0].url" :src="item.images[0].url"></v-img>
                    <span v-else>N.A</span>
                </v-avatar>
                </div>
            </v-card>
            </v-col>
        </v-row>

        <Redirect />

    </v-container>
</template>

<script>

import axios from 'axios';
import _ from 'lodash';

import Header from '@/components/common/Header';
import Redirect from '@/components/common/Redirect';

export default {
    components: {Header, Redirect},
    data(){
        return{
            //Autocomplete data
            items: [],
            isLoading: false,
            model: null,
            tab: null,
            search: null,
            type: "artist",

            selected: null,    //selected artist info
            related_artists: [],   //related artists similar to the selected artist

            artist_top_tracks: null,   //top tracks artist the user wants to preview music of
            preview: null,     //preview url
            track: null,       //Track info of the previewing song
            player: false,      //Player state toggle
            playback_icon: "mdi-pause",     //Default playback state
            liked: false,         //Like/Dislike the current song
            preview_progress: 0,
            timeout: null
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
        displaySimilar: async function(val){
            this.selected = val;
            await this.getSimilarArtists();
        },
        shuffle(){
            this.preview_progress = 0;
            var length = this.related_artists.length;
            var random = this.getRandomInt(length-1);
            var id = this.related_artists[random].id;
            this.previewTrackFromArtist(id);
        },
        playAudio(){
            this.player = true;
            this.playback_icon = "mdi-pause";
            this.preview.play();
            window.clearTimeout(this.timeout);
            this.previewProgressUpdate();
        },
        previewProgressUpdate() {
            if(this.preview_progress < 100 && this.playback_icon == "mdi-pause") {
                this.timeout = setTimeout(() => {
                    this.preview_progress += 0.33333333333
                    this.previewProgressUpdate()
                }, 100)
            }
        },
        pauseAudio(){
            this.preview.pause();
            this.playback_icon = "mdi-play";
        },
        togglePlayState(){
            if(this.playback_icon == "mdi-pause") this.pauseAudio();
            else this.playAudio();
        },
        async likeTrack(){
            const url = `https://api.spotify.com/v1/me/tracks?ids=${this.track.id}`;
            await axios.put(url, {}, {headers: { Authorization: "Bearer " + localStorage.access_token} })
            this.liked = true;
        },
        async unlikeTrack(){
            const url = `https://api.spotify.com/v1/me/tracks?ids=${this.track.id}`;
            await axios.delete(url,{headers: { Authorization: "Bearer " + localStorage.access_token} })
            this.liked = false;
        },
        async toggleLike(){
            if(this.liked) await this.unlikeTrack();
            else await this.likeTrack();
        },
        stopAudio(){
            this.preview.pause();
            this.preview = null;
            this.track = null
            this.preview_progress = 0;
        },
        //The autocomplete search function that calls spotify API
        doSearch: _.debounce(function() {
            if(this.search == null || this.search.length == 0) return;
            this.isLoading = true  //Start the loading bar animation
            var url = `https://api.spotify.com/v1/search?q=${this.search}&type=artist&market=from_token`;
            axios.get(url, {headers: {Authorization: "Bearer " + localStorage.access_token}})
                 .then((response) => {
                    if(response.data.error || !response.data) 
                        this.items = [];
                    else
                        this.items = response.data.artists.items;
                    })    
                .catch(e => console.log(e))
                .finally(() => (this.isLoading = false))    //End the loading bar animatiom
        },200),
        
        async previewTrackFromArtist(id) {
            await this.getArtistTopTracks(id);
            if(this.preview) this.pauseAudio();  //stop audio if currently playing
            this.preview_progress = 0;   
            const length = this.artist_top_tracks.length;
            const random = this.getRandomInt(length-1);
            this.track = this.artist_top_tracks[random];
            this.preview = new Audio(this.track.preview_url);
            this.playAudio()
            this.liked = false;
        },
        async getArtistTopTracks(id){
            var url = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=from_token`;
            const response = await axios.get(url, {headers: {Authorization: "Bearer " + localStorage.access_token}})
            const tracks = response.data.tracks;
            const artist_top_tracks = [];
            for(let i = 0; i < tracks.length; i++){
                if(tracks[i].preview_url){
                    artist_top_tracks.push(tracks[i]);
                }
            }
            this.artist_top_tracks = artist_top_tracks;
       },
        async getSimilarArtists(){
            const url = `https://api.spotify.com/v1/artists/${this.selected.id}/related-artists`;
            const response = await axios.get(url, {headers: {Authorization: "Bearer " + localStorage.access_token}})
            this.related_artists = response.data.artists;
        },
        getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
    },
}
</script>


<style scoped>
    /* CSS Reset */
a { margin:0; padding:0; font-size:100%; line-height:1; text-underline-offset: none;}
  .container{
    padding: 0!important;
  }
</style>