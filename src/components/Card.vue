<template>
  <div>
    <b-card 
      bg-variant="light"
      class="text-center"
      :border-variant="type"
      :header-border-variant="type"
    >
      <template #header>
        <slot name="header"></slot>
      </template>

      <b-card-body>
        <b-card-text>
          <slot></slot>
        </b-card-text>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props:['type']
}
</script>

<style>

</style>