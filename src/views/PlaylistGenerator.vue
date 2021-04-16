<template>
    <v-container width=80 justify-center>

        <Header header_title="Generate Playlists" header_background='playlist' />


        <!-- Search and Toggler -->
        <v-row align="center">
            <v-col xl="10" lg="10" md="10" sm="10" cols="8">
                <v-autocomplete 
                    dark :search-input.sync="search" :items="items" :readonly="inspirations.length >= 5" :loading="isLoading" chips clearable hide-details hide-selected item-text="name" item-value="id" :label="queryLabel" @input="displaySimilar" return-object solo rounded>
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-title>
                                    Find Playlist Inspirations
                                </v-list-item-title>
                            </v-list-item>
                        </template>

                        <template v-slot:selection="{ attr, on, item, selected }">
                            <v-chip v-bind="attr" :input-value="selected" color="blue-grey" class="white--text" v-on="on">
                                <v-avatar left>
                                    <v-img v-if="type == 'track' && item.album" :src="item.album.images[0].url"></v-img>
                                    <v-img v-else-if="type == 'artist' && item.images.length > 0" :src="item.images[0].url"></v-img>
                                </v-avatar>
                                <span v-text="item.name"></span>
                            </v-chip>
                        </template>

                        <template v-slot:item="{ item }">
                            <v-list-item-avatar  v-if="item != undefined && item != null">
                                <v-img v-if="type == 'track' && item.album" :src="item.album.images[0].url"></v-img>
                                <v-img v-else-if="type == 'artist' && item.images.length > 0" :src="item.images[0].url"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"></v-list-item-title>
                                <v-list-item-subtitle v-if="type == 'track'" v-text="item.artists[0].name"></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon v-if="type == 'track'">mdi-album</v-icon>
                                <v-icon v-if="type == 'artist'">mdi-account</v-icon>
                            </v-list-item-action>
                        </template>
                </v-autocomplete>
            </v-col>
            <v-col xl="2" lg="2" md="2" sm="2" cols="4" >
                <v-btn-toggle mandatory dark >
                    <v-btn @click="toggleSearch('track')"><v-icon color="white">mdi-album</v-icon></v-btn>
                    <v-btn @click="toggleSearch('artist')"><v-icon color="white">mdi-account</v-icon></v-btn>
                </v-btn-toggle>
            </v-col>
        </v-row>
        

        <!-- Select Inspiration -->
        <v-card dark flat class="my-5 pa-2">
                <v-card-title>
                    <h4 class="left">Your Inspirations</h4>
                </v-card-title>
                <v-card-subtitle v-if="inspirations.length == 0">
                    <h5>Pick a few artists, tracks to get started</h5>
                </v-card-subtitle>
                <v-chip close @click:close="removeInspiration(item.id)" color="blue-grey" class="short white--text ma-2" v-for="(item, i) in inspirations" :key="i">
                        <v-avatar left>
                            <v-img v-if="item.album" :src="item.album.images[0].url"></v-img>
                            <v-img v-else-if="item.images && item.images.length > 0" :src="item.images[0].url"></v-img>
                        </v-avatar>
                        <span v-text="item.name"></span>
                    </v-chip>

                <!-- Add sliders -->

                <v-card-text>
                    <h5>Beta</h5>
                </v-card-text>


            </v-card>

            <!-- Playlist Slider and TrackCards -->
            <v-row class="my-5" v-if="inspirations.length > 0">
                <v-col xl="4" lg="4" md="6" sm="12" cols="12">
                    <v-expansion-panels dark accordion>
                        <v-expansion-panel class="pa-3">
                            <v-expansion-panel-header>Playlist Settings</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-text-field
                                label="Playlist Title"
                                v-model="playlistName"
                                hide-details="auto"
                                ></v-text-field>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel class="pa-3">
                            <v-expansion-panel-header>Tracklist Settings</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row dense>
                                    <v-col align="center" cols="12">
                                        <v-btn color="success" @click="generatePlaylist">
                                            Update Playlist
                                        </v-btn>
                                    </v-col>
                                    
                                    <v-col cols="12">
                                        <v-subheader class="pl-0">
                                        Acousticness : <span class="slider-value"> {{displayAcousticnessInfo()}} </span>
                                        </v-subheader>
                                        <v-slider
                                        v-model="acousticness"
                                        ></v-slider>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-subheader class="pl-0">
                                        Tempo : <span class="slider-value"> {{tempo}} BPM</span>
                                        </v-subheader>
                                        <v-slider
                                        min="50"
                                        max="200"
                                        v-model="tempo"
                                        ></v-slider>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-subheader class="pl-0">
                                        Instrumentalness : <span class="slider-value"> {{displayInstrumentalInfo()}} </span>
                                        </v-subheader>
                                        <v-slider
                                        v-model="instrumentalness"
                                        ></v-slider>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-subheader class="pl-0">
                                        Popularity : <span class="slider-value"> {{displayPopularityInfo()}} </span>
                                        </v-subheader>
                                        <v-slider
                                        v-model="popularity"
                                        ></v-slider>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-subheader class="pl-0">
                                        Mood : <span class="slider-value">  {{ displayMoodInfo() }} </span>
                                        </v-subheader>
                                        <v-slider v-model="mood">
                                        </v-slider>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-subheader class="pl-0">
                                        Energy : <span class="slider-value"> {{displayEnergyInfo()}} </span>
                                        </v-subheader>
                                        <v-slider
                                        v-model="energy"
                                        ></v-slider>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-subheader class="pl-0">
                                        Danceablity : <span class="slider-value"> {{displayDanceabilityInfo()}} </span>
                                        </v-subheader>
                                        <v-slider
                                        v-model="danceability"
                                        ></v-slider>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
                <v-col xl="8" lg="8" md="6" sm="12" cols="12" class="playlist-tracks">
                    <v-btn v-if="playlistItems.length > 0" small  color="green" class="playlist-export-button" @click="createPlaylist">
                        <v-icon>mdi-export</v-icon> Export Playlist
                    </v-btn>
                    <v-card dark class="pa-2" >
                        <TrackCards :items="playlistItems" type="track" />
                         <span align='center' v-if="playlistItems.length == 0" >
                            <h3>No tracks found</h3>
                        </span>
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
import TrackCards from '@/components/usertop/TrackCards';

