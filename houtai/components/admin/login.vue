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
      <el-form-item label="验证码">
        <el-input
          @keyup.enter.native="login"
          style="width:100px;"
          size="small"
          placeholder="验证码"
          prefix-icon="el-icon-search"
          v-model="captcha"
        ></el-input>
        <img v-if="showCaptcha" :src="captchaSrc" />
        <span style="cursor:pointer;" @click="getCaptcha">换一张</span>
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
      showCaptcha: true,
      username: "",
      password: "",
      captcha: "",
      captchaSrc: "/getCaptcha",
    };
  },
  methods: {
    login: function() {
      const requestData = {
        username: this.username,
        password: this.password,
        captcha: this.captcha,
      };

      this.$rq.login(requestData).then((res) => {
        if (res) {
          localStorage.auth = res.data;
          this.$router.push("/");
        }
      });
    },
    getCaptcha: function() {
      this.captchaSrc = "/getCaptcha" + "?a=" + Math.random();
    },
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
