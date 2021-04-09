<template>
    <div class="stats text-center">

        <v-btn-toggle mandatory class="mb-4">
          <v-tabs>
            <v-tab class="caption black white--text">Yesterday</v-tab>
            <v-tab class="caption black white--text">Past Week</v-tab>
          </v-tabs>
        </v-btn-toggle>


        <v-slide-group v-model="model" class="pa-3" mandatory prev-icon="mdi-minus" next-icon="mdi-plus">
            <v-slide-item v-for="n in 5" :key="n" v-slot="{ active, toggle }">
                <v-card class="ma-2" height="150" width="150" @click="toggle">
                    <v-img :src="formatBg(n)" width="150" height="150"></v-img>
            
                    <v-row class="fill-height" align="center" justify="center">
                        <v-scale-transition>
                            <v-overlay v-if="active" :absolute=true :value=true color="white"></v-overlay>
                        </v-scale-transition>
                    </v-row>

                </v-card>
            </v-slide-item>
        </v-slide-group>


        <div class="content">
            <div v-if="model == 0">
                <StatsArtists :topArtists="topArtists"/>
            </div>
            <div v-if="model == 1">
                <StatsTracks :topTracks="topTracks"/>
            </div>
            <div v-if="model == 2">
                <StatsSessions :sessions="sessions"/>
            </div>

        </div>
        
        
        
    </div>
</template>

<script>
import axios from 'axios';

import StatsTracks from './StatsTracks';
import StatsArtists from './StatsArtists';
import StatsSessions from './StatsSessions';

export default {
    name: "Stats",
    components: {StatsTracks, StatsArtists, StatsSessions},
    data(){
        return{

            //mandatory
            model: null,
        
            //Related to fetch request for user history
            count: 1,    // 0 = today/this week, 1 = yesterday/last week
            type: "days",
            
            //Returned value
            topTracks: null,
            topArtists: null,
            duration: null,
            sessions: null
        }
    },
    methods:{
        formatBg(image){
            return require('@/assets/slidegroup/' + image + '.png');
        },
        async getStats(){
            if(sessionStorage.stats){
                await this.getStatsFromLocal();
            }else{
                await this.getStatsFromAPI();
            }
        },
        async getStatsFromAPI(){
          const url = "https://yourmusichabit.herokuapp.com/api/users/stats"
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
            sessionStorage.setItem('stats', JSON.stringify(data));
            this.topTracks = data.topTracks;
            this.topArtists = data.topArtists;
            this.duration = data.duration;
            this.sessions = data.sessions;
        },
        async getStatsFromLocal(){
            const data = JSON.parse(sessionStorage.getItem('stats'));
            this.topTracks = data.topTracks;
            this.topArtists = data.topArtists;
            this.duration = data.duration;
            this.sessions = data.sessions;
        },
    },
    async mounted(){
      await this.getStats();
    }
}
</script>


