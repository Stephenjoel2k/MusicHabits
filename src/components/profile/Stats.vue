<template>
    <div class="stats text-center">

        <v-row align="center" justify="center">
            <v-btn-toggle mandatory class="mb-4">
            <v-tabs>
                <v-tab class="caption black white--text" @click="today">Today</v-tab>
                <v-tab class="caption black white--text" @click="week">This Week</v-tab>
                <v-tab class="caption black white--text" @click="month">This Month</v-tab>
            </v-tabs>
            </v-btn-toggle>
        </v-row>

        
        <v-expansion-panels dark>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    Top Artists
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                <Preloader :items="artists"/>

                <div class="display-Artists" v-if="artists.length > 0">
                    <v-card class="my-3" dark>
                        <v-data-table
                            :headers="headersArtists"
                            :items="artists"
                        ></v-data-table>
                    </v-card>
                </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    Top Tracks
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                <Preloader :items="tracks"/>

                <div class="display-Tracks" v-if="tracks.length > 0">
                    <v-card class="my-3" dark>
                        <v-data-table
                            :headers="headersTracks"
                            :items="tracks"
                        ></v-data-table>
                    </v-card>
                </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        

    </div>
</template>

<script>

import axios from 'axios';

import Preloader from "../common/Preloader";

export default {
    name: "Stats",
    components: {Preloader},
    data(){
        return{

            //mandatory
            model: null,
        
            //Related to fetch request for user history
            count: 0,    // 0 = today/this week, 1 = yesterday/last week
            type: "days",
            
            //Returned value
            topTracks: null,
            topArtists: null,
            duration: null,
            sessions: null,

            //Artists Table
            headersArtists: [
            {
                text: 'Name',
                align: 'start',
                filterable: false,
                value: 'name',
            },
                { text: 'Position: ', value: 'pos' },
                { text: 'Followers', value: 'followers' },
                { text: 'Popularity%', value: 'popularity' },
                { text: 'Streams #', value: 'listens' },
            ],
            artists: [],

            //Tracks Table
            headersTracks: [
            {
                text: 'Name',
                align: 'start',
                filterable: false,
                value: 'name',
            },
                { text: 'Position: ', value: 'pos' },
                { text: 'Release Date', value: 'release_date' },
                { text: 'Artists', value: 'artists' },
                { text: 'Popularity%', value: 'popularity' },
                { text: 'Streams #', value: 'listens' },
            ],
            tracks: []
        }
    },
    methods:{
        formatBg(image){
            return require('@/assets/slidegroup/' + image + '.png');
        },
        today(){
            this.artists = [];
            this.tracks = [];
            this.count = 0;
            this.type = 'days';
            this.getStats();
        },
        week(){
            this.artists = [];
            this.tracks = [];
            this.count = 0;
            this.type = 'weeks';
            this.getStats();
        },
        month(){
            this.artists = [];
            this.tracks = [];
            this.count = 0;
            this.type = 'months'
            this.getStats();
        },
        async getStats(){
            var statsSpan = 'stats' + this.type + this.count;
            if(sessionStorage[statsSpan]){
                await this.getStatsFromLocal();
            }else{
                await this.getStatsFromAPI();
            }
            await this.updateArtists();
            await this.updateTracks();
        },
        async getStatsFromAPI(){
          const url = "https://yourmusichabit.herokuapp.com/api/user/stats"
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token,
                    "Access-Control-Allow-Origin": "*",
                },
                params: {
                    "type": this.type,
                    "count": this.count,
                    "offset": new Date().getTimezoneOffset()
                }
            });
            const data = response.data.data;
            var statsSpan = 'stats' + this.type + this.count;
            sessionStorage.setItem(statsSpan, JSON.stringify(data));
            this.topTracks = data.topTracks;
            this.topArtists = data.topArtists;
            this.duration = data.duration;
            this.sessions = data.sessions;
        },
        async getStatsFromLocal(){
            var statsSpan = 'stats' + this.type + this.count;
            const data = await JSON.parse(sessionStorage.getItem(statsSpan));
            this.topTracks = data.topTracks;
            this.topArtists = data.topArtists;
            this.duration = data.duration;
            this.sessions = data.sessions;
        },
        updateArtists(){
            const topArtists = this.topArtists;
            const artists = [];
            for(let i = 0; i < topArtists.length; i++){
                var artist = topArtists[i].artist;
                const artist_schema = {
                    name: artist.name,
                    pos: i+1,
                    followers: artist.followers,
                    popularity: artist.popularity,
                    listens: topArtists[i].listens,
                };
                artists.push(artist_schema);
            }
            this.artists = artists;
        },
        updateTracks(){
            const topTracks = this.topTracks;
            const tracks = [];
            for(let i = 0; i < topTracks.length; i++){
                var track = topTracks[i].track;
                const artists = track.artists.map(artist => artist.name);
                const track_schema = {
                    name: track.name,
                    pos: i+1,
                    release_date: track.album.date,
                    artists: artists,
                    popularity: track.popularity,
                    listens: topTracks[i].listens
                };
                tracks.push(track_schema);
            }
            this.tracks = tracks;
        }             
    },
    async mounted(){
      await this.getStats();
    }
}
</script>


