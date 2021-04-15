<template>
    <v-container width=80 justify-center>

        <Header header_title="Generate Playlists" header_background='playlist' />
        

        <!-- Toggle Artist/Track Buttons -->
        <v-row align="center" justify="center" class="mb-2"> 
            <v-btn-toggle mandatory dark >
                <v-btn @click="toggleSearch('track')"><v-icon color="white">mdi-album</v-icon></v-btn>
                <v-btn @click="toggleSearch('artist')"><v-icon color="white">mdi-account</v-icon></v-btn>
            </v-btn-toggle>
        </v-row>


        <!-- Searchbar to search a artists/Tracks -->
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
                <v-card-text v-if="inspirations.length > 0">
                    <v-btn color="green" @click="generatePlaylist">
                        <v-icon>mdi-playlist-plus</v-icon>
                    </v-btn>
                </v-card-text>


                <!-- Add sliders -->
                <!-- Popularity Slider -->
                <v-card-text>
                    <h5>Beta</h5>
                </v-card-text>


            </v-card>


            <TrackCards :items="playlistItems" type="track" />


        
        

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
            
            //sliders
            popularity: 50,
            playlistItems: [],

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
        increase (val) {
            Object.keys(val)[0] += Object.values(val)[0] - 10 || 0;
        },
        decrease (val) {
            Object.keys(val)[0] += Object.values(val)[0] - 10 || 0;
        },
        toggleSearch(type){
            this.type = type;
            if(type == 'track') this.queryLabel = "Search for Tracks";
            else this.queryLabel = "Search for Artists";
            this.getUserTop();
        },
        removeInspiration(id){
           this.inspirations = this.inspirations.filter(i=> i.id != id)
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
            const artistIds = [], trackIds = [];
            this.inspirations.forEach(i => {
                if(i.type == 'track') trackIds.push(i.id);
                else artistIds.push(i.id);
            })
            const url = `https://api.spotify.com/v1/recommendations?limit=100&market=from_token&seed_artists=${artistIds}&seed_tracks=${trackIds}`;
            axios.get(url, {headers: {Authorization: "Bearer " + localStorage.access_token}})
                 .then((response) => {
                    if(response.data.error || !response.data) 
                        this.playlistItems = [];
                    else
                        this.playlistItems = response.data.tracks;
                    })    
                .catch(e => console.log(e))
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

.short{
  max-width:120px;
}
.short span{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>