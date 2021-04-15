import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import TopTracks from '../views/TopTracks.vue'
import TopArtists from '../views/TopArtists.vue'
import Recent from '../views/Recent.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import DiscoverArtists from '../views/DiscoverArtists.vue'
import PlaylistGenerator from '../views/PlaylistGenerator.vue'

Vue.use(VueRouter)

//Make sure the Home page doesn't heve the navbar
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/top-tracks',
    name: 'Top Tracks',
    component: TopTracks
  },
  {
    path: '/top-artists',
    name: 'Top Artists',
    component: TopArtists
  },
  {
    path: '/recently-played',
    name: 'Recent',
    component: Recent
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/discover-artists',
    name: 'DiscoverArtists',
    component: DiscoverArtists
  },
  {
    path: '/generate-playlists',
    name: 'PlaylistGenerator',
    component: PlaylistGenerator
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
