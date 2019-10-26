<template>
	<div class="main-content scrollBar-inner" style="height: 512px;background-color: white;">
		<keep-alive>
			<component
				v-bind:is="currComponent" v-if="!$route.meta.keepAlive"
			></component>
		</keep-alive>
	</div>
</template>

<script src="../../js/view/layout/MainContent.js"></script>
