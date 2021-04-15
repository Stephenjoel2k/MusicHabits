<template>
    <header v-bind:style="bgc">
        <div class="images">
            <v-img v-if="random1" :src="random1" class="under" width="180px" height="180px" > </v-img>
            <v-img v-if="random2" :src="random2" class="above" width="170px" height="170px"/>
        </div>
        <div class="menu">
            <span v-if="greeting" class="greeting">{{greeting}},</span>
            <h1 v-if="profile">{{profile.display_name}}</h1>
            <div class="menu-options">
                <Miniboard title="My Top Artists" background='artist' route='/top-artists' />
                <Miniboard title="My Top Tracks" background='track' route='/top-tracks' />
                <Miniboard title="My Recents" background='recent' route='/recently-played' />
                <Miniboard title="My Insights" background='insight' route='/profile' />
                <Miniboard title="Discover Artists" background='discover' route='/discover-artists' />
                <Miniboard title="Generate Playlists" background='playlist' route='/generate-playlists' />
            </div>
        </div>
    </header>
    
</template>


<script>
import axios from 'axios';
import Miniboard from '@/components/common/Miniboard';

export default {
    name: 'Dashboard',
    components: {Miniboard},
    props: {
        profile: Object,
    },
    data(){
        return{
            items: [],
            term: "short_term",
            greeting: null,
            random1: null,
            random2: null,
            imageColors: null,
            bgc: {
                background: '',
                color: '',
            }
        }
    },
    methods: {
        computeGreeting(){
            var date = new Date();
            const time = date.getHours();
            if(time >= 4 && time < 12) this.greeting = "Good Morning";
            else if(time >= 12 && time < 17) this.greeting = "Good Afternoon";
            else this.greeting = "Good Evening";
        },
        routeTo(route){
            this.$router.push(route);
        },
      async setRandom(){
        var success = false;
        while(!success){
            var length = this.items.length;
            var random1 = Math.floor(Math.random() * Math.floor(length-1));
            var random2 = Math.floor(Math.random() * Math.floor(length-1));
            if(random1 == random2 && random1 < 25) random2 = random2 + 3;
            else random2 = random2 - 5;
            var randomArtist1 = this.items[random1];
            var randomArtist2 = this.items[random2];
            if((randomArtist1 && randomArtist1.images) && (randomArtist2 && randomArtist2.images)) {
                success = true;
                var image1 = randomArtist1.images[0].url;
                var image2 = randomArtist2.images[0].url;
                var url = "https://yourmusichabit.herokuapp.com/api/miscellaneous/colors";
                var response = await axios.get(url, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                    params: {
                        image1, image2
                    }
                });
                var imageColors = response.data.data;
                this.random1 = image1;
                this.random2 = image2;
                this.imageColors = imageColors;
                const new_color1 = this.LightenDarkenColor(imageColors.image2[1].hex, -10);
                const new_color2 = this.LightenDarkenColor(imageColors.image2[1].hex, 55);
                this.bgc.background = `linear-gradient( 135deg,${new_color1}, ${new_color2})` 
                this.bgc.color = this.LightenDarkenColor(imageColors.image1[0].hex, 200);
            } 
        }
    },
    LightenDarkenColor(col,amt) {
            var usePound = false;
            if ( col[0] == "#" ) {
                col = col.slice(1);
                usePound = true;
            }

            var num = parseInt(col,16);

            var r = (num >> 16) + amt;

            if ( r > 255 ) r = 255;
            else if  (r < 0) r = 0;

            var b = ((num >> 8) & 0x00FF) + amt;

            if ( b > 255 ) b = 255;
            else if  (b < 0) b = 0;

            var g = (num & 0x0000FF) + amt;

            if ( g > 255 ) g = 255;
            else if  ( g < 0 ) g = 0;

            return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
    },
    isMyColorBright(color){
            var r = color.red;
            var g = color.green;
            var b = color.blue;

            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

            if (luma < 40) {
                console.log("too dark")
            }else{
                console.log("bright")
            }
    },
    async getUserTop(){
         var queryName = "artists" + this.term;
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
        this.computeGreeting();
      await this.getUserTop();
      this.setRandom();
    }
}
</script>


<style scoped>

    header{
        height: 70vh;
        max-height: 450px;
        border-radius: 0 0 90px 20px;
    }

    .images{
        height: 275px;
    }

    .under{
        position: absolute;
        top: 40px;
        left: 180px;
        border-radius: 30px;

        -webkit-animation: fadein 1.2s, mover 2.5s infinite  alternate ;
        animation: fadein 1.2s, mover 2.5s infinite  alternate ;
        animation-delay: 0ms, 2000ms;
    }
    
    .above{
        position: absolute;
        top: 70px;
        left: 20px;
        border-radius: 30px;

        -webkit-animation: fadein 2s alternate, mover 2.25s infinite  alternate ;
        animation: fadein 2s alternate, mover 2.25s infinite  alternate ;
        animation-delay: 0ms, 3000ms;
    }

    @keyframes fadein {
        0% {opacity: 0; }
        25%{ opacity: 0;  transform: scale(0.5);}
        100% {opacity: 1; transform: scale(1);}
    }
    @-webkit-keyframes fadein {
        0% {opacity: 0; }
        25%{ opacity: 0;  -webkit-transform: scale(0.5);}
        100% {opacity: 1; -webkit-transform: scale(1);}
    }


    @-webkit-keyframes mover {
        0% { -webkit-transform: translateY(0); }
        100% { -webkit-transform: translateY(-12px); }
    }
    @keyframes mover {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
    }

    .menu{
        margin: 0 10%;
    }

    @import url('https://fonts.googleapis.com/css2?family=Signika:wght@600&display=swap');
    h1{
        position: absolute;
        white-space: nowrap;
        animation: floatText 2s alternate ease-in-out;
    }

    .greeting{
        font-family: 'Signika', sans-serif;
        animation: floatText 2s alternate ease-in-out;
    }


    .menu-options{
        position: relative;
        top: 75px;
        font-family:'Signika', sans-serif;
        padding-bottom: 80px;
        -webkit-animation: fadein 2s alternate, mover 2.25s infinite  alternate ;
        animation: fadein 2s alternate, mover 2.25s infinite  alternate ;
        animation-delay: 0ms, 3000ms;
    }

    @-webkit-keyframes floatText{
        0% {left: 0%; opacity: 0; }
        66%{ left: 0%; opacity: 0; }
        100% { left: 10%; opacity: 1;}
    }

    @keyframes floatText{
        0% {left: 0%; opacity: 0; }
        66%{ left: 0%; opacity: 0; }
        100% { left: 10%; opacity: 1;}
    }


</style>