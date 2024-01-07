<template>
  <div class="main-layout">
    <slot></slot>
  </div>
</template>

<script>

</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;

  box-sizing: border-box;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
}
body {
  background-color: #e0e0e0;
  font-family: sans-serif;
}
.mr-4 {
    margin-right: 4px;
}
.mr-8 {
    margin-right: 8px;
}
.mr-16 {
    margin-right: 16px;
}
.mb-20 {
    margin-bottom: 20px;
}
.mb-24 {
    margin-bottom: 24px;
}
.gap-15 {
    display: flex;
    flex-direction: column;
    grid-gap: 15px;
}
.link {
    color: cornflowerblue;
    cursor: pointer;
    &:hover {
        color: black;
    }
    &:active {
        color: cornflowerblue;
    }
    &_red {
        color: indianred;
        &:hover {
            color: black;
        }
        &:active {
            color: indianred;
        }
    }
}
</style>