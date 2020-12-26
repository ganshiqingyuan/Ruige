<template>
  <div class="login_warp">
    <el-form
      class="login_form
    "
      label-width="100px"
    >
      <el-form-item label="用户名">
        <el-input v-model="username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login: function() {},
  },
};
</script>

<style lang="less">
.login_warp {
  .login_form {
    width: 400px;
    margin: 300px auto;
  }
}
</style>
