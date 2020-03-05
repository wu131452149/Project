<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                msg: 'hello everyone',
                isRouterAlive: true,
            }
        },
        mounted: function () {

        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true
                });
            },
            activated: function () {
                this.getCase();
            }
        }

    }
</script>

<style>
    #app {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100%;
    }
</style>
