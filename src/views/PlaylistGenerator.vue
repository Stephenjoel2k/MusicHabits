<template>
    <v-container width=80 justify-center>

        <Header header_title="Generate Playlists" header_background='discover' />
        
        <!-- Searchbar to search a artists/Tracks -->
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

    
        <!-- Selected artists -->
        <v-card dark class="mt-5" v-if="selected != null">
            <div class="d-flex flex-no-wrap justify-space-between"> 
              <div>
                <v-card-title >
                    {{selected.name}}
                </v-card-title>
              </div>
              <v-avatar class="ma-3" size="50" tile>
                <v-img v-if="selected.images.length > 0 && selected.images[0].url" :src="selected.images[0].url"></v-img>
                <span v-else>N.A</span>
              </v-avatar>
            </div>
        </v-card>

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
        await this.getUserTop("short_term");
    }
}
</script>


<style scoped>
    /* CSS Reset */
a { margin:0; padding:0; font-size:100%; line-height:1; text-underline-offset: none;}

</style>