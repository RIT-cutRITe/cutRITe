<script setup lang="ts">
import GeneratorCard from './GeneratorCard.vue';
import Modal from './Modal.vue';
import { ref } from 'vue'


const props = defineProps<{
  name: string
  image?: string
  title: string
  type: string
}>()

const dialog = ref(false)

const openModal = (open:any) =>{
  dialog.value = open
}

</script>


<template>

    <GeneratorCard 
        :name="props.name"
        :image="props.image"
        :title="props.title"
        :type="props.type"
        @open="openModal"
    />

    <Modal v-model="dialog" :name="props.name"/>

</template>
<style scoped></style>