export default {
    components: {Header, Redirect, TrackCards},
    data(){
        return{
            //Autocomplete data
            items: [],
            isLoading: false,
            model: null,
            tab: null,
            search: null,
            type: "track",
            queryLabel: "Search for Tracks",

            selected: null,    //selected artist info
            
            inspirations: [],

            //playlists
            playlistItems: [],
            playlistName: "MusicHabits - Discover",
            playlistDescription: "Highly personalized with MusicHabits based on your inspirations. Check musichabits.netlify.app for more",
            playlistId: null,

            //sliders
            popularity: 50,
            instrumentalness: 4,
            acousticness: 50,
            mood: 50,
            tempo: 110,
            energy: 50,
            danceability: 40,

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
        //Slider info display
        displayPopularityInfo(){
                if(this.popularity <= 33) return 'Playing at Bars'
                else if(this.popularity > 33 && this.popularity < 67) return 'Rising'
                else return 'World Tour'
        },
        displayInstrumentalInfo(){
                if(this.instrumentalness <= 33) return 'Lyrical'
                else if(this.instrumentalness > 33 && this.instrumentalness < 67) return 'Mix'
                else return 'No Vocals'
        },
        displayAcousticnessInfo(){
                if(this.acousticness <= 33) return 'Digital'
                else if(this.acousticness > 33 && this.acousticness < 67) return 'Mix'
                else return 'Analog'
        },
        displayTempoInfo(){
                if(this.acousticness <= 33) return 'Digital'
                else if(this.acousticness > 33 && this.acousticness < 67) return 'Mix'
                else return 'Analog'
        },
        displayMoodInfo(){
                var moods = ['😭', '😢', '☹️', '🙁', '😐', '🙂', '😊', '😁', '😄', '😍'];
                return moods[Math.min(Math.floor(this.mood / 10), 9)]
        },
        displayEnergyInfo(){
                if(this.energy <= 33) return 'Calm'
                else if(this.energy > 33 && this.energy < 67) return 'Fun'
                else return 'Energizer'
        },
        displayDanceabilityInfo(){
                if(this.danceability <= 33) return 'Not Danceable'
                else if(this.danceability > 33 && this.danceability < 67) return 'Decent'
                else return 'Great for Dance'
        },

        
        toggleSearch(type){
            this.type = type;
            if(type == 'track') this.queryLabel = "Search for Tracks";
            else this.queryLabel = "Search for Artists";
            this.getUserTop();
        },
        removeInspiration(id){
           this.inspirations = this.inspirations.filter(i=> i.id != id)
           this.generatePlaylist();
        },
        displaySimilar: async function(val){
            this.selected = val;
            //Only push value if it is valid and doesn't already exist
            if(val != null && val.id){
                var id = val.id;
                var found = false;
                for(var i = 0; i < this.inspirations.length; i++) {
                    if (this.inspirations[i].id == id) {
                        found = true;
                        break;
                    }
                }
                if(!found) this.inspirations.push(val);
            }
            this.generatePlaylist();
        },
        //The autocomplete search function that calls spotify API
        doSearch: _.debounce(function() {
            if(this.search == null || this.search.length == 0) return;
            this.isLoading = true  //Start the loading bar animation
            var url = `https://api.spotify.com/v1/search?q=${this.search}&type=${this.type}&market=from_token&limit=50`;
            axios.get(url, {headers: {Authorization: "Bearer " + localStorage.access_token}})
                 .then((response) => {
                    if(response.data.error || !response.data) 
                        this.items = [];
                    else
                        if(this.type == 'track')
                            this.items = response.data.tracks.items; 
                        else
                            this.items = response.data.artists.items;
                    })    
                .catch(e => console.log(e))
                .finally(() => (this.isLoading = false))    //End the loading bar animatiom
        },200),
        async getUserTop(){
            var queryName = this.type + "short_term";
            const artist = sessionStorage.getItem(queryName);
            if(artist){
            await this.getUserTopFromLocal(queryName);
            }else{
            await this.getUserTopFromAPI(queryName);
            }
        },
        async getUserTopFromAPI(queryName){
            const url = `https://yourmusichabit.herokuapp.com/api/user/top-${this.type}s?term=short_term`;
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
        async generatePlaylist(){
            const artistIds = [], trackIds = [], genreIds = [];
            this.inspirations.forEach(i => {
                if(i.type == 'track') trackIds.push(i.id);
                else artistIds.push(i.id);
            })
            const url = `https://api.spotify.com/v1/recommendations?limit=100&market=from_token&seed_artists=${artistIds}&seed_tracks=${trackIds}&seed_genres=${genreIds}`;
            axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token
                },
                params: {
                    target_popularity: this.popularity,
                    target_tempo: this.tempo,
                    target_valence: this.mood/100,
                    target_energy: this.energy/100,
                    target_instrumentalness: this.instrumentalness/100,
                    target_acousticness: this.acousticness/100,
                    target_danceability: this.danceability/100,
                },
                })
                 .then((response) => {
                    if(response.data.error || !response.data) 
                        this.playlistItems = [];
                    else
                        this.playlistItems = response.data.tracks;
                    })    
                .catch(this.playlistItems = [])
            //this.createPlaylist();
        },
        async createPlaylist(){
            const user = JSON.parse(localStorage.getItem("profile"));
            const url = 'https://api.spotify.com/v1/users/' + user.id + '/playlists';
            const response = await axios(url, {
                method: 'POST',
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.access_token,
                    'Content-Type': 'application/json'
                },
                data: {
                    "name": this.playlistName,
                    "description": this.playlistDescription,
                    "public": false
                }
            })
            this.playlistId = response.data.id;
            this.addTracksToPlaylist();
        },
        async addTracksToPlaylist(){
            const uris = [];
            this.playlistItems.forEach(track => {
                uris.push(track.uri);
            })

            const url = `https://api.spotify.com/v1/playlists/${this.playlistId}/tracks?uris=${uris}`;
            await axios(url, {
                method: 'POST',
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.access_token,
                    'Content-Type': 'application/json'
                },
            })
        }
    },
    async mounted(){
        await this.getUserTop();
    }
}
</script>


<style scoped>
    /* CSS Reset */
a { margin:0; padding:0; font-size:100%; line-height:1; text-underline-offset: none;}

.playlist-tracks{
    position: relative;
}

.playlist-export-button{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
}

/* slider */
.slider-value{
    font-weight: bold;
    text-indent: 1rem;
}

</style>