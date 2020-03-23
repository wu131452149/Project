<template>
	<div class="main-content scrollBar-inner" style="height:100%;background-color: white;">
        <!--<div class="left-sidebar-wrap scrollBar">-->
            <!--<router-view name="leftSidebar"></router-view>-->
        <!--</div>-->
		<keep-alive>
			<component
				v-bind:is="currComponent" v-if="!$route.meta.keepAlive"
			></component>
		</keep-alive>
	</div>
</template>

<script src="../../js/view/layout/MainContent.js"></script>
